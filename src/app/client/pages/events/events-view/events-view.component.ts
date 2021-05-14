import { VenueSelectModalComponent } from "./../../../../shared/components/venue-select-modal/venue-select-modal.component";
import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { RCEvent, RCOrganization, EventStatus } from "@rcenter/core";
import { Subject, Subscription } from "rxjs";
import * as _ from "lodash";
import { ConfirmationModalComponent } from "@app/shared/components/confirmation-modal/confirmation-modal.component";
import { ToastrService } from "ngx-toastr";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import * as moment from "moment";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { Router } from "@angular/router";

@Component({
  selector: "rc-events-view",
  templateUrl: "./events-view.component.html",
  styleUrls: ["./events-view.component.scss"],
})
export class EventsViewComponent implements OnInit, OnDestroy {
  @ViewChild("cancelConfirmModal", { static: true })
  cancelConfirmModal: ConfirmationModalComponent;
  @ViewChild("deleteConfirmModal", { static: true })
  deleteConfirmModal: ConfirmationModalComponent;
  @ViewChild("venueSelectModal", { static: true })
  venueSelectModal: VenueSelectModalComponent;
  @ViewChild("table") table: DatatableComponent;
  organization: RCOrganization;
  @Input() isSeason?: boolean;
  seasonId: number;
  private organizationSubscribe$: Subscription;
  private seasonSubscribe$: Subscription;
  events: RCEvent[];
  selectedEvents: RCEvent[] = [];
  temp: RCEvent[] = [];
  loading: boolean;
  textFilter: string = "";
  statusFilter: string = "";
  statusFilterText: string = "All events";
  publishedFilter: string = "";
  publishedFilterText: string = "All statuses";

  constructor(
    private toastr: ToastrService,
    private auth: AuthenticationService,
    private organizationService: OrganizationsService,
    private sportsService: SportsService,
    private programService: ProgramsService,
    private route: Router,
  ) {}

  onEventSelect({ selected }) {
    this.selectedEvents.splice(0, this.selectedEvents.length);
    this.selectedEvents.push(...selected);
  }

  ngOnInit() {
    this.organizationSubscribe$ = this.auth.currentOrganization.subscribe((response) => {
      this.organization = response;
      if (this.organization && !this.isSeason) {
        this.getOrganizationEvents();
      }
    });

    this.seasonSubscribe$ = this.programService.currentSeason$.subscribe((season) => {
      if (this.isSeason && season && season.id) {
        this.seasonId = season.id;
        this.getSeasonEvents();
      }
    });

    this.programService.init().then();
  }

  ngOnDestroy() {
    if (this.organizationSubscribe$) {
      this.organizationSubscribe$.unsubscribe();
    }
    if (this.seasonSubscribe$) {
      this.seasonSubscribe$.unsubscribe();
    }
  }

  getSportName(sport: number) {
    const foundSport = this.sportsService.getSport(sport);

    if (foundSport) {
      return _.capitalize(foundSport.name);
    }
  }

  getOrganizationEvents() {
    this.loading = true;
    this.organizationService.getOrganizationEvents(this.organization.id).subscribe(
      (response) => {
        this.events = response.data.map((i) => {
          if (i.startDate) {
            i.isPastMatch = moment(i.startDate).isBefore(moment());
          }

          return i;
        });

        this.selectedEvents = [];
        this.temp = JSON.parse(JSON.stringify(response.data));
        this.changeStatusFilter("future");
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while loading events");
      },
    );
  }

  getSeasonEvents() {
    this.loading = true;
    this.programService.getSeasonEvents(this.seasonId).subscribe(
      (response) => {
        if (response && response.data) {
          this.events = response.data.map((i) => {
            if (i.startDate) {
              i.isPastMatch = moment(i.startDate).isBefore(moment());
            }

            return i;
          });
          this.temp = JSON.parse(JSON.stringify(response.data));
        } else {
          this.events, (this.temp = []);
        }

        this.selectedEvents = [];
        this.changeStatusFilter("future");
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while loading events");
      },
    );
  }

  promptToCancelEvents() {
    this.cancelConfirmModal.showModal();
  }

  promptToDeleteEvents() {
    this.deleteConfirmModal.showModal();
  }

  cancelSelectedEvents() {
    const idsToPublish = this.selectedEvents.map((i) => {
      return {
        eventId: i.id,
        cancel: true,
      };
    });

    if (!idsToPublish.length) return this.toastr.warning("You must select at least one event to cancel");

    this.organizationService.bulkEventsEdit(this.organization.id, idsToPublish).subscribe(
      () => {
        this.toastr.success("Events successfully canceled");
        this.getOrganizationEvents();
      },
      () => {
        this.toastr.error("Error occurred during events cancel");
      },
    );
  }

