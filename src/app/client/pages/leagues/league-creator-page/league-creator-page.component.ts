import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { RCMembership, RCQuestionnaireObject } from "@rcenter/core";

import { forkJoin, Subscription } from "rxjs";
import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LeaguesFormService } from "@app/shared/services/leagues/leagues-form.service";
import { DragulaService } from "ng2-dragula";
import {
  IRCLeagueDetail,
  RCLeague,
  RCLeagueBookingStateEnum,
  RCLeagueDetailTypeEnum,
  RCLinkedAccountStatus,
  RCOrganization,
} from "@rcenter/core";
import * as moment from "moment-timezone";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { RCCreateLeagueData } from "@app/shared/services/tournament/tournament.service";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { ToastrService } from "ngx-toastr";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { PlatformLocation } from "@angular/common";

@Component({
  selector: "rc-league-creator-page",
  templateUrl: "./league-creator-page.component.html",
  styleUrls: ["./league-creator-page.component.scss"],
})
export class LeagueCreatorPageComponent implements OnInit {
  editingLeagueId: any;
  leagueId: any;
  currentStep: number;
  totalSteps: number;
  processing: boolean;
  leagueForm: FormGroup;
  organizationSubscribe$: Subscription;
  currentOrganizationId: number;
  organization: RCOrganization;
  league: any;
  @ViewChild("actionSuccessModal", { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  updateMode: boolean;
  processingUnpublish: boolean;
  orgQuestionnaires: RCQuestionnaireObject[];
  GlCodes: any[];
  memberships: RCMembership[];

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private leaguesFormService: LeaguesFormService,
    private dragulaService: DragulaService,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
    private leaguesService: LeaguesService,
    private programsService: ProgramsService,
    private vRef: ViewContainerRef,
    private toastr: ToastrService,
    private route: Router,
    private location: PlatformLocation,
  ) {}

  ngOnInit() {
    this.currentStep = 1;
    this.totalSteps = 3;

    this.leagueForm = this.fb.group({
      basicInfo: this.fb.group({
        name: ["", Validators.compose([Validators.maxLength(60), Validators.required])],
        sport: ["", Validators.required],
        venueAddress: ["", Validators.required],
        address: ["", Validators.required],
        mainImage: [""],
        timezone: [moment.tz.guess()],
        GL: [null],
        memberships: [null],
      }),
      descriptionInfo: this.fb.group({
        shortDescription: ["", Validators.compose([Validators.maxLength(2000), Validators.required])],
        description: ["", Validators.compose([Validators.maxLength(2000), Validators.required])],
        shortDescription_length: [""],
        description_length: [""],
        waiver: ["", Validators.compose([Validators.maxLength(50000)])],
        defaultWaiver: [false],
        standingsPercentagePoints: ["percentage"],

        questionnaireId: [null],
      }),
      leagueFormat: this.fb.group({
        ageRange: [[18, 100], Validators.required],
        gender: ["", Validators.required],
        levelOfPlay: ["", Validators.required],
        formats: this.leaguesFormService.getDefaultFormatsArray(),
      }),
    });

    this.organizationSubscribe$ = this.authService.currentOrganization.subscribe((data) => {
      this.currentOrganizationId = data.id;

      this.organizationService.getOrganizationById(this.currentOrganizationId).subscribe((orgResponse) => {
        this.organization = orgResponse.data;

        this.organizationService.getOrganizationQuestionnaires(this.organization.id).subscribe((response) => {
          this.orgQuestionnaires = response.data;
        });

        this.organizationService.getGlCodes(this.organization.id).subscribe((response) => {
          this.GlCodes = response;
        });

        this.organizationService.getOrganizationMemberships(this.currentOrganizationId).subscribe((response) => {
          this.memberships = response;
        });
      });
    });

    this.editingLeagueId = this.activeRoute.snapshot.params["leagueId"];

    if (this.editingLeagueId) {
      this.loadLeagueToEdit(this.editingLeagueId);
      this.updateMode = true;
    } else {
      this.updateMode = false;
    }
  }

  loadLeagueToEdit(leagueId: number) {
    this.leaguesService.getLeagueById(leagueId).subscribe((response) => {
      this.league = response.data;

      if (this.league.requiredProductIds && this.league.requiredProductIds.length > 0) {
        this.programsService.convertResourceToMembership(this.league.requiredProductIds).then((results) => {
          this.leagueForm.patchValue({ basicInfo: { memberships: results } });
        });
      }

      this.leagueForm.patchValue({
        basicInfo: {
          GL: "",
          timezone: this.league.timezone,
          name: this.league.name,
          sport: this.league.sports,
          address: this.league.address,
          venueAddress:
            this.league["addressName"] ||
            (this.league.address && this.league.address.street + "," + this.league.address.city),
        },
        descriptionInfo: {
          description: this.league.description || "",
          shortDescription: this.league.shortDescription || "",
          questionnaireId: this.league.questionnaireId,
        },
      });

      if (
        this.league &&
        this.league.sportConfigData &&
        this.league.sportConfigData.standingsView &&
        this.league.sportConfigData.standingsView.pointsOrPercentageView
      ) {
        this.leagueForm
          .get("descriptionInfo")
          .get("standingsPercentagePoints")
          .setValue(this.league.sportConfigData.standingsView.pointsOrPercentageView);
      }

      const details = this.leaguesFormService.extractLeagueDetailsObjects(this.league.leagueDetails);

      this.leagueForm.patchValue({
        leagueFormat: {
          gender: details.gender,
          levelOfPlay: details.levelOfPlay,
          ageRange: details.age,
        },
      });

      const moreDetailsVM = this.leaguesFormService.convertLeagueDetailsToVM(details.otherDetails);
      (this.leagueForm.get("leagueFormat").get("formats") as FormArray).controls.forEach((i) => {
        const type = i.get("type").value;
        i.get("active").setValue(false);

        const found = moreDetailsVM.find((detail) => detail.type === type);
        if (found) {
          i.patchValue(found);
          i.get("active").setValue(true);
        }
      });

      const otherDetails = moreDetailsVM.filter((i) => i.type === RCLeagueDetailTypeEnum.OTHER);

      if (otherDetails) {
        otherDetails.forEach((detail) => {
          const formatObject = this.leaguesFormService.getDefaultFormatItem(detail.type, true, detail.ordinal);
          formatObject.patchValue(detail);

          (this.leagueForm.get("leagueFormat").get("formats") as FormArray).push(formatObject);
        });
      }
    });
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
      return this.leagueForm.get("basicInfo").valid;
    } else if (this.currentStep === 2) {
      return this.leagueForm.get("descriptionInfo").valid;
    } else if (this.currentStep === 3) {
      return this.leagueForm.valid;
    }
  }

