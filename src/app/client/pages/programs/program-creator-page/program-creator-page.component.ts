import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { RCLeagueDetailTypeEnum, RCMediaObject, RCMembership } from "@rcenter/core";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { ToastrService } from "ngx-toastr";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import {
  ProgramSeasonStatusEnum,
  ProgramsService,
  ProgramTypeEnum,
  RCCreateProgramData,
  RCProgram,
  RCUpdateProgramData,
} from "@app/shared/services/programs/programs.service";
import { forkJoin, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "rc-program-creator-page",
  templateUrl: "./program-creator-page.component.html",
  styleUrls: ["./program-creator-page.component.scss"],
})
export class ProgramCreatorPageComponent implements OnInit {
  private destroy$ = new Subject<true>();
  @ViewChild("actionSuccessModal", { static: true })
  loading: boolean = true;
  program: RCProgram;
  currentStep: number;
  totalSteps: number;
  currentOrganizationId: number;
  processing: boolean;
  programForm: FormGroup;
  @ViewChild("actionSuccessModal", { static: true })
  actionSuccessModal: ActionSuccessModalComponent;
  updateMode: boolean = false;
  processingUnpublished: boolean;
  mainImage: RCMediaObject;
  RCLeagueDetailTypeEnum = RCLeagueDetailTypeEnum;
  GlCodes: any[];
  organizationSubscribe$: Subscription;
  memberships: RCMembership[];

  constructor(
    private auth: AuthenticationService,
    public programsFormService: ProgramsFormService,
    public programsService: ProgramsService,
    private organizationService: OrganizationsService,
    private toastr: ToastrService,
    private route: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.programForm = this.programsFormService.programForm;
  }

