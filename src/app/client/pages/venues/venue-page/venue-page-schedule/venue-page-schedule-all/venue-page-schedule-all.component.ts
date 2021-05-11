
import {takeUntil} from 'rxjs/operators';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BookingEditModalComponent } from "@app/client/pages/venues/components/booking-edit-modal/booking-edit-modal.component";
import { NewBookingModalComponent } from "@app/client/pages/venues/components/new-booking-modal/new-booking-modal.component";
import { PackageCreatorModalComponent } from "@app/client/pages/venues/components/package-creator-modal/package-creator-modal.component";
import { VenueSchedulerCalendarComponent } from "@app/client/pages/venues/components/venue-scheduler-calendar/venue-scheduler-calendar.component";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCVenue } from "@rcenter/core";
import { Moment } from "moment";
import * as moment from "moment";
import { Subject } from "rxjs";
import { TimeService } from "@app/shared/services/utils/time.service";

@Component({
  selector: "rc-venue-page-schedule-all",
  templateUrl: "./venue-page-schedule-all.component.html",
  styleUrls: ["./venue-page-schedule-all.component.scss"],
})
export class VenuePageScheduleAllComponent
  implements OnInit, OnDestroy, AfterViewInit {
  venue: RCVenue;
  spaces: any[];
  dayInfoWidget: any;
  loading = true;
  destroy = new Subject<true>();
  @ViewChild("packageCreatorModal")
  packageCreatorModal: PackageCreatorModalComponent;
  @ViewChild("newBookingModal") newBookingModal: NewBookingModalComponent;
  @ViewChild("bookingEditModal") bookingEditModal: BookingEditModalComponent;
  @ViewChild("schedulerCalendar")
  schedulerCalendar: VenueSchedulerCalendarComponent;
  currentDay: moment.Moment;
  constructor(
    private activeRoute: ActivatedRoute,
    private venuesService: VenuesService,
    private timeService: TimeService
  ) {}

  ngAfterViewInit(): void {
    this.venuesService.currentVenue.pipe(
      takeUntil(this.destroy))
      .subscribe((venue) => {
        this.venue = venue;

        if (venue) {
          this.getEvents();
        }
      });
  }

  ngOnDestroy() {
    this.destroy.next(true);
  }

  ngOnInit() {}

  addBookingItem(event: { resource: any; date: Moment }) {
    this.newBookingModal.showModal(event);
  }

  async getEvents(date?: moment.Moment) {
    this.venuesService
      .getVenueSpaces(this.venue.id, true, true, date)
      .subscribe((spacesResponse) => {
        this.spaces = spacesResponse.data;

        this.loading = false;
        if (this.spaces.length && this.venue) {
          setTimeout(() => {
            this.schedulerCalendar.ngOnInit();
          }, 300);
        }
      });
  }

  async updateItems() {
    await this.getEvents(this.currentDay);
  }

  async dayChanged(day) {
    if (this.currentDay !== day) {
      this.currentDay = day;
      await this.getEvents(day);

      setTimeout(() => {
        if (!this.spaces) return;
        const todaySessions = [];

        for (const space of this.spaces) {
          for (const session of space.sessions) {
            const startDate = session.startDate;
            const dayDate = day;
            if (
              this.timeService.switchTimeZone(dayDate, "gmt", "YYYY-MM-DD") ===
              this.timeService.switchTimeZone(startDate, "gmt", "YYYY-MM-DD")
            ) {
              todaySessions.push(session);
            }
          }
        }

        this.dayInfoWidget = {
          totalAmount: todaySessions.reduce((h, i) => {
            if (i.reservation) {
              h += Math.floor(i.reservation.price);
            }

            return h;
          }, 0),
          totalHoursBooked: todaySessions.reduce((h, i) => {
            const duration = moment.duration(
              moment(i.endDate).diff(i.startDate)
            );
            const hours = duration.asHours();
            if (hours) {
              h += Math.floor(hours);
            }
            return h;
          }, 0),
        };

        const currentDay = moment(day).format("d");
        let totalTimeAvailable = 0;
        for (const space of this.spaces) {
          if (!space.activityTimes || !space.activityTimes.length) {
            totalTimeAvailable += 24;
          } else {
            const releventActivityTimes = space.activityTimes.filter((i) => {
              let mappedDay = i.dayOfWeek;
              if (mappedDay === 8) {
                mappedDay = 0;
              } else {
                mappedDay -= 1;
              }

              return mappedDay === Number(currentDay);
            });

            for (const relDay of releventActivityTimes) {
              const open = Number(relDay.open.split(":")[0]);
              const close = Number(relDay.close.split(":")[0]);
              totalTimeAvailable += close - open;
            }
          }
        }

        const totalLeft =
          totalTimeAvailable - this.dayInfoWidget.totalHoursBooked;
        this.dayInfoWidget.totalAvailableHours = totalLeft >= 0 ? totalLeft : 0;

        if (this.spaces && this.spaces.length > 0 && this.dayInfoWidget) {
          const daySummaryDiv = document.getElementById("daySummary");
          daySummaryDiv.innerHTML = `
      <div class="VenuesBookingInfoStats pull-right" *ngIf="dayInfoWidget">
        <div class="VenuesBookingInfoStats__totals">
      <div>
        <h5>
          Total Scheduled
        </h5>
        <div class="VenuesBookingInfoStats__totals__label">
          ${this.dayInfoWidget.totalHoursBooked}hrs
        </div>
      </div>
      <div>
        <h5>
          Total Available
        </h5>
        <div class="VenuesBookingInfoStats__totals__label">
          ${this.dayInfoWidget.totalAvailableHours}hrs
        </div>
      </div>
      <div>
        <h5>
          Total Paid
        </h5>
        <div class="VenuesBookingInfoStats__totals__label">
          ${this.dayInfoWidget.totalAmount}
        </div>
      </div>
    </div>
  </div>
      `;
        }
      }, 0);
    }
  }
}
