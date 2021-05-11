import { Component, OnInit } from "@angular/core";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCActivityTime, RCOpeningTimes, RCVenue } from "@rcenter/core";
import * as _ from "lodash";
import * as moment from "moment";
import { SportsService } from "@app/shared/services/utils/sports.service";
interface ActivityTimeVM {
  days: string[];
  hours: string;
}
export interface RCGoogleGetImageOptions {
  lat: number;
  lon: number;
  marker?: boolean;
  size?: string;
  zoom?: number;
}

@Component({
  selector: "rc-venue-page-details",
  templateUrl: "./venue-page-details.component.html",
  styleUrls: ["./venue-page-details.component.scss"],
})
export class VenuePageDetailsComponent implements OnInit {
  venue: RCVenue;
  venueMapImage: string;
  activityTimesVM: any[];
  constructor(
    private sportsService: SportsService,
    private venuesService: VenuesService
  ) {
    this.venuesService.currentVenue.subscribe((venue) => {
      this.venue = venue;
      if (this.venue && this.venue.address) {
        this.venueMapImage = this.getMapImage({
          lat: this.venue.address.geo[1],
          lon: this.venue.address.geo[0],
          size: "600x600",
          zoom: 17,
        });

        this.transformActivityTimes(this.venue.openingTimes);
      }
    });
  }

  ngOnInit() {}

  getMapImage(options: RCGoogleGetImageOptions): string {
    if (!options.marker) options.marker = true;
    if (!options.size) options.size = "600x250";
    if (!options.zoom) options.zoom = 16;
    const googleBasicURL = `https://maps.googleapis.com/maps/api/staticmap?center=${
      options.lat
    },${options.lon}&zoom=${options.zoom}&size=${options.size}${
      options.marker
        ? "&markers=color:orange|" + options.lat + "," + options.lon
        : ""
    }&key=AIzaSyDsmw9yRarqz11iapQD7ryZgFObIVNjr8I`;

    return googleBasicURL;
  }

  getSportIcon(sport: number) {
    const foundSport = this.sportsService.getSport(sport);
    if (foundSport) return foundSport.icon;
  }

  transformActivityTimes(activities: RCOpeningTimes[]) {
    this.activityTimesVM = _.chain(activities)
      .map((i: any) => {
        i.timeKey = i.open + " " + i.close;

        return i;
      })
      .groupBy((i: any) => i.timeKey)
      .map((i) => {
        const item: ActivityTimeVM = {
          days: [],
        } as ActivityTimeVM;

        i = i.map((slot) => {
          slot.dayOfWeekSort = slot.dayOfWeek;
          if (slot.dayOfWeek === 8) {
            slot.dayOfWeekSort = 0;
          }

          return slot;
        });

        i = _.sortBy(i, "dayOfWeekSort");

        i.forEach((j) => {
          item.hours =
            moment(j.open, "HH:mm:ss").format("hh:mmA") +
            "-" +
            moment(j.close, "HH:mm:ss").format("hh:mmA");
          item.days.push(moment(j.dayOfWeek - 1, "E").format("ddd"));
        });

        return item;
      })
      .value();
  }
}
