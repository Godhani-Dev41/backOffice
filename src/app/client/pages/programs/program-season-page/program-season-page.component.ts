import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { FormGroup } from "@angular/forms";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import moment from "moment";
import { NzModalRef, NzModalService } from "ng-zorro-antd";
import { ToastrService } from "ngx-toastr";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { RCQuestionnaireObject, RCVenue } from "@rcenter/core";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

declare var tinymce: any;
@Component({
  selector: "rc-program-season-page",
  templateUrl: "./program-season-page.component.html",
  styleUrls: ["./program-season-page.component.scss"],
})
export class ProgramSeasonPageComponent implements OnInit {
  private destroy$ = new Subject<true>();
  loading: boolean = true;
  updateMode: boolean;
  seasonForm: FormGroup;
  shallowUpdateForm: FormGroup;
  venues: RCVenue[] = [];
  currentProgramName: string;
  selectedFacilityId: number = 0;
  confirmModal: NzModalRef;
  dangerousUpdateAccepted: boolean;
  isPunchCardSwitch: boolean = false;

  listOfOption: RCQuestionnaireObject[];

  listOfTagOptions = [];

  constructor(
    public programsFormService: ProgramsFormService,
    public venueService: VenuesService,
    public programsService: ProgramsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
    private toastr: ToastrService,
    private modal: NzModalService,
  ) {
    this.seasonForm = this.programsFormService.seasonForm;
    this.shallowUpdateForm = this.programsFormService.seasonShallowUpdateForm;
  }

  ngOnInit() {
    this.programsService.loadingSeason$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg && this.programsService.getOrgId()) {
        this.currentProgramName = prg.name;
        this.organizationService.getOrganizationQuestionnaires(this.programsService.getOrgId()).subscribe((q) => {
          if (q) {
            this.listOfOption = q.data;
          }
        });

        this.venueService.getOrganizationVenues(this.programsService.getOrgId()).subscribe((orgVenues) => {
          if (orgVenues) {
            this.venues = orgVenues.data;
            this.programsService.setOrganizationVenues(orgVenues.data);
          }
        });
      }
    });

    this.programsService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((season) => {
      if (season) {
        if (season.id > 0) {
          this.updateMode = true;
          if (!this.programsService.getSeasonEdit()) this.programsService.setSeasonEdit("shallow");
        }
        if (!this.updateMode) this.programsService.clearPrgSeasonValues();
        this.selectedFacilityId = this.seasonForm.get("facilityId").value;
      } else {
        this.programsService.setSeasonEdit(undefined);
      }
    });

    this.programsService.seasonEdit$.pipe(takeUntil(this.destroy$)).subscribe((editMode) => {
      if (!editMode) this.updateMode = false;
      if (editMode === "shallow") {
        this.updateMode = true;
        this.dangerousUpdateAccepted = false;
      }
      if (editMode === "full") {
        this.updateMode = true;
        this.dangerousUpdateAccepted = false;
      }
    });

    // until we load a session - we'll assume this is creating one, not updating
    const prgId = this.activeRoute.snapshot.params["programId"];
    const seasId = this.activeRoute.snapshot.params["seasonId"];
    // this.programsService.setSeasonEdit(undefined);

    /*
     *  Cannot rely on dirty/pristine status from the form, so if we have a name value for the season,
     *  we can assume the season has already been loaded
     */
    if (!this.programsFormService.seasonForm.get("name").value)
      this.programsService.init(prgId, seasId ? seasId : null).then();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  onChangeDate = (dates: { startDate: string; endDate: string }, type: "season" | "registration") => {
    switch (type) {
      case "season":
        this.seasonForm.patchValue({
          startDate: moment(dates.startDate).format("YYYY-MM-DD"),
          endDate: moment(dates.endDate).format("YYYY-MM-DD"),
        });
        break;
      case "registration":
        this.seasonForm.patchValue({
          registrationStartDate: moment(dates.startDate).format("YYYY-MM-DD"),
          registrationEndDate: moment(dates.endDate).format("YYYY-MM-DD"),
        });
        break;
    }
  };

  onNumInputChange = (
    num: number,
    type: "max" | "maxFemale" | "maxMale" | "maxWait" | "maxWaitMale" | "maxWaitFemale",
  ) => {
    switch (type) {
      case "max":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxParticipants: num,
          });
        this.seasonForm.patchValue({
          maxParticipants: num,
        });
        break;
      case "maxFemale":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxFemaleParticipants: num,
          });
        this.seasonForm.patchValue({
          maxFemaleParticipants: num,
        });
        break;
      case "maxMale":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxMaleParticipants: num,
          });
        this.seasonForm.patchValue({
          maxMaleParticipants: num,
        });
        break;
      case "maxWait":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxWaitlist: num,
          });
        this.seasonForm.patchValue({
          maxWaitlist: num,
        });
        break;
      case "maxWaitFemale":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxFemaleWaitlist: num,
          });
        this.seasonForm.patchValue({
          maxFemaleWaitlist: num,
        });
        break;
      case "maxWaitMale":
        if (this.updateMode)
          this.shallowUpdateForm.patchValue({
            maxMaleWaitlist: num,
          });
        this.seasonForm.patchValue({
          maxMaleWaitlist: num,
        });
        break;
      default:
        break;
    }
  };

  onNameChange = (e: any) => {
    if (this.updateMode) this.shallowUpdateForm.get("name").setValue(e.target.value);
  };

  onLocationChange = (e: any) => {
    if (this.updateMode) this.shallowUpdateForm.get("facilityId").setValue(e);
  };

  onQuestionChange = (e: number) => {
    if (this.updateMode) this.shallowUpdateForm.get("questionnaires").setValue([e]);
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

  continueSeason = () => {
    if (!this.seasonForm.valid) {
      this.toastr.error("Please complete all the required fields");
      return;
    }

    if (this.programsService.getSeasonId() > 0) {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/" +
          this.programsService.getSeasonId() +
          "/schedule",
      ]);
    } else {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/schedule",
      ]);
    }
  };

  shortDescInputChanged(newDesc: string) {
    this.seasonForm.get("description").setValue(newDesc);
    this.shallowUpdateForm.get("description").setValue(newDesc);
  }

  shortDescInputLengthChanged(newLength: number) {}

  descInputChanged(newDesc: string) {
    this.seasonForm.get("longDescription").setValue(newDesc);
    this.shallowUpdateForm.get("longDescription").setValue(newDesc);
  }

  descInputLengthChanged(newLength: number) {}

  isPunchCardChanged() {
    this.isPunchCardSwitch = !this.isPunchCardSwitch;
    this.shallowUpdateForm.get("isPunchCard").setValue(this.isPunchCardSwitch);
  }
}