  submit(data) {
    const { basicInfo, descriptionInfo, leagueFormat } = data;

    const leagueCreateData: RCCreateLeagueData = {
      address: basicInfo.address,
      league: {
        GL: basicInfo.GL,
        requiredProductIds: basicInfo.memberships,
        name: basicInfo.name,
        sports: basicInfo.sport,
        organizationId: this.currentOrganizationId,
        description: descriptionInfo.description,
        shortDescription: descriptionInfo.shortDescription,
        addressName: basicInfo.venueAddress,
        timezone: basicInfo.timezone || moment.tz.guess(),
        questionnaireId: descriptionInfo.questionnaireId ? descriptionInfo.questionnaireId : null,
        sportConfigData: {
          standingsView: {
            pointsOrPercentageView: data.descriptionInfo.standingsPercentagePoints,
          },
        },
      },
      leagueDetails: [
        {
          ordinal: 200,
          detailType: RCLeagueDetailTypeEnum.GENDER,
          data: leagueFormat.gender,
        },
        {
          ordinal: 201,
          detailType: RCLeagueDetailTypeEnum.MINAGE,
          data: leagueFormat.ageRange[0],
        },
        {
          ordinal: 202,
          detailType: RCLeagueDetailTypeEnum.MAXAGE,
          data: leagueFormat.ageRange[1],
        },
        {
          ordinal: 203,
          detailType: RCLeagueDetailTypeEnum.LEVELOFPLAY,
          data: leagueFormat.levelOfPlay,
        },
      ],
    };

    const leagueDetailsParsed = leagueFormat.formats
      .filter((i) => {
        return i.active && i.value;
      })
      .map((i) => {
        const dataObject: IRCLeagueDetail = {
          ordinal: i.ordinal,
          detailType: i.type,
          title: i.title,
          data: i.value || i.customValue,
        };

        if (i.type === RCLeagueDetailTypeEnum.PLAYERSPERTEAM) {
          dataObject.data = {
            min: i.value !== null ? i.value : i.secondValue,
            max: i.secondValue !== null ? i.secondValue : i.value,
          };
        }

        if (i.customValue) {
          dataObject.isCustom = true;
        }

        return dataObject;
      });

    leagueCreateData.leagueDetails = leagueCreateData.leagueDetails.concat(leagueDetailsParsed);

    const foundMatchLength = _.find(
      leagueDetailsParsed,
      (i: any) => i.detailType === RCLeagueDetailTypeEnum.MATCHLENGTH,
    );

    if (foundMatchLength && !foundMatchLength.data) {
      return this.toastr.error("You must specify game duration");
    }

    if (this.updateMode) {
      return this.updateLeague(leagueCreateData);
    }

    leagueCreateData.league.isPublished = false;

    this.processing = true;
    this.leaguesService.createLeague(leagueCreateData).subscribe(
      (response) => {
        this.leagueId = response.data.id;
        this.updateMedia(response.data.id);
      },
      () => {
        this.processing = false;
        this.toastr.error("Error occurred while creating league");
      },
    );
  }

