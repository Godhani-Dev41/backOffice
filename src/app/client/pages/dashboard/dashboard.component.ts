import { takeUntil } from "rxjs/operators";
import { Component, OnInit, ViewChild } from "@angular/core";
import { RCVenue, RCOrganization } from "@rcenter/core";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { TimeService } from "@app/shared/services/utils/time.service";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import * as $ from "jquery";
import * as moment from "moment";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { CalendarComponent } from "@app/shared/components/fullcalendar/calendar";
import { Subject } from "rxjs";
import { TranslationEn } from "../../../../assets/i18n/en";
import { Router } from "@angular/router";

@Component({
  selector: "rc-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ["dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @ViewChild("fullCalendar", {
    read: false
})
  fullCalendar: CalendarComponent;

  calendarIsVisible = false;
  stats: {
    totalWeeklyHours: number;
    totalDailyHours: number;
    usedWeeklyHours: number;
    usedDailyHours: number;
    weeklyIncome: number;
    dailyIncome: number;
  };

  calendarStats: any = {
    timeZone: "UTC",
    minTime: "09:00",
    maxTime: "23:00",
    height: "parent",
    editable: false,
    firstDay: 1,
    slotEventOverlap: false,
    defaultView: "agendaDay",
    header: false,
    eventLimit: true, // allow "more" link when too many events
    events: [],
  };

  spaces = [];
  venues: RCVenue[] = [];

  // Added to hide dashboard if not platform user
  private destroy$ = new Subject<true>();
  organization: RCOrganization;
  platformUser: boolean = true;
  msg: string;
  msgBtn: string;

  constructor(
    private auth: AuthenticationService,
    private organizationService: OrganizationsService,
    private venuesService: VenuesService,
    private timeService: TimeService,
    private router: Router,
  ) {}

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.auth.currentOrganization.pipe(takeUntil(this.destroy$)).subscribe((organization) => {
      this.organization = organization;
      // Check if this organization is a platforrm user. If there is {} as paymentSettings,
      // or paymentSettings.paymentSettingsStatus === 3
      if (
        !this.organization.paymentSettings ||
        (this.organization.paymentSettings && !this.organization.paymentSettings.paymentSettingStatus)
      ) {
        this.platformUser = false;
        this.msg = TranslationEn.dashboard.notPlatformUser;
        this.msgBtn = TranslationEn.dashboard.goToPaymentButton;
      }
    });

    this.calendarIsVisible = false;
    const organization = this.auth.currentOrganization.getValue();

    this.organizationService
      .getOrganizationStats(Number(organization.id))
      .toPromise()
      .then((data) => (this.stats = data.data));

    this.venuesService
      .getOrganizationVenues(organization.id)
      .toPromise()
      .then((venues) => {
        this.venues = venues.data;
        const spaces = [];

        this.venues.forEach((v) => {
          spaces.push(...v.spaces);
        });

        this.spaces = spaces;
      })
      .then(() => {
        this.organizationService
          .getOrganizationDailyCalander(Number(organization.id))
          .toPromise()
          .then((dailyCalender) => {
            if (this.venues.length) {
              this.initCalenderOptions(dailyCalender.data).then();
            }
          });
      });
  }

  async initCalenderOptions(dailyCalender) {
    this.calendarIsVisible = false;

    const { spacesBusinessHours } = this.venuesService.getSpaceBusinessHours(this.venues[0]);
    const { minStartTime, maxStartTime } = this.venuesService.getMinMaxSpacesTime(spacesBusinessHours);

    const sessions = dailyCalender.map((session) => {
      const event = {
        resourceId: session.spaceId,
        id: session.id,
        backgroundColor: "rgba(173, 46, 36, 0.1)",
        textColor: "rgb(173, 46, 36)",

        // the calendar likes the time to be in local date/time
        start: this.timeService.dateFromTimeZone(session.startDate, session.timezone),
        end: this.timeService.dateFromTimeZone(session.endDate, session.timezone),

        bookingSize: session.percentage,
        title: session.reservation.name,
        reservation: session.reservation,
      };
      this.calendarStats.events.push(event);

      return event;
    });

    this.calendarStats = {
      timeZone: "UTC",
      height: "parent",
      editable: false,
      firstDay: 1,
      slotEventOverlap: false,
      minTime: minStartTime + ":00",
      maxTime: maxStartTime + ":00",
      businessHours: spacesBusinessHours,
      defaultView: "agendaDay",
      schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      header: false,
      eventLimit: true, // allow "more" link when too many events
      events: sessions,
      eventRender: (event, element) => {
        const foundSpace = this.spaces.find((i) => {
          return i.id === Number(event.resourceId);
        });

        const tooltipNode = $(`
          <div class="VenueEventTooltip">
            <div class="VenueEventTooltip__top">
              <h5>
                ${event.title}
              </h5>
              <p>
                 ${foundSpace ? foundSpace.name + " | " : ""} ${this.getCourtCapacityString(event.bookingSize)} <br>
                 ${moment(event.start).format("hh:mma")} - ${moment(event.end).format("hh:mma")}
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
                  Payment
                </div>
               ${
                 event.reservation.payment && event.reservation.payment.status === 1
                   ? `
                <div class="EventTooltipItem__content">
                 ${event.reservation.payment.status === 1 ? "Sent for payment" : ""}
                </div>`
                   : ""
               }

               ${
                 event.reservation.payment && event.reservation.payment.status === 3
                   ? `
                <div class="EventTooltipItem__content">
                 ${event.reservation.payment.providerType === 3 ? "Paid full Cash" : "Paid full Credit card"}
                </div>`
                   : ""
               }

              </div>
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Notes
                </div>
                <div class="EventTooltipItem__content">
                  ${event.reservation.description || ""}
                </div>
              </div>
            </div>
          </div>
        `);

        element.css({ height: 35 + "px" });
        ($(element) as any).tooltipster({
          contentAsHTML: true,
          arrow: false,
          delay: 450,
          content: tooltipNode,
        });
      },
    };

    this.calendarIsVisible = true;

    if (this.fullCalendar) {
      setTimeout(() => {
        this.fullCalendar.updateEvents(sessions);
      }, 500);
    }
  }

  getCourtCapacityString(percent: number) {
    switch (percent) {
      case 25:
        return "Quarter";
      case 33:
        return "Third";
      case 50:
        return "Half";
      case 100:
        return "Full";
      default:
        return "";
    }
  }

  goToPaymentsPage() {
    this.router.navigate(["/client/organization/settings/billing"]);
  }
}