  ngOnInit() {
    this.programsService.loadingProgram$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg && (!this.program || this.program.id !== prg.id)) {
        this.program = prg;
        this.currentOrganizationId = this.programsService.getOrgId();
        this.mainImage = this.program.mainMedia;
        if (prg.requiredProductIds.length > 0) {
          this.programsService.convertResourceToMembership(prg.requiredProductIds).then((results) => {
            this.programsFormService.programForm.get("memberships").setValue(results);
          });
        }
      }
    });

    this.organizationSubscribe$ = this.auth.currentOrganization.subscribe((data) => {
      this.currentOrganizationId = data.id;

      this.organizationService
        .getGlCodes(this.currentOrganizationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((response) => {
          this.GlCodes = response;
        });
    });

    this.organizationService
      .getOrganizationMemberships(this.currentOrganizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        this.memberships = response;
      });

    const prgId = this.activeRoute.snapshot.params["programId"];
    if (!prgId) {
      this.programsService.clearProgramValues();
      this.programsService.clearPrgSeasonValues();
    } else {
      this.programsService.init(prgId).then();
    }
  }

  shortDescInputChanged(newDesc) {
    this.programForm.get("description").setValue(newDesc);
  }

  shortDescInputLengthChanged(newLength) {}

  descInputChanged(newDesc) {
    this.programForm.get("longDescription").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  mainImageAdded(file) {
    this.programForm.get("mainImage").setValue(file);
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep = --this.currentStep;
    }
  }

  nextStep() {
    if (this.totalSteps > this.currentStep) {
      this.currentStep = ++this.currentStep;
    }
  }

  canGoNext(): boolean {
    if (this.currentStep === 1) {
      return this.programForm.get("basicInfo").valid;
    } else if (this.currentStep === 2) {
      return this.programForm.get("descriptionInfo").valid;
    } else if (this.currentStep === 3) {
      return this.programForm.valid;
    }
  }

  async submit() {
    if (!this.programsFormService.programForm.valid) {
      this.toastr.error("Please complete all the required fields");
      return;
    }

    this.processing = true;
    this.updateMode = !!this.programsService.getPrgId();
    const programInfo = this.programsFormService.programForm.getRawValue();
    let membershipResources = [];

    if (programInfo.memberships.length > 0) {
      const results = await this.programsService.convertMembershipToResource(programInfo.memberships);
      membershipResources = [...results];
    }

    if (!this.updateMode) {
      const programCreateData: RCCreateProgramData = {
        organizationId: this.programsService.getOrgId(),
        programType:
          ProgramTypeEnum[
            this.programsService.getProgramType().toUpperCase() !== "CLUB"
              ? this.programsService.getProgramType().toUpperCase()
              : "CLUB_TEAM"
          ],
        programName: programInfo.name,
        description: programInfo.description,
        longDescription: programInfo.longDescription,
        sport: programInfo.sports[0],
        minAge: programInfo.ageRange[0],
        maxAge: programInfo.ageRange[1],
        isAgeInMonths: programInfo.ageRange[2],
        gender: programInfo.gender,
        status: 1,
        highlights: [],
        levelOfPlay: programInfo.levelOfPlay,
        GL: programInfo.GL,
        requiredProductIds: [...membershipResources],
      };

      this.programsService
        .createProgram(programCreateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.updateMedia(response.data);
          },
          () => {
            this.processing = false;
            this.toastr.error("Error occurred while creating league");
          },
        );
    } else {
      const programUpdateData: RCUpdateProgramData = {
        programId: this.programsService.getPrgId(),
        organizationId: this.programsService.getOrgId(),
        userCreatorId: 2,
        programType:
          ProgramTypeEnum[
            this.programsService.getProgramType().toUpperCase() !== "CLUB"
              ? this.programsService.getProgramType().toUpperCase()
              : "CLUB_TEAM"
          ],
        programName: programInfo.name,
        description: programInfo.description,
        longDescription: programInfo.longDescription,
        sport: !Array.isArray(programInfo.sports) ? programInfo.sports : programInfo.sports[0],
        minAge: programInfo.ageRange[0],
        maxAge: programInfo.ageRange[1],
        isAgeInMonths: false,
        gender: programInfo.gender,
        status: this.programsService.getProgramStatus(),
        highlights: [],
        levelOfPlay: programInfo.levelOfPlay,
        GL: programInfo.GL,
        requiredProductIds: membershipResources,
      };
      this.programsService
        .updateProgram(programUpdateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response) => {
            this.updateMedia(response.data);
          },
          () => {
            this.processing = false;
            this.toastr.error("Error occurred while creating league");
          },
        );
    }
  }

  updateMedia = (programData: any) => {
    const mainMedia = this.programForm.get("mainImage").value;
    const imagesUploadTasks = [];

    if (mainMedia && mainMedia !== "")
      imagesUploadTasks.push(this.programsService.uploadProgramMedia(mainMedia, programData.id));

    if (!imagesUploadTasks.length) return this.finishSubmit(programData);

    forkJoin(imagesUploadTasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.finishSubmit(programData);
        },
        () => {
          this.finishSubmit(programData, "Error Uploading Photos");
        },
      );
  };

  finishSubmit(programData: any, err?) {
    this.programsService.setCurrentProgram(programData);

    this.processing = false;

    if (err) {
      console.log("finish submit error", err);
    }
    if (!this.updateMode) {
      this.actionSuccessModal.showModal();
      this.toastr.success("Program Successfully Created");
    } else {
      this.toastr.success("Program Successfully Updated");
      this.goToDashboard();
    }
  }

  goToCreateSeason() {
    this.programsService.clearPrgSeasonValues();
    this.route.navigate([
      "/client/programs/" +
        this.programsService.getProgramTypeParam() +
        "/" +
        this.programsService.getPrgId() +
        "/season/basic",
    ]);
  }

  goToDashboard(publish?: boolean) {
    if (publish) {
      this.processing = true;

      this.programsService
        .changePublishingStatusOfProgram(this.programsService.getPrgId(), ProgramSeasonStatusEnum.PUBLISHED)
        .subscribe(
          (response) => {
            if (response.data) {
              this.processing = false;
              this.toastr.success("Program is published");
              this.programsService.setCurrentProgram(response.data);
            }
          },
          () => {
            this.processing = false;
            this.toastr.error("Error while publishing the program");
          },
        );
    }

    this.route.navigate([
      `/client/programs/${this.programsService.getProgramTypeParam()}/${this.programsService.getPrgId()}`,
    ]);
  }

  onMembershipChange() {}

  unpublish() {
    this.processingUnpublished = true;
    this.programsService
      .unpublishLeague(this.programsService.getPrgId())
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.processingUnpublished = false;
          this.toastr.success("League was unpublished");
          this.route.navigate(["/client/leagues/view/" + this.programsService.getPrgId()]);
        },
        (err) => {
          this.processingUnpublished = false;
          const errorResponse = err;

          this.toastr.error(errorResponse.error || "Error occurred while unpublishing league");
        },
      );
  }

  delete() {}
}
