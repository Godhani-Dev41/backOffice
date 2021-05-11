import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { CalendarComponent } from "@app/shared/components/fullcalendar/calendar";
import { TimeService } from "@app/shared/services/utils/time.service";
import { Options } from "fullcalendar-scheduler";
import * as $ from "jquery";
import "tooltipster";
import * as moment from "moment-timezone";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";

@Component({
  selector: "rc-venue-scheduler-calendar",
  templateUrl: "./venue-scheduler-calendar.component.html",
  styleUrls: ["./venue-scheduler-calendar.component.scss"],
  exportAs: "schedulerCalendar",
})
export class VenueSchedulerCalendarComponent implements OnInit, OnChanges {
  @Input() spaces: any[];
  @Input() venue: any;
  @Output() onEmptySlotClick = new EventEmitter();
  @Output() onEventClick = new EventEmitter();
  @Output() onDayChange = new EventEmitter();

  @ViewChild("fullCalendar") fullCalendar: CalendarComponent;
  schedulerOptions: Options;
  selectedDate: moment.Moment;
  initRanOnce: boolean = false;

  constructor(
    private timeService: TimeService,
    private venuesService: VenuesService,
    private sportsService: SportsService
  ) { }

  ngOnChanges(changes) {
    if (this.schedulerOptions && changes.spaces) {
      this.init();
    }
  }

  init() {
    const finalResources = [];
    this.spaces = JSON.parse(JSON.stringify(this.spaces));

    const spaces = this.spaces.map((i) => {
      return {
        id: i.id,
        title: i.name,
        parentSpaceId: i.parentSpaceId,
        sports: i.sports,
        children: [],
        businessHours: i.activityTimes.map((j) => {
          const startHour = j.open.split(":");
          const endHour = j.close.split(":");
          let day = j.dayOfWeek;
          if (day === 8) {
            day = 0;
          } else {
            day -= 1;
          }

          return {
            dow: [day],
            start: startHour[0] + ":" + startHour[1],
            end: endHour[0] + ":" + endHour[1],
          };
        }),
      };
    });

    const events = [];
    let added = {};
    for (const space of this.spaces) {
      if (space.sessions) {
        for (const session of space.sessions) {
          let key = space.id + ":" + session.id;
          if (added[key]) {
            continue;
          }
          added[key] = session;

          let bgColor: string = "rgba(173, 46, 36, 0.1)";
          let textColor: string = "rgb(173, 46, 36)";

          const sport = this.sportsService.getSport(
            session.reservation ? session.reservation.sportType : 1000
          );

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

          const startDateTZ = this.timeService.dateFromTimeZone(session.startDate, session.timezone);
          const endDateTZ = this.timeService.dateFromTimeZone(session.endDate, session.timezone);

          const event = {
            id: session.id + '-' + space.id,
            resourceId: space.id,
            backgroundColor: bgColor,
            textColor: textColor,
            start: startDateTZ,
            end: endDateTZ,
            bookingSize: session.percentage,
            title:
              session.reservation.name || 'No reservation name' +
              " - " +
              this.getCourtCapacityString(session.percentage),
            reservation: session.reservation || null,
          };

          events.push(event);
        }
      }
    }

    const parentSpaces = spaces.filter((ps) => {
      return ps.parentSpaceId === null;
    });

    parentSpaces.forEach((s) => {
      const childrenExist =
        spaces.findIndex((sp) => {
          return sp.parentSpaceId === s.id;
        }) > -1;
      if (childrenExist) {
        const children = spaces.filter((cs) => {
          return cs.parentSpaceId === s.id;
        });
        children.forEach((child) => {
          s.children.push(child);
        });
      }

      parentSpaces.forEach((rec) => {
        finalResources.push(rec);
      });
    });

    this.schedulerOptions.resources = finalResources;
    this.schedulerOptions.events.splice(0, this.schedulerOptions.events.length);
    this.schedulerOptions.events.push(...events);
    this.fullCalendar.updateEvents(events);

    // Add extra buttons to calendar header
    if (!this.initRanOnce && this.selectedDate) {
      const headerContent = document.getElementsByClassName("fc-center")[0];
      const prevDay = document.getElementsByClassName(
        "fc-prev-button fc-button fc-state-default fc-corner-left fc-corner-right"
      )[0];
      const nextDay = document.getElementsByClassName(
        "fc-next-button fc-button fc-state-default fc-corner-left fc-corner-right"
      )[0];

      const prevArrow = document.createElement("div");
      prevArrow.innerHTML = `<button type="button" class="fc-prev-button fc-button fc-state-default fc-corner-left fc-corner-right" id="prevMonth" style="top: 0;">
                                <span class="fc-icon fc-icon-left-double-arrow"></span>
                              </button>`;

      const nextArrow = document.createElement("div");
      nextArrow.innerHTML = `<button type="button" class="fc-next-button fc-button fc-state-default fc-corner-left fc-corner-right" id="nextMonth" style="top: 0;">
                                <span class="fc-icon fc-icon-right-double-arrow"></span>
                              </button>`;

      headerContent.insertBefore(prevArrow, prevDay);
      headerContent.appendChild(nextArrow);

      const prevMonthBtn = document.getElementById("prevMonth");
      prevMonthBtn.addEventListener("click", () => {
        this.changeMonth("previous");
      });

      const nextMonthBtn = document.getElementById("nextMonth");
      nextMonthBtn.addEventListener("click", () => {
        this.changeMonth("next");
      });

      this.initRanOnce = true;
    }
  }