  updateLeague(data: RCCreateLeagueData) {
    this.processing = true;
    this.leaguesService.updateLeague(this.editingLeagueId, data).subscribe(
      (response) => {
        this.leagueId = this.editingLeagueId;
        this.updateMedia(this.editingLeagueId);
      },
      () => {
        this.toastr.error("Error occurred while updating league");
        this.finishSubmit("Error updating league");
      },
    );
  }

  updateMedia(leagueId: number) {
    const mainMedia = this.leagueForm.get("basicInfo").get("mainImage").value;
    const imagesUploadTasks = [];

    if (mainMedia) {
      imagesUploadTasks.push(this.leaguesService.uploadLeagueMedia(mainMedia, leagueId));
    }

    if (!imagesUploadTasks.length) return this.finishSubmit();
    forkJoin(imagesUploadTasks).subscribe(
      () => {
        this.finishSubmit();
      },
      () => {
        this.finishSubmit("Error Uploading Photos");
      },
    );
  }

  finishSubmit(err?) {
    this.processing = false;

    if (err) {
      return;
    }

    if (!this.updateMode) {
      this.actionSuccessModal.showModal();
      this.toastr.success("Tournament Successfully Created");
    } else {
      this.toastr.success("Tournament Successfully Updated");
      this.goToDashboard();
    }
  }

  goToCreateSeason() {
    this.route.navigate(["/client/leagues/view/" + this.leagueId + "/season-creator"]);
  }

  goToDashboard(publish?: boolean) {
    this.processing = true;

    if (!publish) {
      this.route.navigate(["/client/leagues/view/" + this.leagueId]);

      return;
    }

    this.publishLeague(() => {
      this.route.navigate(["/client/leagues/view/" + this.leagueId]);
    });
  }

  publishLeague(cb) {
    this.leaguesService.publishLeague(this.leagueId).subscribe(
      () => {
        this.processing = false;
        this.toastr.success("League Published");

        cb();
      },
      () => {
        cb();

        this.processing = false;
        this.toastr.error("Error Publishing League");
      },
    );
  }

  unpublish() {
    this.processingUnpublish = true;
    this.leaguesService.unpublishLeague(this.editingLeagueId).subscribe(
      () => {
        this.processingUnpublish = false;
        this.toastr.success("League was unpublished");
        this.route.navigate(["/client/leagues/view/" + this.editingLeagueId]);
      },
      (err) => {
        this.processingUnpublish = false;
        const errorResponse = err;

        this.toastr.error(errorResponse.error || "Error occurred while unpublishing league");
      },
    );
  }

  delete() {
    this.processingUnpublish = true;
    this.leaguesService.deleteLeague(this.league.id).subscribe(
      () => {
        this.processingUnpublish = false;
        this.toastr.success("season was deleted");
        this.route.navigate(["/client/leagues"]);
      },
      (err) => {
        this.processingUnpublish = false;
        const errorResponse = err;

        this.toastr.error(errorResponse.error || "Error occurred while unpublishing tournament event");
      },
    );
  }
}
