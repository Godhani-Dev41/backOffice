import { ProgramTypeEnum } from "./../../../services/programs/programs.service";
import { Component, Input, OnInit } from "@angular/core";
import * as _ from "lodash";
import * as moment from "moment";
import { RCLeague, RCLeagueDetailTypeEnum, RCLeagueSeason } from "@rcenter/core";
import { Router } from "@angular/router";
import { SportsService } from "@app/shared/services/utils/sports.service";

@Component({
  selector: "rc-league-box",
  templateUrl: "./league-box.component.html",
  styleUrls: ["./league-box.component.scss"],
})
export class LeagueBoxComponent implements OnInit {
  @Input() league: any;
  @Input() tournament: boolean;
  @Input() type: ProgramTypeEnum;
  constructor(private router: Router, private sportsService: SportsService) {}

  ngOnInit() {}

  /**
   * Returns the oldest start dates from all league seasons
   * and returns the most recent end date from all leagues seasons
   * @returns {string}
   */
  getLeagueDates(): string {
    const startDate = _.map<any, any>(this.league.leagueSeasons, "startDate").reduce((h, i) => {
      if ((moment(i).isValid() && moment(i).isBefore(h)) || !h) {
        h = i;
      }
      return h;
    }, null);

    const endDate = _.map<any, any>(this.league.leagueSeasons, "endDate").reduce((h, i) => {
      if ((moment(i).isValid() && moment(i).isAfter(h)) || !h) {
        h = i;
      }
      return h;
    }, null);

    if (moment(endDate).isValid() && moment(startDate).isValid()) {
      return `${moment(startDate).format("MM/DD/YY")} - ${moment(endDate).format("MM/DD/YY")}`;
    } else {
      return "";
    }
  }

  /**
   * Retrieve the outlines sport icon
   * if multiple sports passed the multi icon will be fetched
   * @param sports
   * @returns {string}
   */
  getSportIcon(sports: number[], sport: number): string {
    if (sport) sports = [sport];
    if (!sports && !sport) sports = [];

    return this.sportsService.getSportsIcon(sports, true);
  }

  /**
   * We want to extract the league details text for levelOfPlay
   * server sends the data inside the json data object.
   * if nothing found generic text returned
   * @returns {string}
   */
  getLevelOfPlayTexts() {
    let levelOfPlayDetail;
    if (this.league.level && this.league.level.length) {
      levelOfPlayDetail = {};
      levelOfPlayDetail["data"] = this.league.level;
    } else {
      if (!this.league.leagueDetails) return "Not Specified";
      levelOfPlayDetail = _.find(this.league.leagueDetails, (i) => i.detailType === RCLeagueDetailTypeEnum.LEVELOFPLAY);
    }

    let levels = [];
    if (levelOfPlayDetail && levelOfPlayDetail.data && Array.isArray(levelOfPlayDetail.data)) {
      levels = levelOfPlayDetail.data
        .map((i) => {
          if (i.name) return _.capitalize(i.name);

          return this.sportsService.getLevelOfPlayText(i);
        })
        .filter((i) => i);
    }

    return levels.length ? levels.join(", ") : "Not Specified";
  }

  getSeasonCountByRegistrationStatus(type: "open" | "playing" | "closed"): number {
    if (!this.league.leagueSeasons) return 0;

    interface LeagueStatusCount {
      open: number;
      playing: number;
      closed: number;
    }
    /*
    TODO
    const count = this.league.leagueSeasons.reduce<LeagueStatusCount>((h: any, i) => {
      if (i.seasonTiming === 'current') {
        h.playing++;
      } else if (i.seasonTiming === 'future' && i.registrationTiming !== 'close') {
        h.open++;
      } else {
        h.closed++;
      }

      return h;
    }, { open: 0, playing: 0, closed: 0 });
*/
    return 0; //count[type];
  }

  goToLeague() {
    if (this.type === ProgramTypeEnum.LEAGUE || this.type === ProgramTypeEnum.TOURNAMENT) {
      this.router.navigate([
        "/client/" + (this.tournament ? "tournaments" : "leagues") + "/view",
        this.league.id,
        "details",
      ]);
    } else if (this.type === ProgramTypeEnum.CAMP) {
      this.router.navigate(["/client/programs/camps/", this.league.id]);
    } else if (this.type === ProgramTypeEnum.CLINIC) {
      this.router.navigate(["/client/programs/clinics/", this.league.id]);
    } else if (this.type === ProgramTypeEnum.CLASS) {
      this.router.navigate(["/client/programs/classes/", this.league.id]);
    } else if (this.type === ProgramTypeEnum.LESSON) {
      this.router.navigate(["/client/programs/lessons/", this.league.id]);
    } else if (this.type === ProgramTypeEnum.CLUB_TEAM) {
      this.router.navigate(["/client/programs/clubs/", this.league.id]);
    }
  }
}
