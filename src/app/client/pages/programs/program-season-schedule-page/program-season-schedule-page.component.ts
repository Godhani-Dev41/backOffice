import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DaysOfWeek } from "@app/shared/components/week-days-hours-select/week-days-hours-select.component";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { ConstraintItem } from "@app/shared/components/schedule-constraints/schedule-constraints.component";
import { ProgramsService, RCProgramSubSeason, SegmentItem } from "@app/shared/services/programs/programs.service";
import _ from "lodash";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export type ActivityTimes = { dayOfWeek: number; open: string; close: string };

@Component({
  selector: "rc-program-season-schedule-page",
  templateUrl: "./program-season-schedule-page.component.html",
  styleUrls: ["./program-season-schedule-page.component.scss"],
})
export class ProgramSeasonSchedulePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  loading: boolean;
  prgLoading: boolean;
  seasonLoading: boolean;
  programName: string;
  seasonName: string;
  weekData: DaysOfWeek[] = [];
  constraints: ConstraintItem[] = [];
  sessions: SegmentItem[] = [];
  segmentType: "program_season" | "event" = "program_season";
  seasonForm: FormGroup;

  updateMode: boolean = false;
  confirmModal: NzModalRef;
  dangerousUpdateAccepted: boolean;

  constructor(
    private router: Router,
    private location: Location,
    public programsService: ProgramsService,
    public programsFormService: ProgramsFormService,
    private activeRoute: ActivatedRoute,
    private modal: NzModalService,
  ) {
    this.seasonForm = this.programsFormService.seasonForm;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.programsService.loadingProgram$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.prgLoading = loading;
      if (this.seasonLoading === this.prgLoading) this.loading = loading;
    });

    this.programsService.loadingSeason$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.seasonLoading = loading;
      if (this.seasonLoading === this.prgLoading) this.loading = loading;
    });

    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg) {
        this.programName = prg.name;
      }
    });

    this.programsService.seasonEdit$.pipe(takeUntil(this.destroy$)).subscribe((editMode) => {
      if (!editMode) this.updateMode = false;
      if (editMode === "shallow") {
        this.updateMode = true;
      }
      if (editMode === "full") {
        this.updateMode = false;
      }
    });

    const tempActTimes = this.programsService.createActivityTimes(
      this.programsFormService.seasonForm.get("activityTimes").value,
    );

    if (this.programsFormService.seasonForm.get("activityTimes").value!.length > 0) {
      for (let day of this.seasonForm.get("activityTimes").value) {
        const tempAT: DaysOfWeek = {
          index: day.dayOfWeek,
          startTimeValue: day.open,
          finishTimeValue: day.close,
          active: true,
        };
        tempActTimes.splice(
          tempActTimes.findIndex((a) => a.index === day.dayOfWeek),
          1,
          { ...tempAT },
        );
      }
      this.weekData = [...tempActTimes];
    } else {
      const tempActTimes = this.programsService.createActivityTimes([]);
      this.weekData = [...tempActTimes];
    }
    if (this.seasonForm.get("blockedDated").value) {
      for (let c of this.seasonForm.get("blockedDated").value) {
        this.constraints.push({
          index: c.id,
          name: c.name,
          startDate: c.startDate,
          finishDate: c.endDate,
          active: true,
          editing: false,
        });
      }
    }

    if (
      this.programsFormService.seasonForm.get("subSeasons").value &&
      this.programsFormService.seasonForm.get("subSeasons").value.length > 0
    )
      this.segmentType = this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType;

    /*
     *  Check if improperly entered edit/create. Redirect to /basic if so
     */
    this.programsService.editFlowGuard();
  }

  onChange = (data: DaysOfWeek[]) => {
    const tempData: ActivityTimes[] = [];
    this.weekData = [...data];
    this.weekData.forEach((day) => {
      if (day.active)
        tempData.push({
          dayOfWeek: day.index,
          open: day.startTimeValue,
          close: day.finishTimeValue,
        });
    });
    this.programsFormService.seasonForm.patchValue({
      activityTimes: tempData,
    });
  };

  onConstraintChange = (data: ConstraintItem[]) => {
    const activeOnly = data.filter((c) => c.active);
    this.constraints.splice(0, this.constraints.length, ...data);
    this.programsFormService.seasonForm.get("blockedDated").patchValue(activeOnly);
  };

  onSessionChange = (data: SegmentItem[]) => {
    this.sessions.splice(0, this.sessions.length, ...data);
    this.programsFormService.seasonForm.get("subSeasons").patchValue(data);
  };

  onDangerousFieldClick = () => {
    if (this.updateMode && !this.dangerousUpdateAccepted) {
      this.confirmModal = this.modal.confirm({
        nzTitle: "Do you want to edit this season?",
        nzContent:
          "If you edit this season, all product and space allocations will be removed and you must add them again manually",
        nzOnOk: () => {
          this.programsService.seasonEdit.next("full");
          this.dangerousUpdateAccepted = true;
          this.confirmModal.close();
        },
      });
    }
  };

  onDangerousAccepted = () => {
    this.programsService.seasonEdit.next("full");
    this.dangerousUpdateAccepted = true;
  };

  navBack = () => {
    this.location.back();
  };

  navNext = () => {
    this.loading = true;
    this.programsFormService.seasonForm.patchValue({
      questionnaires: Array.isArray(this.programsFormService.seasonForm.get("questionnaires").value)
        ? this.programsFormService.seasonForm.get("questionnaires").value
        : [this.programsFormService.seasonForm.get("questionnaires").value],
    });
    if (!(this.programsService.getSeasonId() > 0)) {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/pricing",
      ]);
      /*this.programsService
        .createSeason(this.programsFormService.seasonForm.getRawValue() as RCCreateProgramSeason)
        .subscribe((res) => {
          this.programsService.setCurrentSeason(res.data);
          this.loading = false;
          this.router.navigate([
            "/client/programs/" +
              this.programsService.getProgramTypeParam() +
              "/" +
              this.programsService.getPrgId() +
              "/season/" +
              this.programsService.getSeasonId() +
              "/pricing",
          ]);
        });*/
    } else {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/" +
          this.programsService.getSeasonId() +
          "/pricing",
      ]);
      /*
      const updateSeason: RCProgramSeason = {
        id: this.programsService.getSeasonId(),
        programId: this.programsService.getPrgId(),
        gender: this.programsFormService.programForm.get("gender").value,
        level: this.programsFormService.programForm.get("levelOfPlay").value,
        sport: this.programsFormService.programForm.get("sports").value,
        minAge: this.programsFormService.programForm.get("ageRange").value[0],
        maxAge: this.programsFormService.programForm.get("ageRange").value[1],
        questionnaires: this.programsFormService.seasonForm.get("questionnaires").value,
        ...this.programsFormService.seasonForm.getRawValue(),
      };

      this.programsService.updateSeason(updateSeason).subscribe((res) => {
        this.programsService.setCurrentSeason(res.data);
        this.programsService.getSubSeasons(this.programsService.getSeasonId()).subscribe((sessions) => {
          this.programsFormService.seasonForm.patchValue({ subSeasons: [...sessions.data] });
          this.router.navigate([
            "/client/programs/" +
              this.programsService.getProgramTypeParam() +
              "/" +
              this.programsService.getPrgId() +
              "/season/" +
              this.programsService.getSeasonId() +
              "/pricing",
          ]);
        });
      });
*/
    }
  };
}
