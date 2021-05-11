import { Component, Input, OnInit } from "@angular/core";
import { RCLeagueSeason } from "@rcenter/core";
import { RCProgramSeason } from "@app/shared/services/programs/programs.service";
import * as moment from "moment";

@Component({
  selector: "rc-season-schedule-timeline",
  templateUrl: "./season-schedule-timeline.component.html",
  styleUrls: ["./season-schedule-timeline.component.scss"],
})
export class SeasonScheduleTimelineComponent implements OnInit {
  @Input() season?: RCLeagueSeason;
  @Input() programSeason?: RCProgramSeason;
  dates: {
    earlyStart?: Date;
    earlyEnd?: Date;
    regularStart?: Date;
    regularEnd?: Date;
    lateStart?: Date;
    lateEnd?: Date;
  };
  datesStrings: {
    earlyStart?: string;
    earlyEnd?: string;
    regularStart?: string;
    regularEnd?: string;
    lateStart?: string;
    lateEnd?: string;
  } = {
    earlyStart: "",
    earlyEnd: "",
    regularStart: "",
    regularEnd: "",
    lateStart: "",
    lateEnd: "",
  };
  prices: {
    early?: number;
    regular: number;
    late?: number;
  };

  constructor() {}

  ngOnInit() {
    this.dates = {};
    this.prices = { regular: null };

    if (this.season) {
      if (this.season.registrationOpen) {
        this.dates.earlyStart = this.season.registrationOpen;
        this.dates.regularStart = this.season.registrationOpen;
        this.dates.lateStart = this.season.registrationOpen;
      }

      if (this.season.earlyRegistrationEnds) {
        this.dates.earlyEnd = this.season.earlyRegistrationEnds;
        this.dates.regularStart = this.season.earlyRegistrationEnds;
      } else {
        delete this.dates.earlyStart;
      }

      if (this.season.regularRegistrationEnds) {
        this.dates.regularEnd = this.season.regularRegistrationEnds;
        this.dates.lateStart = this.season.regularRegistrationEnds;
      } else {
        delete this.dates.regularStart;
      }

      if (this.season.lateRegistrationEnds) {
        this.dates.lateEnd = this.season.lateRegistrationEnds;
      } else {
        delete this.dates.lateStart;
      }
    } else if (this.programSeason) {
      /* THIS IS IN CASE THE PRICING CREATION SENDS THE PRICES WITH "BAD" DATES (not organized)
      if (this.programSeason.startDate) {
        this.dates.earlyStart = new Date(this.programSeason.startDate);
        this.dates.regularStart = new Date(this.programSeason.startDate);
        this.dates.lateStart = new Date(this.programSeason.startDate);
      }

      if (this.programSeason.products[0].prices[1]) {
        this.dates.earlyEnd = new Date(this.programSeason.products[0].prices[1].startDate);
        this.dates.regularStart = new Date(this.programSeason.products[0].prices[1].endDate);
      } else {
        delete this.dates.earlyStart;
      }

      if (this.programSeason.endDate) {
        this.dates.regularEnd = new Date(this.programSeason.endDate);
        this.dates.lateStart = new Date(this.programSeason.endDate);
      } else {
        delete this.dates.regularStart;
      }

      if (this.programSeason.products[0].prices[2]) {
        this.dates.lateEnd = new Date(this.programSeason.products[0].prices[2].endDate);
      } else {
        delete this.dates.lateStart;
      }
      */
      // but because right now the prices sent hrad coded and nice, we will use this :
      if (this.programSeason.startDate) {
        this.dates.regularStart = new Date(this.programSeason.products[0].prices[0].startDate);
        this.datesStrings.regularStart = moment.utc(this.dates.regularStart).format("DD MMM YY");
      }

      if (this.programSeason.products[0].prices[1]) {
        this.dates.earlyStart = new Date(this.programSeason.products[0].prices[1].startDate);
        this.datesStrings.earlyStart = moment.utc(this.dates.earlyStart).format("DD MMM YY");
        this.dates.earlyEnd = new Date(this.programSeason.products[0].prices[1].endDate);
        this.datesStrings.earlyEnd = moment.utc(this.dates.earlyEnd).format("DD MMM YY");
        this.prices.early = this.programSeason.products[0].prices[1].price;
      } else {
        delete this.dates.earlyStart;
        delete this.prices.early;
      }

      if (this.programSeason.endDate) {
        this.dates.regularEnd = new Date(this.programSeason.products[0].prices[0].endDate);
        this.datesStrings.regularEnd = moment.utc(this.dates.regularEnd).format("DD MMM YY");
      } else {
        delete this.dates.regularStart;
      }

      if (this.programSeason.products[0].prices[2]) {
        this.dates.lateStart = new Date(this.programSeason.products[0].prices[2].startDate);
        this.datesStrings.lateStart = moment.utc(this.dates.lateStart).format("DD MMM YY");
        this.dates.lateEnd = new Date(this.programSeason.products[0].prices[2].endDate);
        this.datesStrings.lateEnd = moment.utc(this.dates.lateEnd).format("DD MMM YY");
        this.prices.late = this.programSeason.products[0].prices[2].price;
      } else {
        delete this.dates.lateStart;
        delete this.prices.late;
      }

      if (this.programSeason.products[0].prices[0]) {
        this.prices.regular = this.programSeason.products[0].prices[0].price;
      } else {
        delete this.prices.regular;
      }
    }
  }
}
