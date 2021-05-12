import { ProgramsService, RCProgramPricing, RCProgramProduct } from "@app/shared/services/programs/programs.service";
import { takeUntil } from "rxjs/operators";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TimeService } from "@app/shared/services/utils/time.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCLeagueSeason } from "@rcenter/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Subject } from "rxjs";
import { CustomValidators } from "ng2-validation";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { RCLeague } from "@rcenter/core/models/Leagues";

export interface LeagueSeason extends RCLeagueSeason {
  longDescription?: string;
}

@Component({
  selector: "rc-league-page-season-creator",
  templateUrl: "./league-page-season-creator.component.html",
  styleUrls: ["./league-page-season-creator.component.scss"],
})
export class LeaguePageSeasonCreatorComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  currentStep: number;
  totalSteps: number;
  seasonForm: FormGroup;
  processing: boolean;
  earlyRegistration$: Subscription;
  lateRegistration$: Subscription;
  regularRegistration$: Subscription;
  editingSeasonId: number;
  season: LeagueSeason;
  savedSeason: LeagueSeason;
  processingUnpublish: boolean;
  @ViewChild("actionSuccessModal", { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  registrationChangeProccessing: boolean;
  league: RCLeague;
  destroy$ = new Subject<boolean>();
  orgVenues: any[];
  requiredProductIds: number[] = [];
  constructor(
    private timeService: TimeService,
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private leagueService: LeaguesService,
    private activeRoute: ActivatedRoute,
    private analytics: AnalyticsService,
    private venueService: VenuesService,
    private programsService: ProgramsService,
  ) {
    this.seasonForm = this.fb.group({
      status: 1,
      registrationStatus: 2,
      registrationOpen: "",
      activityTimes: this.fb.array([]),
      basicInfo: this.fb.group({
        name: ["", Validators.compose([Validators.maxLength(60), Validators.required])],
        description: ["", Validators.compose([Validators.maxLength(2000), Validators.required])],
        longDescription: ["", Validators.compose([Validators.maxLength(2000)])],
      }),
      creatorSchedule: this.fb.group({
        startDate: ["", Validators.compose([Validators.required])],
        endDate: ["", Validators.compose([Validators.required])],
        earlyBirdRegistration: this.getRegistrationObject(),
        regularRegistration: this.getRegistrationObject(true),
        lateRegistration: this.getRegistrationObject(),
        downPayment: this.fb.group({
          active: false,
          individualDownPayment: [null, CustomValidators.min(0)],
          teamDownPayment: [null, CustomValidators.min(0)],
          teamPerPlayerDownPayment: [null, CustomValidators.min(0)],
        }),
        addons: this.fb.group([]),
      }),
    });
  }

  ngOnInit() {
    this.analytics.trackEvent("season-create:start");

    this.editingSeasonId = this.activeRoute.snapshot.params["seasonId"];
    if (this.editingSeasonId) {
      const leagueId = this.activeRoute.parent.snapshot.params["id"];
      this.loadSeason(leagueId, this.editingSeasonId);
    } else {
      (this.seasonForm.get("activityTimes") as FormArray).push(this.leagueService.getActivityTimeGroupObject());
      this.loading = false;
    }

    this.currentStep = 1;
    this.totalSteps = 3;

    this.leagueService.currentLeague$.pipe(takeUntil(this.destroy$)).subscribe((league) => {
      this.league = league;

      if (league.requiredProductIds && league.requiredProductIds.length > 0) {
        this.requiredProductIds = league.requiredProductIds;
      }

      if (this.league && this.league["creatorType"] === "organization") {
        this.venueService.getOrganizationVenues(this.league["creatorId"]).subscribe((response) => {
          this.orgVenues = response.data;
        });
      }
    });

    this.seasonForm
      .get("creatorSchedule")
      .get("earlyBirdRegistration")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.registrationObjectChange.bind(this, "earlyBirdRegistration"));
    this.seasonForm
      .get("creatorSchedule")
      .get("regularRegistration")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.registrationObjectChange.bind(this, "regularRegistration"));
    this.seasonForm
      .get("creatorSchedule")
      .get("lateRegistration")
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.registrationObjectChange.bind(this, "lateRegistration"));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  loadSeason(leagueId, id) {
    this.processing = true;
    this.leagueService.getSeasonById(leagueId, id).subscribe(
      (response) => {
        this.processing = false;
        this.season = response.data;

        this.loadSeasonForEditing(this.season);
      },
      (err) => {
        this.processing = false;
        this.loading = false;
        this.toastr.error("Error occurred while fetching the season");
      },
    );
  }

  async loadSeasonForEditing(season: LeagueSeason) {
    this.seasonForm.patchValue({
      status: season.status,
      registrationStatus: season.registrationStatus,
      registrationOpen: this.timeService.prepareTZForDisplay(season.registrationOpen, season.seasonLeague.timezone),
      basicInfo: {
        name: season.name,
        description: season.description,
        longDescription: season.longDescription,
      },
      creatorSchedule: {
        startDate: this.timeService.prepareTZForDisplay(season.startDate, season.seasonLeague.timezone),
        endDate: this.timeService.prepareTZForDisplay(season.endDate, season.seasonLeague.timezone),
      },
    });

    let early, regular;

    if (season.earlyRegistrationEnds || season.priceEarlySingle !== null || season.priceEarlyTeam !== null) {
      early = true;
      this.seasonForm.get("creatorSchedule").patchValue({
        earlyBirdRegistration: {
          active: true,
          individualPrice: season.priceEarlySingle,
          individualActive: true,
          teamPrice: season.priceEarlyTeam,
          teamActive: season.priceEarlyTeam !== null,
          teamPerPlayerPrice: season.priceEarlyTeamMember,
          teamPerPlayerActive: season.priceEarlyTeamMember !== null,
        },
      });

      this.seasonForm
        .get("creatorSchedule")
        .get("earlyBirdRegistration")
        .get("endDate")
        .setValue(this.timeService.prepareTZForDisplay(season.earlyRegistrationEnds, season.seasonLeague.timezone));

      this.registrationObjectChange("earlyBirdRegistration", { endDate: season.earlyRegistrationEnds } as any);
      this.seasonForm
        .get("creatorSchedule")
        .get("earlyBirdRegistration")
        .get("startDate")
        .setValue(this.timeService.prepareTZForDisplay(season.registrationOpen, season.seasonLeague.timezone));
      await timeout(500);
    }

    if (season.regularRegistrationEnds || season.priceRegularSingle !== null || season.priceRegularTeam !== null) {
      regular = true;
      this.seasonForm.get("creatorSchedule").patchValue({
        regularRegistration: {
          active: true,
          individualPrice: season.priceRegularSingle,
          individualActive: true,
          teamPrice: season.priceRegularTeam,
          teamActive: season.priceRegularTeam !== null,
          teamPerPlayerPrice: season.priceRegularTeamMember,
          teamPerPlayerActive: season.priceRegularTeamMember !== null,
        },
      });

      this.seasonForm
        .get("creatorSchedule")
        .get("regularRegistration")
        .get("endDate")
        .setValue(this.timeService.prepareTZForDisplay(season.regularRegistrationEnds, season.seasonLeague.timezone));

      if (!early) {
        this.seasonForm
          .get("creatorSchedule")
          .get("regularRegistration")
          .get("startDate")
          .setValue(this.timeService.prepareTZForDisplay(season.registrationOpen, season.seasonLeague.timezone));
      }

      await timeout(500);
    }

    if (season.lateRegistrationEnds || season.priceLateSingle !== null || season.priceLateTeam !== null) {
      this.seasonForm.get("creatorSchedule").patchValue({
        lateRegistration: {
          active: true,
          individualPrice: season.priceLateSingle,
          individualActive: true,
          teamPrice: season.priceLateTeam,
          teamActive: season.priceLateTeam !== null,
          teamPerPlayerPrice: season.priceLateTeamMember,
          teamPerPlayerActive: season.priceLateTeamMember !== null,
        },
      });

      this.seasonForm
        .get("creatorSchedule")
        .get("lateRegistration")
        .get("endDate")
        .setValue(this.timeService.prepareTZForDisplay(season.lateRegistrationEnds, season.seasonLeague.timezone));

      if (!regular && !early) {
        this.seasonForm
          .get("creatorSchedule")
          .get("lateRegistration")
          .get("startDate")
          .setValue(this.timeService.prepareTZForDisplay(season.registrationOpen, season.seasonLeague.timezone));
      }

      await timeout(500);
    }

    if (season.seasonWindows) {
      const activityTimes = this.leagueService.convertSeasonWindowsToVM(season.seasonWindows);

      /**
       * Hack for supporting patching value of n length array
       * currently angular doesn't support this.
       * and we need to create the form groups beforehand
       */
      activityTimes.forEach((i) => {
        const itemGroup = this.leagueService.getActivityTimeGroupObject();

        if (i.activityDates && i.activityDates.length > 1) {
          i.activityDates.forEach((date, dateIndex) => {
            // we want to skip the first item since it's already exist there
            if (dateIndex === 0) return;

            (itemGroup.get("activityDates") as FormArray).push(this.leagueService.getActivityDateFormControl());
          });
        }

        (this.seasonForm.get("activityTimes") as FormArray).push(itemGroup);
      });

      this.seasonForm.get("activityTimes").patchValue(activityTimes);
    }

    this.loading = false;
  }

  getRegistrationObject(active = false) {
    return this.fb.group({
      startDate: [""],
      endDate: [""],
      active: active,
      teamPerPlayerPrice: [null, CustomValidators.min(0)],
      teamPerPlayerActive: false,
      teamPerPlayerEntitlements: [],
      individualPrice: [null, CustomValidators.min(0)],
      individualActive: true,
      individualEntitlements: [],
      teamPrice: [null, CustomValidators.min(0)],
      teamActive: false,
      teamEntitlements: [],
    });
  }

  /**
   * This is triggered On every price object change,
   * when it's changed we want to update the registration open dates
   * and adjust the next registration dates so all dates are synced
   * @param type
   * @param date
   */
  registrationObjectChange(type, date) {
    const startDateEarly = this.getRegistrationDate("earlyBirdRegistration", "startDate");
    const endDateEarly = this.getRegistrationDate("earlyBirdRegistration", "endDate");

    const startDateRegular = this.getRegistrationDate("regularRegistration", "startDate");
    const endDateRegular = this.getRegistrationDate("regularRegistration", "endDate");

    const startDateLate = this.getRegistrationDate("lateRegistration", "startDate");
    const endDateLate = this.getRegistrationDate("lateRegistration", "endDate");

    if (!this.registrationChangeProccessing) {
      switch (type) {
        case "earlyBirdRegistration":
          this.registrationChangeProccessing = true;
          if (endDateEarly && endDateEarly !== startDateRegular) {
            this.assignDateToGroupControl(
              "regularRegistration",
              "startDate",
              moment(endDateEarly).add(1, "day").startOf("day"),
            );
          }

          this.season.priceEarlyTeam =
            this.seasonForm.get("creatorSchedule").get("earlyRegistration").get("teamPrice").value || null;
          this.season.priceEarlyTeamMember =
            this.seasonForm.get("creatorSchedule").get("earlyRegistration").get("teamPerPlayerPrice").value || null;
          this.season.priceEarlySingle =
            this.seasonForm.get("creatorSchedule").get("earlyRegistration").get("individualPrice").value || null;
          break;
        case "regularRegistration":
          this.registrationChangeProccessing = true;
          if (endDateRegular && endDateRegular !== startDateLate) {
            this.assignDateToGroupControl(
              "lateRegistration",
              "startDate",
              moment(endDateRegular).add(1, "day").startOf("day"),
            );
          }

          if (startDateRegular) {
            this.assignDateToGroupControl(
              "earlyBirdRegistration",
              "endDate",
              moment(startDateRegular).subtract(1, "day").endOf("day"),
            );
          }

          this.season.priceRegularTeam =
            this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamPrice").value || null;
          this.season.priceRegularTeamMember =
            this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamPerPlayerPrice").value || null;
          this.season.priceRegularSingle =
            this.seasonForm.get("creatorSchedule").get("regularRegistration").get("individualPrice").value || null;
          break;
        case "lateRegistration":
          this.registrationChangeProccessing = true;
          if (startDateLate) {
            this.assignDateToGroupControl("regularRegistration", "endDate", moment(startDateLate).endOf("day"));
          }

          this.season.priceLateTeam =
            this.seasonForm.get("creatorSchedule").get("lateRegistration").get("teamPrice").value || null;
          this.season.priceLateTeamMember =
            this.seasonForm.get("creatorSchedule").get("lateRegistration").get("teamPerPlayerPrice").value || null;
          this.season.priceLateSingle =
            this.seasonForm.get("creatorSchedule").get("lateRegistration").get("individualPrice").value || null;
          break;
      }
    }

    /**
     * Here we are taken the most earliest
     * date as the registration open date
     */
    let registrationOpen;
    if (startDateEarly) {
      registrationOpen = startDateEarly;
    } else if (startDateRegular) {
      registrationOpen = startDateRegular;
    } else if (startDateLate) {
      registrationOpen = startDateLate;
    }

    this.seasonForm.get("registrationOpen").setValue(registrationOpen);

    setTimeout(() => {
      this.registrationChangeProccessing = false;
    }, 100);
  }

  /**
   * Returns the current stored date object from each creator item
   * if the entire item is inactive we return false
   */
  getRegistrationDate(groupName, field): any {
    // if the entire field is closed we return undefined as the date
    // since the whole section is disabled
    if (!this.seasonForm.get("creatorSchedule").get(groupName).get("active").value) {
      return;
    }

    return this.seasonForm.get("creatorSchedule").get(groupName).get(field).value;
  }

  /**
   * Store the specified date to a registration time block
   */
  assignDateToGroupControl(group: string, fieldName, value) {
    this.seasonForm.get("creatorSchedule").get(group).get(fieldName).setValue(value);
  }

  nextStep() {
    if (this.totalSteps > this.currentStep) {
      this.currentStep = ++this.currentStep;
      if (this.currentStep === 2) {
        this.analytics.trackEvent("season-create:step1:complete");
      } else if (this.currentStep === 3) {
        this.analytics.trackEvent("season-create:step2:complete");
      }
    }
  }

  canGoNext() {
    if (this.currentStep === 1) {
      return this.seasonForm.get("basicInfo").valid;
    } else if (this.currentStep === 2) {
      return this.seasonForm.get("creatorSchedule").valid;
    } else if (this.currentStep === 3) {
      return this.seasonForm.valid;
    }
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep = --this.currentStep;
    }
  }

  submit(data) {
    const season = this.leagueService.prepareSeasonObject(
      data,
      this.season && this.season.seasonLeague && this.season.seasonLeague.timezone,
    );
    const error = this.validateSeason(season);
    if (error) return this.toastr.error(error);

    if (this.season) return this.updateSeason(season);
    this.processing = true;
    this.leagueService.createSeason(this.leagueService.currentLeagueId, season).subscribe(
      (response) => {
        this.leagueService.getLeagueById(this.leagueService.currentLeagueId).subscribe((leagueResponse) => {
          this.leagueService.setCurrentLeague(leagueResponse.data);
          this.createProducts(response.data);
          this.savedSeason = response.data;
          this.actionSuccessModal.showModal();
          this.analytics.trackEvent("season-create:complete");
          this.processing = false;
        });
      },
      (err) => {
        this.processing = false;

        const errorMessage = err;
        this.toastr.error(errorMessage.data || "Unexpected error occurred");
      },
    );
  }

  updateSeason(season: LeagueSeason) {
    this.processing = true;
    season.id = this.season.id;

    this.leagueService.updateSeason(this.leagueService.currentLeagueId, this.season.id, season).subscribe(
      () => {
        this.processing = false;
        this.createProducts(this.season);
        this.router.navigate([
          "client",
          "leagues",
          "view",
          this.leagueService.currentLeagueId,
          "season",
          this.season.id,
          "dashboard",
        ]);
        this.toastr.success("Season was successfully updated");
      },
      (err) => {
        this.processing = false;
        this.toastr.error("Error occurred while updating the season");
      },
    );
  }

  validateSeason(season: LeagueSeason) {
    if (!season.name) {
      this.currentStep = 1;
      return "Please provide season name";
    }

    if (!season.description) {
      this.currentStep = 1;
      return "Please provide Season Description";
    }

    if (!season.registrationOpen) {
      this.currentStep = 2;
      return "Registration start date must be provided";
    }

    if (!season.regularRegistrationEnds) {
      this.currentStep = 2;
      return "Regular registration date must be provided";
    }

    if (season.priceRegularSingle === undefined) {
      this.currentStep = 2;
      return "Regular price must be entered";
    }

    if (!season.regularRegistrationEnds) {
      this.currentStep = 2;
      return "Regular registration date must be provided";
    }

    if (!season.startDate || !season.endDate) {
      this.currentStep = 2;
      return "Season start and end date must be provided";
    }

    if (!season.seasonWindows || !season.seasonWindows.length) {
      this.currentStep = 3;
      return "At least one activity time must be defined";
    }
  }

  reset() {
    this.currentStep = 1;
    this.seasonForm.reset();
  }

  unpublish() {
    this.processingUnpublish = true;
    this.leagueService.unpublishSeason(this.season.leagueId, this.season.id).subscribe(
      () => {
        this.processingUnpublish = false;
        this.analytics.trackEvent("season:unpublish", {
          seasonId: this.season.id,
          seasonName: this.season.name,
        });

        this.toastr.success("Season was unpublished");
        this.router.navigate(["/client/leagues/view/" + this.season.leagueId + "/season/" + this.season.id]);
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
    this.leagueService.deleteSeason(this.season.leagueId, this.season.id).subscribe(
      () => {
        this.leagueService.getLeagueById(this.season.leagueId).subscribe((seasonResponse) => {
          this.leagueService.setCurrentLeague(seasonResponse.data);
          this.processingUnpublish = false;

          this.toastr.success("season was deleted");

          if (this.season.parentSeason) {
            this.router.navigate([
              "/client/leagues/view/" + this.season.leagueId + "/season/" + this.season.parentSeason.id,
            ]);
          } else {
            this.router.navigate(["/client/leagues/view/" + this.season.leagueId]);
          }
        });
      },
      (err) => {
        this.processingUnpublish = false;
        const errorResponse = err;

        this.toastr.error(errorResponse.error || "Error occurred while unpublishing tournament event");
      },
    );
  }

  publishSeason() {
    if (!this.league.isPublished) {
      this.router.navigate([
        "/client/leagues/view/" + this.leagueService.currentLeagueId + "/season/" + this.savedSeason.id,
      ]);
      this.toastr.warning("You must publish league before publishing season");
      return;
    }

    this.leagueService.publishSeason(this.leagueService.currentLeagueId, this.savedSeason.id).subscribe(
      () => {
        this.router.navigate([
          "/client/leagues/view/" + this.leagueService.currentLeagueId + "/season/" + this.savedSeason.id,
        ]);
      },
      (err) => {
        const errorResponse = err;
        this.toastr.error(errorResponse.error || "Error occurred while unpublishing league");
      },
    );
  }

  goToSeasonPage() {
    this.reset();
    this.router.navigate([
      "/client/leagues/view/" + this.leagueService.currentLeagueId + "/season/" + this.savedSeason.id,
    ]);
  }

  createProducts(season: LeagueSeason) {
    this.programsService.getLeagueProductsBySeason(season.id).subscribe((results) => {
      const products: RCProgramProduct[] = [];
      if (season.priceEarlySingle || season.priceRegularSingle || season.priceLateSingle) {
        const prices = [];
        const existingId = results.findIndex((r) => r.productSubType === "season_individual");
        if (season.priceEarlySingle) {
          const priceIdx =
            existingId > -1 ? results[existingId]!.prices.findIndex((p) => p.name === "Early bird individual") : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceEarlySingle),
            currency: "USD",
            name: "Early bird individual",
            startDate: moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceRegularSingle) {
          const priceIdx =
            existingId > -1
              ? results[existingId].prices.findIndex((p) => p.name === "Regular registration individual")
              : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceRegularSingle),
            currency: "USD",
            name: "Regular registration individual",
            startDate: season.earlyRegistrationEnds
              ? moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD")
              : moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.regularRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceLateSingle) {
          const priceIdx =
            existingId > -1
              ? results[existingId].prices.findIndex((p) => p.name === "Late registration individual")
              : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceLateSingle),
            currency: "USD",
            name: "Late registration individual",
            startDate: moment.utc(season.regularRegistrationEnds).format("YYYY-MM-DD"),
            endDate: moment.utc(season.lateRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        const individualProductId = existingId > -1 ? { id: results[existingId].id } : {};
        const individualEntitlements =
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("individualEntitlements").value &&
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("individualEntitlements").value.length >
            0
            ? {
                entitlementGroupsPricings: this.seasonForm
                  .get("creatorSchedule")
                  .get("regularRegistration")
                  .get("individualEntitlements").value,
              }
            : {};
        const tempIndividualProduct = {
          organizationId: this.league["creatorId"],
          name: season.name + " individual",
          description: "I want to register as an individual",
          quantity: 1,
          isPublic: true,
          startDate: moment.utc(season.startDate).format("YYYY-MM-DD"),
          endDate: moment.utc(season.endDate).format("YYYY-MM-DD"),
          productType: "league_registration",
          productSubType: "season_individual",
          resourcesType: "season",
          resourcesIdsToApplyOn: [season.id],
          downpayment: this.seasonForm.get("creatorSchedule").get("downPayment").get("individualDownPayment").value,
          prices: [...prices],
          GL: this.league["GL"],
          requiredProductIds: [...this.requiredProductIds],
        };
        products.push({ ...individualProductId, ...tempIndividualProduct, ...individualEntitlements });
      }

      if (season.priceEarlyTeam || season.priceRegularTeam || season.priceLateTeam) {
        const prices = [];
        const existingId = results.findIndex((r) => r.productSubType === "season_team");
        if (season.priceEarlyTeam) {
          const priceIdx =
            existingId > -1 ? results[existingId].prices.findIndex((p) => p.name === "Early bird team") : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceEarlyTeam),
            currency: "USD",
            name: "Early bird team",
            startDate: moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceRegularTeam) {
          const priceIdx =
            existingId > -1 ? results[existingId].prices.findIndex((p) => p.name === "Regular registration team") : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceRegularTeam),
            currency: "USD",
            name: "Regular registration team",
            startDate: season.earlyRegistrationEnds
              ? moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD")
              : moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.regularRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceLateTeam) {
          const priceIdx =
            existingId > -1 ? results[existingId].prices.findIndex((p) => p.name === "Late registration team") : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceLateTeam),
            currency: "USD",
            name: "Late registration team",
            startDate: moment.utc(season.regularRegistrationEnds).format("YYYY-MM-DD"),
            endDate: moment.utc(season.lateRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        const teamProductId = existingId > -1 ? { id: results[existingId].id } : {};
        const teamEntitlements =
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamEntitlements").value &&
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamEntitlements").value.length > 0
            ? {
                entitlementGroupsPricings: this.seasonForm
                  .get("creatorSchedule")
                  .get("regularRegistration")
                  .get("teamEntitlements").value,
              }
            : {};
        const tempTeamProduct = {
          organizationId: this.league["creatorId"],
          name: season.name + " team",
          description: "I want to register my team",
          quantity: 1,
          isPublic: true,
          startDate: moment.utc(season.startDate).format("YYYY-MM-DD"),
          endDate: moment.utc(season.endDate).format("YYYY-MM-DD"),
          productType: "league_registration",
          productSubType: "season_team",
          resourcesType: "season",
          resourcesIdsToApplyOn: [season.id],
          downpayment: this.seasonForm.get("creatorSchedule").get("downPayment").get("teamDownPayment").value,
          prices: [...prices],
          GL: this.league["GL"],
          requiredProductIds: [...this.requiredProductIds],
        };
        products.push({ ...teamProductId, ...tempTeamProduct, ...teamEntitlements });
      }

      if (season.priceEarlyTeamMember || season.priceRegularTeamMember || season.priceLateTeamMember) {
        const prices = [];
        const existingId = results.findIndex((r) => r.productSubType === "season_per_player");
        if (season.priceEarlyTeamMember) {
          const priceIdx =
            existingId > -1 ? results[existingId].prices.findIndex((p) => p.name === "Early bird per member") : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceEarlyTeamMember),
            currency: "USD",
            name: "Early bird per member",
            startDate: moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceRegularTeamMember) {
          const priceIdx =
            existingId > -1
              ? results[existingId].prices.findIndex((p) => p.name === "Regular registration per member")
              : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceRegularTeamMember),
            currency: "USD",
            name: "Regular registration per member",
            startDate: season.earlyRegistrationEnds
              ? moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD")
              : moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.regularRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        if (season.priceLateTeamMember) {
          const priceIdx =
            existingId > -1
              ? results[existingId].prices.findIndex((p) => p.name === "Late registration per member")
              : -1;
          const priceId = priceIdx > -1 ? { id: results[existingId].prices[priceIdx].id } : {};
          prices.push({
            price: Number(season.priceLateTeamMember),
            currency: "USD",
            name: "Late registration per member",
            startDate: season.earlyRegistrationEnds
              ? moment.utc(season.earlyRegistrationEnds).format("YYYY-MM-DD")
              : moment.utc(season.registrationOpen).format("YYYY-MM-DD"),
            endDate: moment.utc(season.lateRegistrationEnds).format("YYYY-MM-DD"),
            ...priceId,
          });
        }
        const teamMemberProductId = existingId > -1 ? { id: results[existingId].id } : {};
        const teamMemberEntitlements =
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamMemberEntitlements").value &&
          this.seasonForm.get("creatorSchedule").get("regularRegistration").get("teamMemberEntitlements").value.length >
            0
            ? {
                entitlementGroupsPricings: this.seasonForm
                  .get("creatorSchedule")
                  .get("regularRegistration")
                  .get("teamMemberEntitlements").value,
              }
            : {};
        const tempTeamMemberProduct = {
          organizationId: this.league["creatorId"],
          name: season.name + " per member",
          description: "I want to join a team",
          quantity: 1,
          isPublic: true,
          startDate: moment.utc(season.startDate).format("YYYY-MM-DD"),
          endDate: moment.utc(season.endDate).format("YYYY-MM-DD"),
          productType: "league_registration",
          resourcesType: "season",
          productSubType: "season_per_player",
          resourcesIdsToApplyOn: [season.id],
          downpayment: this.seasonForm.get("creatorSchedule").get("downPayment").get("teamPerPlayerDownPayment").value,
          prices: [...prices],
          GL: this.league["GL"],
          requiredProductIds: [...this.requiredProductIds],
        };
        products.push({ ...teamMemberProductId, ...tempTeamMemberProduct, ...teamMemberEntitlements });
      }
      this.programsService.saveProgramProducts(products, []).subscribe((results) => {});
    });
  }
}

async function timeout(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
}