  ngOnInit() {
    const {
      spacesBusinessHours,
      venueBusinessHours,
    } = this.venuesService.getSpaceBusinessHours(this.venue);
    const {
      minStartTime,
      maxStartTime,
    } = this.venuesService.getMinMaxSpacesTime(spacesBusinessHours);

    this.schedulerOptions = {
      timeZone: "UTC",
      schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
      aspectRatio: 2,
      scrollTime: "00:00",
      defaultView: "timelineDay",
      resourceAreaWidth: "140px",
      editable: false,
      contentHeight: "auto",
      minTime: minStartTime,
      maxTime: maxStartTime,
      businessHours: venueBusinessHours,
      resourcesInitiallyExpanded: false,
      header: {
        left: "",
        center: "prev title next",
        right: "timeline list today",
      },
      views: {
        timelineDay: {
          buttonText: ":30 slots",
          slotDuration: "00:30",
        },
        timelineTenDay: {
          type: "timeline",
          duration: { days: 2 },
        },
      },
      eventClick: (data) => {
        this.onEventClick.emit(data);
      },
      dayClick: (date, jsEvent, view, resource) => {
        this.onEmptySlotClick.emit({
          resource,
          date: this.timeService.convertTimeZone(date, this.venue.timezone),
        });
      },
      eventAfterAllRender: (view) => {
        this.selectedDate = view.start;
        this.onDayChange.emit(view.start);
      },
      resourceRender: (resourceObj, labelTds) => {
        const $resource =
          resourceObj.children.length > 0
            ? $(
              `
           <div class="ResourceTimeLine">
              <div class="ResourceTimeLine__inner">
                <div class="expander-icon" style="display: flex; flex-direction: row; align-items: center">
                  <i class="fa fa-plus-square-o" style="font-size: 18px; margin-inline-end: 4px;"></i>
                  <h1>${resourceObj.title}</h1>
                </div>
                <div class="ResourceTimeLine__sports">
                </div>
              </div>
           </div>
        `
            )
            : $(`
           <div class="ResourceTimeLine">
              <div class="ResourceTimeLine__inner">
                  <h1>${resourceObj.title}</h1>
                <div class="ResourceTimeLine__sports">
                </div>
              </div>
           </div>
        `);

        if (resourceObj.sports) {
          resourceObj.sports.slice(0, 3).forEach((sport) => {
            const foundSport = this.sportsService.getSport(sport);

            if (foundSport) {
              $resource
                .find(".ResourceTimeLine__sports")
                .append(`<i class="${foundSport.icon}"></i>`);
            }
          });
        }

        labelTds.html($resource);

        if (resourceObj.children.length > 0) {
          labelTds.find(".expander-icon").addClass("fc-expander");
        }
      },
      events: [],
      resources: [],
      // resourceGroupField: "parentSpaceId",
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
                 ${foundSpace && foundSpace.name
          } | ${this.getCourtCapacityString(event.bookingSize)} <br>
                 ${moment(event.start).format("hh:mma")} - ${moment(
            event.end
          ).format("hh:mma")}
              </p>
            </div>
            <div class="VenueEventTooltip__content">
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Booked By
                </div>
                <div class="EventTooltipItem__content">
                  <b>${event.reservation &&
          event.reservation.customer &&
          event.reservation.customer.name
          }</b>
                </div>
              </div>
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Paid
                </div>

               ${event.reservation &&
            event.reservation.payment &&
            event.reservation.payment.status === 3
            ? `
                <div class="EventTooltipItem__content">
                 ${event.reservation && event.reservation.payment.providerType === 3
              ? "Paid full Cash"
              : "Paid full Credit card"
            }
                </div>`
            : ""
          }

              </div>
              <div class="EventTooltipItem">
                <div class="EventTooltipItem__header">
                  Notes
                </div>
                <div class="EventTooltipItem__content">
                  ${event.reservation ? event.reservation.description : ""}
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

    this.init();
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

  changeMonth(change: "previous" | "next") {
    if (change === "previous") {
      this.onDayChange.emit(this.selectedDate.add(-1, "M"));
      this.fullCalendar.changeDate(this.selectedDate);
    }
    if (change === "next") {
      this.onDayChange.emit(this.selectedDate.add(1, "M"));
      this.fullCalendar.changeDate(this.selectedDate);
    }
  }
}
