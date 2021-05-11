import { Component, Input, OnChanges, OnInit } from "@angular/core";
import * as _ from "lodash";
import * as moment from "moment";
import { RCActivityTime, RCLeagueSeason } from "@rcenter/core";
import { ActivityTimes } from "@app/client/pages/programs/program-season-schedule-page/program-season-schedule-page.component";
import { RCProgramSeason } from "@app/shared/services/programs/programs.service";
import { TranslationEn } from "../../../../../assets/i18n/en";

interface ActivityTimeVM {
  days: string[];
  hours: string;
}

@Component({
  selector: "rc-league-date-games",
  templateUrl: "./league-date-games.component.html",
  styleUrls: ["./league-date-games.component.scss"],
})
export class LeagueDateGamesComponent implements OnInit, OnChanges {
  @Input() activityTimes?: RCActivityTime[];
  @Input() programActivityTimes?: ActivityTimes[];
  @Input() season: RCLeagueSeason | RCProgramSeason;
  activityTimesVM: ActivityTimeVM[];
  daysOfWeekTranslation: string[] = TranslationEn.daysOfWeek;

  startDate: string;
  endDate: string;
  constructor() {}

  ngOnInit() {
    this.startDate = moment(this.season.startDate).format("D MMM, YYYY");
    this.endDate = moment(this.season.endDate).format("D MMM, YYYY");
    this.transformActivityTimes(this.programActivityTimes || []);
  }

  ngOnChanges(changes) {
    if (changes.activityTimes) {
      this.transformActivityTimes(this.activityTimes || []);
    }
    if (changes.programActivityTimes) {
      this.transformActivityTimes(this.programActivityTimes || []);
      /*this.startDate = moment(changes.programActivityTimes.startDate).format("D MMM, YYYY");
      this.endDate = moment(changes.programActivityTimes.endDate).format("D MMM, YYYY");*/
    }
  }

  transformActivityTimes(activities: RCActivityTime[] | ActivityTimes[]) {
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
          item.hours = moment(j.open, "HH:mm:ss").format("hh:mmA") + "-" + moment(j.close, "HH:mm:ss").format("hh:mmA");
          item.days.push(moment(j.dayOfWeek - 1, "E").format("dddd"));
        });

        return item;
      })
      .value();
  }
}