  deleteSelectedEvents() {
    const idsToDelete = this.selectedEvents.map((i) => {
      return {
        eventId: i.id,
        delete: true,
      };
    });

    if (!idsToDelete.length) return this.toastr.warning("You must select at least one event to delete");

    this.organizationService.bulkEventsEdit(this.organization.id, idsToDelete).subscribe(
      () => {
        this.toastr.success("Events successfully deleted");
        this.getOrganizationEvents();
      },
      () => {
        this.toastr.error("Error occurred during events deletion");
      },
    );
  }

  editEvent(eventRow: RCEvent) {
    if (!this.isSeason) {
      this.route.navigate(["/client/events/event-creator/" + eventRow.id]);
    } else {
      this.route.navigate(["/client/events/event-creator/" + eventRow.id + "/basic"]);
      //this.selectedEvents = [eventRow]
      //this.venueSelectModal.showModal();
    }
  }

  publishSelectedEvents() {
    const mappedMatches = this.selectedEvents
      .filter((i) => i.status !== EventStatus.CANCELLED)
      .map((i) => {
        return {
          publish: true,
          eventId: i.id,
        };
      });

    if (!mappedMatches.length) return this.toastr.warning("You must select at least one non canceled event to publish");

    this.organizationService.bulkEventsEdit(this.organization.id, mappedMatches).subscribe(
      () => {
        this.toastr.success("Matches successfully updated");
        this.getOrganizationEvents();
      },
      () => {
        this.toastr.error("Error occurred during matches update");
      },
    );
  }

  changeEventsVenue(venue) {
    const mappedMatches = this.selectedEvents
      .filter((i) => i.status !== EventStatus.CANCELLED)
      .map((i) => {
        return {
          address: venue.address,
          venueName: venue.venueName,
          venueId: venue.venueId,
          eventId: i.id,
        };
      });
    if (!mappedMatches.length) return this.toastr.warning("You must select at least one event to change");

    this.organizationService.bulkEventsEdit(this.organization.id, mappedMatches).subscribe(
      () => {
        this.toastr.success("Matches successfully updated");
        this.ngOnInit();
      },
      () => {
        this.toastr.error("Error occurred during matches update");
      },
    );
  }

  publishEvent(event: RCEvent) {
    const mappedMatches = [
      {
        eventId: event.id,
        publish: true,
      },
    ];

    this.organizationService.bulkEventsEdit(this.organization.id, mappedMatches).subscribe(
      () => {
        this.toastr.success("Event successfully published");
        event.status = EventStatus.OPEN;
      },
      () => {
        this.toastr.error("Error occurred during matches update");
      },
    );
  }

  changeTextFilter(event) {
    this.textFilter = event.target.value.trim().toLowerCase();
    if (this.textFilter !== "") {
      this.applyTextFilter();
    } else {
      this.applyFilters();
    }
  }

  changeStatusFilter(status?: string) {
    this.statusFilter = status;
    if (this.statusFilter !== "") {
      this.applyStatusFilter();
    } else {
      this.applyFilters();
    }
  }

  changePublishedFilter(status?: string) {
    this.publishedFilter = status;
    if (this.publishedFilter !== "") {
      this.applyPublishFilter();
    } else {
      this.applyFilters();
    }
  }

  applyTextFilter() {
    this.events = this.events.filter((d) => d.title && d.title.toLowerCase().indexOf(this.textFilter) !== -1);
  }

  applyStatusFilter() {
    switch (this.statusFilter) {
      case "":
        this.statusFilterText = "All events";
        break;
      case "finished":
        this.statusFilterText = "Finished events";
        this.events = this.temp.filter(
          (d) => d.isPastMatch && d.status !== EventStatus.CANCELLED && d.status !== EventStatus.DELETED,
        );
        break;
      case "future":
        this.statusFilterText = "Future events";
        this.events = this.temp.filter(
          (d) => !d.isPastMatch && d.status !== EventStatus.CANCELLED && d.status !== EventStatus.DELETED,
        );
        break;
      case "canceled":
        this.statusFilterText = "Canceled events";
        this.events = this.temp.filter((d) => d.status === EventStatus.CANCELLED);
        break;
    }
  }

  applyPublishFilter() {
    switch (this.publishedFilter) {
      case "":
        this.publishedFilterText = "All statuses";
        break;
      case "published":
        this.publishedFilterText = "Published events";
        this.events = this.events.filter((d) => d.status !== 2);
        break;
      case "draft":
        this.publishedFilterText = "Draft events";
        this.events = this.events.filter((d) => d.status === 2);
        break;
    }
  }

  applyFilters() {
    this.events = this.temp;
    if (this.textFilter.trim().length > 0) this.applyTextFilter();
    this.applyStatusFilter();
    this.applyPublishFilter();
    this.table.offset = 0;
  }
}
