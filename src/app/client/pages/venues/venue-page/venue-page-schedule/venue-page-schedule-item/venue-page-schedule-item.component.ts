
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BookingEditModalComponent } from '@app/client/pages/venues/components/booking-edit-modal/booking-edit-modal.component';
import { NewBookingModalComponent } from '@app/client/pages/venues/components/new-booking-modal/new-booking-modal.component';
import { PackageCreatorModalComponent } from '@app/client/pages/venues/components/package-creator-modal/package-creator-modal.component';
import {
  VenueSchedulerCalendarComponent
} from '@app/client/pages/venues/components/venue-scheduler-calendar/venue-scheduler-calendar.component';
import { CalendarComponent } from '@app/shared/components/fullcalendar/calendar';
import { TimeService } from '@app/shared/services/utils/time.service';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { RCVenue } from '@rcenter/core';
import * as $ from 'jquery';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-venue-page-schedule-item',
  templateUrl: './venue-page-schedule-item.component.html',
  styleUrls: ['./venue-page-schedule-item.component.scss']
})
export class VenuePageScheduleItemComponent implements OnInit, OnDestroy {
  loading = false;
  venue: RCVenue;
  spaces: any[];
  todaysEvents: any[];
  @ViewChild('packageCreatorModal', { static: false }) packageCreatorModal: PackageCreatorModalComponent;
  @ViewChild('newBookingModal', { static: true }) newBookingModal: NewBookingModalComponent;
  @ViewChild('bookingEditModal', { static: true }) bookingEditModal: BookingEditModalComponent;
  @ViewChild('fullCalendar', { static: true }) fullCalendar: CalendarComponent;
  @ViewChild('schedulerCalendar', { static: false }) schedulerCalendar: VenueSchedulerCalendarComponent;
  calendarOptions: any;
  spaceId: number;
  space: any;
  destroy$ = new Subject();
  constructor(
    private timeService: TimeService,
    private router: Router,
    private sportsService: SportsService,
    private activeRoute: ActivatedRoute,
    private venuesService: VenuesService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.spaceId = Number(this.activeRoute.snapshot.params['spaceId']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.calendarOptions = {
      timeZone: 'UTC',
      height: 'parent',
      editable: false,
      firstDay: 1,
      slotEventOverlap: false,
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      header: {
        left:   'prev title next ',
        center: '',
        right:  'today'
      },
      eventClick: (data) => {
        this.bookingEditModal.showModal(data);
      },
      dayClick: (date, jsEvent, view, resource) => {
        this.newBookingModal.showModal({
          resource: { id: this.space.id },
          date: this.timeService.convertTimeZone(date, this.venue['timezone'])
        });
      },
      eventLimit: true, // allow "more" link when too many events
      events: [
      ],

      eventRender: (event, element) => {
        const foundSpace = this.spaces.find(i => {
          return i.id === Number(event.resourceId);
        });

        const tooltipNode = $(`
          <div class="VenueEventTooltip">
            <div class="VenueEventTooltip__top">
              <h5>
                ${event.title}
              </h5>
              <p>
                 ${ foundSpace ? foundSpace.name + ' | ' : ''} ${this.getCourtCapacityString(event.bookingSize)} <br>
                 ${moment(event.start).format('hh:mma')} - ${moment(event.end).format('hh:mma')}
              </p>
            </div>
            <div class="VenueEventTooltip__content">
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Booked By
                </div>
                <div class="EventTooltipItem__content">
                  <b>${event.reservation.customer && event.reservation.customer.name}</b>
                </div>
              </div>
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Paid
                </div>

               ${event.reservation.payment ? `
                <div class="EventTooltipItem__content">
                 ${ event.reservation.payment.providerType === 3 ? 'Paid full Cash' : 'Paid full Credit card'}
                </div>` : ''}

              </div>
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Notes
                </div>
                <div class="EventTooltipItem__content">
                  ${event.reservation.description || ''}
                </div>
              </div>
            </div>
          </div>
        `);

        element.css({ height: 35 + 'px' });
        ($(element) as any).tooltipster({
          contentAsHTML: true,
          arrow: false,
          delay: 450,
          content: tooltipNode
        });
      }
    };


    this.venuesService.currentVenue.pipe(takeUntil(this.destroy$)).subscribe((venue) => {
      this.venue = venue;

      if (venue) {
        this.getEvents();
      }
    });
  }

  addBookingItem(event: { resource: any, date: Moment }) {
    this.newBookingModal.showModal(event);
  }

  getEvents() {
    this.loading = true;
    const startDate = moment().startOf('month');
    const endDate = moment().endOf('month');
    this.venuesService.getVenueSpaces(this.venue.id, true, false, startDate, endDate).subscribe((spacesResponse) => {
      this.spaces = spacesResponse.data;
      this.space = this.spaces.find(i => i.id === this.spaceId);

      if (this.space) {
        this.calendarOptions.events = [];

        for (const session of this.space.sessions) {
          let bgColor: string = "rgba(173, 46, 36, 0.1)";
          let textColor: string = "rgb(173, 46, 36)";

          /*
          FFU - set colors from db settings
          const sport = this.sportsService.getSport(session.reservation.sportType);

          switch (sport.name) {
            case "football":
              bgColor = "rgba(69, 39, 160, 0.1)";
              textColor = "rgba(69, 39, 160, 1.0)";
              break;
            case "baseball":
              bgColor = "rgba(21, 101, 192, 0.1)";
              textColor = "rgba(21, 101, 192, 1.0)";
              break;
            case "tennis":
              bgColor = "rgba(0, 105, 92, 0.1)";
              textColor = "rgba(0, 105, 92, 1.0)";
              break;
            case "basketball":
              bgColor = "rgba(239, 108, 0, 0.1)";
              textColor = "rgba(239, 108, 0, 1.0)";
              break;
            case "ice-skating":
              bgColor = "rgba(173, 20, 87, 0.1)";
              textColor = "rgba(173, 20, 87, 1.0)";
              break;
          }
          */

          const tz = session.timezone;
          let start = session.startDate;
          let end = session.endDate;
          if (tz) {
            // since the calendar assumes local date/time
            // we have to break the events' time and convert it 
            // as if it were on the viewer local time
            start = this.timeService.dateFromTimeZone(start, tz)
            end = this.timeService.dateFromTimeZone(end, tz)
          }

          const event = {
            resourceId: this.space.id,
            id: session.id,
            backgroundColor: bgColor,
            textColor: textColor,
            start,
            end,
            bookingSize: session.percentage,
            title: session.reservation.name,
            reservation: session.reservation
          };

          this.calendarOptions.events.push(event);
        }

        this.todaysEvents = this.calendarOptions.events.filter(i => {
          return moment(i.start).isSame(moment(), 'day');
        });

        this.fullCalendar.updateEvents(this.calendarOptions.events);
      }

    }, () => {
      this.loading = false;
    });
  }

  getSportIcon(sport: number) {
    if (!sport) return;
    const foundSport = this.sportsService.getSport(sport);

    return foundSport && foundSport.icon;
  }


  getPackageHours(duration: number) {
    switch (duration) {
      case 30:
        return '1/2 hour';
      case 60:
        return '1 hour';
      case 90:
        return '1.5 hours';
      case 120:
        return '2 hours';
      default:
        return duration + ' minutes';
    }
  }

  getPackageSize(percentage) {
    switch (percentage) {
      case 25:
        return 'Quarter';
      case 33:
        return 'Third';
      case 50:
        return 'Half';
      case 100:
        return 'Full';
      default:
        return '';
    }
  }

  getCourtCapacityString(percent: number) {
    switch (percent) {
      case 25:
        return 'Quarter';
      case 33:
        return 'Third';
      case 50:
        return 'Half';
      case 100:
        return 'Full';
      default:
        return '';
    }
  }

  updateItems() {
    this.getEvents();
  }
}
