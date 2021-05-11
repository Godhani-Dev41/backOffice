import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '@app/shared/services/events/events.service';
import { RCEvent, RCTeam } from '@rcenter/core';

@Component({
  selector: 'rc-match-report-generator',
  templateUrl: './match-report-generator.component.html',
  styleUrls: ['./match-report-generator.component.scss']
})
export class MatchReportGeneratorComponent implements OnInit {
  visible = false;
  event: any;
  teamA: any;
  teamB: any;
  eventIds: string[];
  events: any[] = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private eventsService: EventsService
  ) {
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
  }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;

    const ids = this.activeRoute.snapshot.queryParams['eventIds'];
    this.eventIds = ids.split(',');

    for (const eventId of this.eventIds) {
      this.eventsService.getEventByIdNoAuth(Number(eventId)).subscribe((response) => {
        this.visible = true;

        const event = response.data;
        event.teamA = event.match.participants[0].entity;
        event.teamB = event.match.participants[1].entity;

        this.events.push(response.data);
      });
    }
  }

  get isVisible() {
    return this.events.length === this.eventIds.length;
  }
}
