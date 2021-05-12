import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { TournamentService } from "@app/shared/services/tournament/tournament.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RCActivityTime, RCAddress, RCLeagueSeason } from "@rcenter/core";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import * as moment from "moment";
import { CustomValidators } from "ng2-validation";

@Component({
  selector: "rc-tournament-event-edit",
  templateUrl: "./tournament-event-edit.component.html",
  styleUrls: ["./tournament-event-edit.component.scss"],
})
export class TournamentEventEditComponent implements OnInit, OnDestroy {
  @ViewChild("actionSuccessModal", { static: true }) actionSuccessModal: ActionSuccessModalComponent;

  tournamentEvent: RCLeagueSeason;
  tournamentId: any;
  loading: boolean;
  earlyRegistration$: Subscription;
  lateRegistration$: Subscription;
  regularRegistration$: Subscription;
  tournamentEventForm: FormGroup;
  editingTournamentId: number;
  updateMode: boolean;
  processingUnpublish: boolean;
  get activitiesArray(): FormArray {
    return this.tournamentEventForm.get("activityTimes") as FormArray;
  }

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private leagueService: LeaguesService,
    private fb: FormBuilder,
    private tournamentService: TournamentService,
    private vRef: ViewContainerRef,
  ) {
    this.tournamentEventForm = this.fb.group({
      status: 1,
      registrationStatus: 2,
      name: ["", Validators.required],
      addConsolationRound: false,
      registrationOpen: "",
      creatorSchedule: this.fb.group({
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        earlyBirdRegistration: this.getRegistrationObject(),
        regularRegistration: this.getRegistrationObject(true),
        lateRegistration: this.getRegistrationObject(),
      }),
      activityTimes: this.fb.array([]),
    });

    this.earlyRegistration$ = this.tournamentEventForm
      .get("creatorSchedule")
      .get("earlyBirdRegistration")
      .get("endDate")
      .valueChanges.subscribe(this.registrationObjectChange.bind(this, "earlyBirdRegistration"));

    this.regularRegistration$ = this.tournamentEventForm
      .get("creatorSchedule")
      .get("regularRegistration")
      .get("endDate")
      .valueChanges.subscribe(this.registrationObjectChange.bind(this, "regularRegistration"));

    this.lateRegistration$ = this.tournamentEventForm
      .get("creatorSchedule")
      .get("lateRegistration")
      .get("endDate")
      .valueChanges.subscribe(this.registrationObjectChange.bind(this, "lateRegistration"));
  }

  ngOnInit() {
    this.editingTournamentId = this.activeRoute.snapshot.params["tournamentEventId"];

    if (this.editingTournamentId) {
      const leagueId = this.activeRoute.parent.snapshot.params["tournamentId"];
      this.loadTournamentEvent(leagueId, this.editingTournamentId);
      this.updateMode = true;
    } else {
      this.updateMode = false;
      (this.tournamentEventForm.get("activityTimes") as FormArray).push(
        this.leagueService.getActivityTimeGroupObject(),
      );
    }
  }

  loadTournamentEvent(leagueId: number, tournamentEventId: number) {
    this.leagueService.getSeasonById(leagueId, tournamentEventId).subscribe(
      (response) => {
        this.tournamentEvent = response.data;
        this.loadTournamentEventForEditing(this.tournamentEvent);
      },
      (err) => {
        this.toastr.error("Error occurred while fetching the season");
      },
    );
  }

  loadTournamentEventForEditing(tournamentEvent: RCLeagueSeason) {
    this.tournamentEventForm.patchValue({
      status: tournamentEvent.status,
      registrationStatus: tournamentEvent.registrationStatus,
      registrationOpen: tournamentEvent.registrationOpen,
      name: tournamentEvent.name,
      description: tournamentEvent.description,
      creatorSchedule: {
        startDate: moment(tournamentEvent.startDate).toDate(),
        endDate: moment(tournamentEvent.endDate).toDate(),
      },
    });

    if (tournamentEvent && tournamentEvent.tournament && tournamentEvent.tournament.tournamentConfig) {
      this.tournamentEventForm
        .get("addConsolationRound")
        .setValue(tournamentEvent.tournament.tournamentConfig.consolationMatch);
    }

    let early, regular;

    if (
      tournamentEvent.earlyRegistrationEnds ||
      tournamentEvent.priceEarlySingle !== null ||
      tournamentEvent.priceEarlyTeam !== null
    ) {
      early = true;
      this.tournamentEventForm.get("creatorSchedule").patchValue({
        earlyBirdRegistration: {
          active: true,
          individualPrice: tournamentEvent.priceEarlySingle,
          individualActive: true,
          teamPrice: tournamentEvent.priceEarlyTeam,
          teamActive: tournamentEvent.priceEarlyTeam !== null,
          teamPerPlayerPrice: tournamentEvent.priceEarlyTeamMember,
          teamPerPlayerActive: tournamentEvent.priceEarlyTeamMember !== null,
        },
      });

      this.tournamentEventForm
        .get("creatorSchedule")
        .get("earlyBirdRegistration")
        .get("endDate")
        .setValue(tournamentEvent.earlyRegistrationEnds);

      this.registrationObjectChange("earlyBirdRegistration", { endDate: tournamentEvent.earlyRegistrationEnds } as any);
      this.tournamentEventForm
        .get("creatorSchedule")
        .get("earlyBirdRegistration")
        .get("startDate")
        .setValue(tournamentEvent.registrationOpen);
    }

    if (
      tournamentEvent.regularRegistrationEnds ||
      tournamentEvent.priceRegularSingle !== null ||
      tournamentEvent.priceRegularTeam !== null
    ) {
      regular = true;
      this.tournamentEventForm.get("creatorSchedule").patchValue({
        regularRegistration: {
          active: true,
          individualPrice: tournamentEvent.priceRegularSingle,
          individualActive: true,
          teamPrice: tournamentEvent.priceRegularTeam,
          teamActive: tournamentEvent.priceRegularTeam !== null,
          teamPerPlayerPrice: tournamentEvent.priceRegularTeamMember,
          teamPerPlayerActive: tournamentEvent.priceRegularTeamMember !== null,
        },
      });

      this.tournamentEventForm
        .get("creatorSchedule")
        .get("regularRegistration")
        .get("endDate")
        .setValue(tournamentEvent.regularRegistrationEnds);

      if (!early) {
        this.tournamentEventForm
          .get("creatorSchedule")
          .get("regularRegistration")
          .get("startDate")
          .setValue(tournamentEvent.registrationOpen);
      }
    }

    if (
      tournamentEvent.lateRegistrationEnds ||
      tournamentEvent.priceLateSingle !== null ||
      tournamentEvent.priceLateTeam !== null ||
      tournamentEvent.priceLateTeamMember !== null
    ) {
      this.tournamentEventForm.get("creatorSchedule").patchValue({
        lateRegistration: {
          active: true,
          individualPrice: tournamentEvent.priceLateSingle,
          individualActive: true,
          teamPrice: tournamentEvent.priceLateTeam,
          teamActive: tournamentEvent.priceLateTeam !== null,
          teamPerPlayerPrice: tournamentEvent.priceLateTeamMember,
          teamPerPlayerActive: tournamentEvent.priceLateTeamMember !== null,
        },
      });

      this.tournamentEventForm
        .get("creatorSchedule")
        .get("lateRegistration")
        .get("endDate")
        .setValue(tournamentEvent.lateRegistrationEnds);

      if (!regular && !early) {
        this.tournamentEventForm
          .get("creatorSchedule")
          .get("lateRegistration")
          .get("startDate")
          .setValue(tournamentEvent.registrationOpen);
      }
    }

    if (tournamentEvent.seasonWindows) {
      const activityTimes = this.leagueService.convertSeasonWindowsToVM(tournamentEvent.seasonWindows);

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

        (this.tournamentEventForm.get("activityTimes") as FormArray).push(itemGroup);
      });

      this.tournamentEventForm.get("activityTimes").patchValue(activityTimes);
    }
  }

  ngOnDestroy() {
    this.earlyRegistration$.unsubscribe();
    this.regularRegistration$.unsubscribe();
    this.lateRegistration$.unsubscribe();
  }

  getRegistrationObject(active = false) {
    return this.fb.group({
      startDate: [""],
      endDate: [""],
      active: active,
      teamPerPlayerPrice: [null, CustomValidators.min(0)],
      teamPerPlayerActive: false,
      individualPrice: [null, CustomValidators.min(0)],
      individualActive: true,
      teamPrice: [null, CustomValidators.min(0)],
      teamActive: false,
    });
  }

  submitData(data) {
    const season = this.leagueService.prepareSeasonObject(
      data,
      this.tournamentEvent && this.tournamentEvent.seasonLeague && this.tournamentEvent.seasonLeague.timezone,
    ) as any;
    season.name = data.name;
    season.tournamentType = "singleElimination";
    season.activityTimes = [];

    season.seasonWindows = this.leagueService.createSeasonActivityWindowFromForm(data.activityTimes);
    season.tournamentConfig = {
      consolationMatch: data.addConsolationRound,
    };

    const error = this.validateData(season);
    if (error) {
      this.toastr.error(error);
      return;
    }

    this.tournamentId = this.activatedRoute.snapshot.parent.params.tournamentId;

    if (this.updateMode) {
      return this.updateTournament(season);
    }
    this.loading = true;
    this.tournamentService.createTournamentEvent(this.tournamentId, season).subscribe(
      (response) => {
        this.leagueService.getLeagueById(this.leagueService.currentLeagueId).subscribe((leagueResponse) => {
          this.leagueService.setCurrentLeague(leagueResponse.data);

          this.tournamentEvent = response.data;
          this.loading = false;

          this.actionSuccessModal.showModal();
        });
      },
      (err) => {
        const errorObject = err;
        this.loading = false;
      },
    );
  }

  updateTournament(season: RCLeagueSeason) {
    this.loading = true;

    this.leagueService.updateSeason(this.leagueService.currentLeagueId, this.tournamentEvent.id, season).subscribe(
      () => {
        if (this.tournamentEvent.connectedSeasonId) {
          this.leagueService
            .getSeasonById(this.leagueService.currentLeagueId, this.tournamentEvent.connectedSeasonId)
            .subscribe((leagueResponse) => {
              this.leagueService.setCurrentSeason(leagueResponse.data);

              this.loading = false;
              this.router.navigate([
                "client",
                "tournaments",
                "view",
                this.leagueService.currentLeagueId,
                "item",
                this.tournamentEvent.id,
                "dashboard",
              ]);
              this.toastr.success("Tournament event was successfully updated");
            });
        } else {
          this.loading = false;
          this.router.navigate([
            "client",
            "tournaments",
            "view",
            this.leagueService.currentLeagueId,
            "item",
            this.tournamentEvent.id,
            "dashboard",
          ]);
          this.toastr.success("Tournament event was successfully updated");
        }
      },
      (err) => {
        this.loading = false;
        this.toastr.error("Error occurred while updating the season");
      },
    );
  }

  validateData(season: RCLeagueSeason) {
    if ((!this.tournamentEvent || !this.tournamentEvent["playoffType"]) && !season.regularRegistrationEnds) {
      return "Regular registration date must be provided";
    }

    if ((!this.tournamentEvent || !this.tournamentEvent["playoffType"]) && season.priceRegularSingle === undefined) {
      return "Regular price must be entered";
    }

    if ((!this.tournamentEvent || !this.tournamentEvent["playoffType"]) && !season.regularRegistrationEnds) {
      return "Regular registration date must be provided";
    }

    if (moment(season.startDate).isAfter(season.endDate)) {
      return "Stat date cannot be after End date";
    }
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

    switch (type) {
      case "earlyBirdRegistration":
        if (endDateEarly && !moment(endDateEarly).add(1, "day").isSame(startDateRegular)) {
          this.assignDateToGroupControl(
            "regularRegistration",
            "startDate",
            moment(endDateEarly).add(1, "day").toDate(),
          );
        }
        break;
      case "regularRegistration":
        if (endDateRegular && !moment(endDateRegular).add(1, "day").isSame(startDateLate)) {
          this.assignDateToGroupControl("lateRegistration", "startDate", moment(endDateRegular).add(1, "day").toDate());
        }

        if (startDateRegular) {
          this.assignDateToGroupControl(
            "earlyBirdRegistration",
            "endDate",
            moment(startDateRegular).subtract(1, "day").toDate(),
          );
        }
        break;
      case "lateRegistration":
        if (startDateLate) {
          this.assignDateToGroupControl(
            "regularRegistration",
            "endDate",
            moment(startDateLate).subtract(1, "day").toDate(),
          );
        }
        break;
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

    this.tournamentEventForm.get("registrationOpen").setValue(registrationOpen);
  }

  /**
   * Returns the current stored date object from each creator item
   * if the entire item is inactive we return false
   */
  getRegistrationDate(groupName, field): Date {
    // if the entire field is closed we return undefined as the date
    // since the whole section is disabled
    if (!this.tournamentEventForm.get("creatorSchedule").get(groupName).get("active").value) {
      return;
    }

    return this.tournamentEventForm.get("creatorSchedule").get(groupName).get(field).value;
  }

  /**
   * Store the specified date to a registration time block
   */
  assignDateToGroupControl(group: string, fieldName, value) {
    this.tournamentEventForm.get("creatorSchedule").get(group).get(fieldName).setValue(value);
  }

  goToNewSeason() {
    this.router.navigate(["/client/tournaments/view/" + this.tournamentId + "/item/" + this.tournamentEvent.id]);
  }

  publishTournamentEvent() {
    this.loading = true;
    this.leagueService.publishSeason(this.tournamentId, this.tournamentEvent.id).subscribe(
      () => {
        this.toastr.success("Season was succesfully published!");
        this.loading = false;

        this.goToNewSeason();
      },
      () => {
        this.loading = false;
        this.goToNewSeason();
        this.toastr.error("Error occurred while publishing");
      },
    );
  }

  unpublish() {
    this.processingUnpublish = true;
    this.leagueService.unpublishSeason(this.tournamentEvent.leagueId, this.tournamentEvent.id).subscribe(
      () => {
        this.processingUnpublish = false;

        this.toastr.success("tournament event was unpublished");
        this.router.navigate([
          "/client/tournaments/view/" + this.tournamentEvent.leagueId + "/item/" + this.tournamentEvent.id,
        ]);
      },
      (err) => {
        this.processingUnpublish = false;
        const errorResponse = err;

        this.toastr.error(errorResponse.error || "Error occurred while unpublishing tournament event");
      },
    );
  }

  delete() {
    this.processingUnpublish = true;
    this.leagueService.deleteSeason(this.tournamentEvent.leagueId, this.tournamentEvent.id).subscribe(
      () => {
        this.leagueService
          .getSeasonById(this.tournamentEvent.leagueId, this.tournamentEvent.connectedSeasonId)
          .subscribe((seasonResponse) => {
            this.leagueService.setCurrentSeason(seasonResponse.data);
            this.processingUnpublish = false;

            this.toastr.success("tournament event was delete");

            if (this.tournamentEvent.parentSeason) {
              this.router.navigate([
                "/client/leagues/view/" +
                  this.tournamentEvent.leagueId +
                  "/season/" +
                  this.tournamentEvent.parentSeason.id,
              ]);
            } else {
              this.router.navigate(["/client/tournaments/view/" + this.tournamentEvent.leagueId]);
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
}
