import { DatePipe, Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivityTimes } from "@app/client/pages/programs/program-season-schedule-page/program-season-schedule-page.component";
import { SpaceAlloc } from "@app/shared/components/space-allocation-management/space-allocation-management.component";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import {
  ProgramsService,
  RCCreateProgramSeason,
  RCProgramSeason,
  SegmentItem,
  SubSeason,
} from "@app/shared/services/programs/programs.service";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RCVenue } from "@rcenter/core";

@Component({
  selector: "rc-program-season-spaces-page",
  templateUrl: "./program-season-spaces-page.component.html",
  styleUrls: ["./program-season-spaces-page.component.scss"],
})
export class ProgramSeasonSpacesPageComponent implements OnInit {
  private destroy$ = new Subject<true>();
  loading: boolean = false;
  updateMode: boolean = false;
  seasonForm: FormGroup;
  programName: string;
  programGL: string;
  seasonName: string;
  seasonId: number;
  startDate: string;
  endDate: string;
  subSeasons: SegmentItem[] | { date: string; startTime: string; endTime: string }[];
  allocations: SpaceAlloc[];
  processedAllocs: { date: string; startTime: string; endTime: string; spaceId: number }[] = [];
  segmentType: "program_season" | "event";

  venues: RCVenue[] = [];

