import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { RCOrganization, RCLeagueSeason, RCEvent, EventStatus } from "@rcenter/core";
import { Subscription } from "rxjs";
import * as _ from "lodash";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import { EventsService, InviteEntityGroup, RCInvitesObject } from "@app/shared/services/events/events.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { ConfirmationModalComponent } from "@app/shared/components/confirmation-modal/confirmation-modal.component";
import { SportsService } from "@app/shared/services/utils/sports.service";

@Component({
  selector: "rc-event-inviter-page",
  templateUrl: "./event-inviter-page.component.html",
  styleUrls: ["./event-inviter-page.component.scss"],
})
export class EventInviterPageComponent implements OnInit, OnDestroy {
  inviteForm: FormGroup;
  loading: boolean;
  advancedMode: boolean;
  organization: RCOrganization;
  orgSubscriber$: Subscription;
  seasons: RCLeagueSeason[];
  selectedSeasons: RCLeagueSeason[] = [];
  temp: RCLeagueSeason[];
  @ViewChild("table") table: DatatableComponent;
  @ViewChild("actionSuccessModal", { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  @ViewChild("publishConfirmModal") publishConfirmModal: ConfirmationModalComponent;
  @ViewChild("sendInvitesConfirmModal", { static: true }) sendInvitesConfirmModal: ConfirmationModalComponent;

  leagueOptions: any[];
  sportsOptions: any[];
  event: RCEvent;
  inviteCenterData: {
    active: number;
    followers: number;
  };
  sendLoading: boolean;
  constructor(
    private sportsService: SportsService,
    private eventsService: EventsService,
    private organizationService: OrganizationsService,
    private auth: AuthenticationService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private vRef: ViewContainerRef,
  ) {
    this.inviteForm = this.fb.group({
      advancedMode: false,
      invitesOption: "",
      followers: false,
      activeLeagues: false,
      selectedLeagues: false,
    });

    this.orgSubscriber$ = this.auth.currentOrganization.subscribe((response) => {
      this.organization = response;

      if (response) {
        this.getOrganizationStats();
      }
    });

    this.sportsOptions = this.sportsService.getSports().map((i) => {
      return {
        id: i.id,
        text: i.name,
      };
    });

    const eventId = this.activatedRoute.snapshot.params["eventId"];

    this.loading = true;
    this.eventsService.getEventById(eventId).subscribe(
      (response) => {
        this.event = response.data;
        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }

  getSelectedPlayersCount() {
    return this.selectedSeasons.reduce((h, i) => {
      if (i.playerCount) h += i.playerCount;

      return h;
    }, 0);
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.orgSubscriber$.unsubscribe();
  }

  submitData(data, publishEvent?: boolean) {
    const invitesObject: RCInvitesObject = {
      inviterId: this.organization.id,
      inviterType: "organization",
      generateUrl: true,
      feature: "Event Invite",
      bulk: true,
      tokend: true,
    };

    if (data.followers) {
      invitesObject.entities = [
        {
          entityId: this.organization.id,
          entityType: "organization",
        },
      ];
    } else if (data.activeLeagues) {
      invitesObject.entitiesGroups = [
        {
          entityId: this.organization.id,
          entityType: InviteEntityGroup.ORGANIZATION_ACTIVE_PLAYERS,
        },
      ];
    } else if (data.selectedLeagues) {
      invitesObject.entities = this.selectedSeasons.map((i) => {
        return {
          entityId: i.id,
          entityType: "season" as any,
        };
      });
    } else {
      this.toastr.error("No invite option was selected");
      return;
    }

    this.sendLoading = true;
    this.eventsService.inviteToEvent(this.event.id, invitesObject).subscribe(
      () => {
        if (publishEvent) {
          this.organizationService
            .bulkEventsEdit(this.organization.id, [
              {
                eventId: this.event.id,
                publish: true,
              },
            ])
            .subscribe(
              () => {
                this.sendLoading = false;

                this.toastr.success("Events successfully sent to processing");
                this.router.navigate(["/client/events/view"]);
              },
              () => {
                this.sendLoading = false;
                this.toastr.error("Error publishing event");
              },
            );
        } else {
          this.sendLoading = false;
          this.toastr.success("Events successfully sent to processing");
          this.router.navigate(["/client/events/view"]);
        }
      },
      () => {
        this.sendLoading = false;
        this.toastr.error("Error occurred while sending invites");
      },
    );
  }

  publishAndSend() {
    this.submitData(this.inviteForm.value, true);
  }

  promptSaveInvites() {
    if (this.event.status === EventStatus.DRAFT) {
      this.actionSuccessModal.showModal();
    } else {
      this.sendInvitesConfirmModal.showModal();
    }
  }

  getOrganizationStats() {
    this.organizationService.getInviteCenterData(this.organization.id).subscribe((response) => {
      this.inviteCenterData = response.data;
    });
  }

  selectOption(type) {
    this.inviteForm.get("followers").setValue(false);
    this.inviteForm.get("activeLeagues").setValue(false);
    this.inviteForm.get("advancedMode").setValue(false);
    this.inviteForm.get("selectedLeagues").setValue(false);

    if (type === "followers") {
      this.inviteForm.get("followers").setValue(true);
    } else if (type === "activeLeagues") {
      this.inviteForm.get("activeLeagues").setValue(true);
    } else if (type === "advanced") {
      this.inviteForm.get("advancedMode").setValue(true);

      if (!this.seasons || !this.seasons.length) {
        this.getLeagueSeasons();
      }
    } else if ("selectedLeagues") {
      this.inviteForm.get("selectedLeagues").setValue(true);
    }

    this.inviteForm.get("invitesOption").setValue(type);
  }

  getLeagueSeasons() {
    this.loading = true;

    this.organizationService.getOrganizationSeasons(this.organization.id, true).subscribe(
      (response) => {
        this.seasons = response.data;
        this.temp = JSON.parse(JSON.stringify(response.data));
        this.selectedSeasons = [];

        this.leagueOptions = _.map(_.groupBy(this.seasons, "leagueId"), (i) => {
          return {
            text: i[0].seasonLeague.name,
            id: i[0].seasonLeague.id,
          };
        });

        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }

  clearFilters() {
    this.selectedSeasons = [];
    this.seasons = JSON.parse(JSON.stringify(this.temp));
  }

  leagueFilterSelected(league) {
    if (league) {
      this.seasons = this.temp.filter(function (d) {
        return d.leagueId === league.id;
      });

      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }
  }

  getSportName(sports) {
    const sport = this.sportsService.getSport(sports);

    if (sport) return _.capitalize(sport.name);
  }

  getRegistrationStatusText(season: RCLeagueSeason) {
    if (!season) return;

    if (
      (season.seasonTiming === "future" || season.seasonTiming === "current") &&
      season.registrationTiming !== "close" &&
      season.registrationTiming !== "ended"
    ) {
      if (season.seasonTiming === "current") {
        return "Now Playing";
      } else {
        return "Registration Open";
      }
    } else if (season.seasonTiming === "current") {
      return "Now Playing";
    } else if (season.seasonTiming === "future" && season.registrationTiming === "ended") {
      return "Registration Ended";
    } else if (
      (season.seasonTiming === "future" && season.registrationTiming === "close") ||
      season.seasonTiming === "past"
    ) {
      return "Season Ended";
    } else {
      return;
    }
  }

  onSeasonSelect({ selected }) {
    this.selectedSeasons.splice(0, this.selectedSeasons.length);
    this.selectedSeasons.push(...selected);
  }

  updateTextFilter(event) {
    const val = event.target.value.toLowerCase();

    // update the rows
    this.seasons = this.temp.filter(function (d) {
      return (
        (d.name && d.name.toLowerCase().indexOf(val) !== -1) ||
        (d.seasonLeague && d.seasonLeague.name.toLowerCase().indexOf(val) !== -1) ||
        !val
      );
    });

    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  leagueStatusFilterSelected(item) {
    if (item) {
      if (item.text === "Season Ended") {
        this.seasons = this.temp.filter(function (season) {
          if (
            (season.seasonTiming === "future" && season.registrationTiming === "close") ||
            season.seasonTiming === "past"
          ) {
            return true;
          }
        });
      } else if (item.text === "Registration Ended") {
        this.seasons = this.temp.filter(function (season) {
          if (season.seasonTiming === "future" && season.registrationTiming === "ended") {
            return true;
          }
        });
      } else if (item.text === "Now Playing") {
        this.seasons = this.temp.filter(function (season) {
          if (season.seasonTiming === "current") {
            return true;
          }
        });
      } else if (item.text === "Registration Open") {
        this.seasons = this.temp.filter(function (season) {
          if (
            (season.seasonTiming === "future" || season.seasonTiming === "current") &&
            season.registrationTiming !== "close" &&
            season.registrationTiming !== "ended"
          ) {
            return true;
          }
        });
      }
    }
  }

  sportTypeFilterSelected(item) {
    if (item) {
      this.seasons = this.temp.filter(function (season) {
        return season.seasonLeague.sports && season.seasonLeague.sports[0] === item.id;
      });
    }
  }

  cancelAdvancedMode() {
    this.selectOption("none");
  }

  selectSeasons() {
    this.selectOption("selectedLeagues");
  }
}
