import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import { EventsService } from "@app/shared/services/events/events.service";
import { RCEvent, RCEventAttendee, RCEventAttendeeStatus } from "@rcenter/core";
import { PlayerSeasonInfoModalComponent } from "@app/shared/components/leagues/player-season-info-modal/player-season-info-modal.component";

@Component({
  selector: "rc-event-participants-modal",
  templateUrl: "./event-participants-modal.component.html",
  styleUrls: ["./event-participants-modal.component.scss"],
  exportAs: "modal",
})
export class ParticipantsModalComponent implements OnInit {
  @ViewChild("modal", { static: true }) public modal: ModalDirective;
  @ViewChild("playerInfoModal", { static: true }) playerInfoModal: PlayerSeasonInfoModalComponent;

  invites: RCEventAttendee[] = [];
  visibleItems: RCEventAttendee[] = [];
  currentView: "going" | "notGoing" | "noReply";
  RCEventAttendeeStatus = RCEventAttendeeStatus;
  loading: boolean;
  goingCount = 0;
  notGoingCount = 0;
  noReplyCount = 0;
  event: RCEvent;

  constructor(protected eventsService: EventsService) {}

  ngOnInit() {}

  showModal(eventId: number) {
    if (!eventId) throw new Error("Event id must be provided");
    this.invites = [];
    this.goingCount = 0;
    this.notGoingCount = 0;
    this.noReplyCount = 0;

    this.loading = true;
    this.eventsService.getEventParticipants(eventId).subscribe((response) => {
      this.loading = false;
      this.invites = response.data || [];
      this.goingCount = this.getListCount("going");
      this.notGoingCount = this.getListCount("notGoing");
      this.noReplyCount = this.getListCount("noReply");

      this.filterItems("going");
    });

    this.eventsService.getEventById(eventId).subscribe((response) => {
      this.event = response.data;
      if (!this.event.eventAttendees || !this.event.eventAttendees.length) {
        this.event.eventAttendees = this.invites;
      }
    });

    this.modal.show();
  }

  filterItems(type: "going" | "notGoing" | "noReply") {
    this.currentView = type;

    this.visibleItems = this.invites.filter((i) => {
      if (type === "going") {
        return i.status === RCEventAttendeeStatus.ACCEPTED;
      } else if (type === "notGoing") {
        return (
          i.status === RCEventAttendeeStatus.DECLINED ||
          i.status === RCEventAttendeeStatus.REJECTED
        );
      } else if (type === "noReply") {
        return i.status === RCEventAttendeeStatus.PENDING;
      }
    });
  }

  getListCount(type) {
    const items = this.invites.filter((i) => {
      if (type === "going") {
        return i.status === RCEventAttendeeStatus.ACCEPTED;
      } else if (type === "notGoing") {
        return (
          i.status === RCEventAttendeeStatus.DECLINED ||
          i.status === RCEventAttendeeStatus.REJECTED
        );
      } else if (type === "noReply") {
        return i.status === RCEventAttendeeStatus.PENDING;
      }
    });

    return items.length;
  }

  showPlayerInfoModal() {}
}