  constructor(
    private router: Router,
    private location: Location,
    private programsFormService: ProgramsFormService,
    private datePipe: DatePipe,
    public programsService: ProgramsService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
  ) {
    this.seasonForm = programsFormService.seasonForm;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg) {
        this.programName = prg.name;
        this.programGL = prg.GL;
      }
    });

    this.programsService.currentOrganizationVenues$.pipe(takeUntil(this.destroy$)).subscribe((venues) => {
      if (venues) this.venues = [...venues];
    });

    this.programsService.currentEventDates$.pipe(takeUntil(this.destroy$)).subscribe((dates) => {
      this.segmentType =
        this.seasonForm.get("subSeasons").value && this.seasonForm.get("subSeasons").value.length > 0
          ? this.seasonForm.get("subSeasons").value[0].segmentType
          : "event";

      if (this.segmentType === "event") {
        const completedSubSeasons = [];
        if (dates)
          for (let i = 0; i < dates.length; i++) {
            completedSubSeasons.push({ id: i + 1, ...dates[i] });
          }
        this.subSeasons = [...completedSubSeasons];
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

    if (this.seasonForm.get("spaceAllocations").value.length > 0) {
      this.onAllocChange(this.seasonForm.get("spaceAllocations").value).then();
    } else {
      this.allocations = [];
    }

    this.seasonName = this.seasonForm.get("name").value;
    this.seasonId = this.programsService.getSeasonId();
    this.segmentType =
      this.seasonForm.get("subSeasons").value && this.seasonForm.get("subSeasons").value.length > 0
        ? this.seasonForm.get("subSeasons").value[0].segmentType
        : "event";

    if (this.segmentType === "program_season")
      this.subSeasons = this.seasonForm.get("subSeasons").value.sort((a, b) => (a.name > b.name ? 1 : -1));

    /*
     *  Check if improperly entered edit/create. Redirect to /basic if so
     */
    this.programsService.editFlowGuard();
  }

  getSubSeasons = async () => {
    await this.programsService
      .getSubSeasons(this.seasonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const resSubSeason: SegmentItem[] = res.data;
        this.segmentType = resSubSeason[0].segmentType;
        this.subSeasons = resSubSeason.sort((a, b) => (a.name > b.name ? 1 : -1));
      });
  };

  onAllocChange = async (newAllocs: SpaceAlloc[]) => {
    this.allocations = [...newAllocs];
    this.seasonForm.patchValue({ spaceAllocations: [...newAllocs] });
    await this.processAllocations(newAllocs);
  };

  processAllocations = async (newAllocs: SpaceAlloc[]) => {
    if (this.segmentType === "program_season") {
      for (let a of newAllocs) {
        await this.programsService.getSeasonEvents(a.segmentId).subscribe((events) => {
          const tempEvents = events.data;
          tempEvents.forEach((event) => {
            this.processedAllocs.push({
              date: this.datePipe.transform(event.startDate, "yyyy-MM-dd"),
              startTime: this.datePipe.transform(event.startDate, "HH:mm"),
              endTime: this.datePipe.transform(event.endDate, "HH:mm"),
              spaceId: a.spaceId,
            });
          });
        });
      }
    } else {
      for (let a of newAllocs) {
        this.processedAllocs.push({
          date: this.datePipe.transform(a.startDate, "yyyy-MM-dd"),
          startTime: this.datePipe.transform(a.startDate, "HH:mm"),
          endTime: this.datePipe.transform(a.endDate, "HH:mm"),
          spaceId: a.spaceId,
        });
      }
    }
  };

  fixActivityTimes = (data: any) => {
    const tempActTimes: ActivityTimes[] = [];
    for (let a of data) {
      if (a.dayOfWeek) {
        tempActTimes.push({ dayOfWeek: a.dayOfWeek, open: a.open, close: a.close });
      } else {
        if (a.active) {
          tempActTimes.push({ dayOfWeek: a.index, open: a.startTimeValue, close: a.finishTimeValue });
        }
      }
    }
    return tempActTimes;
  };

  processCreateSeasonResp = (data: any) => {
    this.programsService.currentSeason.next(data);
    this.programsService.getSubSeasons(data.id).subscribe((sessions) => {
      const tempSessions = [];
      for (let session of sessions.data) {
        tempSessions.push(session.id);
      }

      const tempProds = this.programsFormService.productsForm.getRawValue();
      tempProds.products[0].defaultForResourceId = data.id;
      tempProds.products[0].defaultForResourceType = "program_season";
      for (let prod of tempProds.products) {
        prod.resourcesIdsToApplyOn = [...tempSessions];
        prod.GL = this.programGL;
      }
      this.programsService
        .saveProgramProducts(
          tempProds.products,
          tempProds.addons.filter((a) => a.new),
        )
        .subscribe((data) => {
          this.programsService.currentEventDates.next(undefined);
          this.router
            .navigate([
              "/client/programs/" +
                this.programsService.getProgramTypeParam() +
                "/" +
                this.programsService.getPrgId() +
                "/season/" +
                this.programsService.getSeasonId(),
            ])
            .then(() => this.programsService.clearPrgSeasonValues());
          this.loading = false;
        });
    });
  };

  saveSpaceAllocations = () => {
    this.loading = true;
    if (!this.updateMode) {
      this.programsFormService.seasonForm.patchValue({ products: [] });

      if (
        this.programsFormService.seasonForm.get("subSeasons").value &&
        this.programsFormService.seasonForm.get("subSeasons").value.length > 0 &&
        this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType === "program_season"
      ) {
        const tempSubSeasons: SubSeason[] = [];
        this.programsFormService.seasonForm.get("subSeasons").value.forEach((subSeason) => {
          tempSubSeasons.push({
            name: subSeason.name,
            startDate: this.datePipe.transform(subSeason.startDate, "yyyy-MM-dd"),
            endDate: this.datePipe.transform(subSeason.endDate, "yyyy-MM-dd"),
            segmentType: subSeason.segmentType,
            activityTimes: [...this.fixActivityTimes(subSeason.activityTimes)],
          });
        });
        this.programsFormService.seasonForm.patchValue({
          activityTimes: [...this.fixActivityTimes(this.programsFormService.seasonForm.get("activityTimes").value)],
          subSeasons: [...(tempSubSeasons as SubSeason[])],
        });
      } else {
        this.programsFormService.seasonForm.patchValue({
          activityTimes: [
            ...this.fixActivityTimes(
              this.programsFormService.seasonForm.get("activityTimes").value as {
                dayOfWeek: number;
                open: string;
                close: string;
              }[],
            ),
          ],
          subSeasons: [],
        });
      }

      if (this.programsService.getSeasonEdit() === "full") {
        const tempUpdateForm = {
          id: this.programsService.getSeasonId(),
          ...this.programsFormService.seasonForm.getRawValue(),
        } as RCProgramSeason;
        for (let propName in tempUpdateForm) {
          if (
            propName !== "subSeasons" &&
            propName !== "blockedDated" &&
            (!tempUpdateForm[propName] ||
              (Array.isArray(tempUpdateForm[propName]) && tempUpdateForm[propName].length === 0))
          ) {
            delete tempUpdateForm[propName];
          }
        }
        this.programsService
          .updateSeason({
            ...tempUpdateForm,
          } as RCProgramSeason)
          .subscribe((res) => {
            this.processCreateSeasonResp(res.data);
          });
      } else {
        this.programsService
          .createSeason({ ...this.programsFormService.seasonForm.getRawValue() } as RCCreateProgramSeason)
          .subscribe((res) => {
            this.processCreateSeasonResp(res.data);
          });
      }
    } else {
      this.programsFormService.seasonShallowUpdateForm.get("seasonId").setValue(this.programsService.getSeasonId());
      const tempUpdateForm = this.programsFormService.seasonShallowUpdateForm.getRawValue();

      for (let propName in tempUpdateForm) {
        if (
          (propName !== "subSeasons" && propName !== "isPunchCard" && !tempUpdateForm[propName]) ||
          (Array.isArray(tempUpdateForm[propName]) && tempUpdateForm[propName].length === 0)
        ) {
          delete tempUpdateForm[propName];
        }
      }

      this.programsService.shallowSeasonUpdate(tempUpdateForm).subscribe((res) => {
        if (!res) {
          this.toastr.error("There was an error saving space allocations. Please try again.");
          this.loading = false;
        } else {
          this.programsService.clearPrgSeasonValues();
          this.router.navigate([
            "/client/programs/" +
              this.programsService.getProgramTypeParam() +
              "/" +
              this.programsService.getPrgId() +
              "/season/" +
              this.seasonId,
          ]);
          this.loading = false;
        }
      });
    }
  };

  navBack = () => {
    this.location.back();
  };

  navNext = async () => {
    this.saveSpaceAllocations();
  };
}
