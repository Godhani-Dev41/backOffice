import { Component, Input, OnInit } from '@angular/core';
import { RCLeagueSeason, RCSeasonRoundMatch, RCVenueActivityItem } from '@rcenter/core';
import { TimeService } from '@app/shared/services/utils/time.service';

@Component({
  selector: 'rc-schedular-calendar-view',
  templateUrl: './schedular-calendar-view.component.html',
  styleUrls: ['./schedular-calendar-view.component.scss']
})
export class SchedularCalendarViewComponent implements OnInit {
  @Input() set roundMatches(matches: RCSeasonRoundMatch[]) {
    this.convertEvents(matches);
  };

  @Input() set seasonActivityTimes(activities: RCVenueActivityItem[]) {
    this.convertActivityTimes(activities);
  };

  calendarOptions: any = {
    timeZone: 'UTC',
    height: 'parent',
    editable: false,
    firstDay: 1,
    slotEventOverlap: false,

    header: {
      left:   'prev title next month agendaWeek agendaDay',
      center: '',
      right:  ''
    },
    eventLimit: true, // allow "more" link when too many events
    events: [
    ]
  };
  constructor(
    private timeService: TimeService
  ) { }

  ngOnInit() {
  }

  convertEvents(matches: RCSeasonRoundMatch[]) {
    let events: any[] = [];
    if (matches) {
      events = matches.map(i => {
        return {
          borderColor: i['divisionColor'],
          id: i.id,
          title: i.title,
          start: this.timeService.convertTimeZone(i.startDate, i.timezone),
          end: this.timeService.convertTimeZone(i.endDate, i.timezone)
        };
      });
    }

    this.calendarOptions.events = events;
  }

  convertActivityTimes(activities: RCVenueActivityItem[]) {
    if (!activities) return;

    this.calendarOptions.businessHours = activities.filter(i => i.activityTime).map(i => {
      if (i.activityTime.dayOfWeek === 8) {
        i.activityTime.dayOfWeek = 1;
      }

      return {
        start: i.activityTime.open,
        end:  i.activityTime.close,
        dow: [i.activityTime.dayOfWeek - 1]
      };
    });
  }
}
