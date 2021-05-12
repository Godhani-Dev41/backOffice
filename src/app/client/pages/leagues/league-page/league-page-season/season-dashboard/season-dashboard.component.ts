import { map, takeUntil } from "rxjs/operators";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { MatchEditModalComponent } from "@app/shared/components/leagues/match-edit-modal/match-edit-modal.component";
import { MatchResultsModalComponent } from "@app/shared/components/leagues/match-results-modal/match-results-modal.component";
import { RCMatchSliderOnClickEvent } from "@app/shared/components/leagues/season-round-matches-slider/season-round-matches-slider.component";
import {
  RCLeague,
  RCLeagueSeason,
  RCSeasonRound,
  RCSeasonTeam,
  RCSeasonRoundMatch,
  EventStatus,
  RCSeasonDivision,
  RCStanding,
} from "@rcenter/core";
import { StandingsTableSmallComponent } from "@app/shared/components/leagues/standings-table-small/standings-table-small.component";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { Observable, Subject } from "rxjs";

interface RCDivisionVM extends RCSeasonDivision {
  currentRound?: RCSeasonRound;
  roundLoading?: boolean;
  standings?: RCStanding[];
}

@Component({
  selector: "rc-season-dashboard",
  templateUrl: "./season-dashboard.component.html",
  styleUrls: ["./season-dashboard.component.scss"],
})
export class SeasonDashboardComponent implements OnInit, OnDestroy {
  @ViewChild("standingsTable", { static: false }) standingsTable: StandingsTableSmallComponent;
  @ViewChild("matchEditModal", { static: true }) matchEditModal: MatchEditModalComponent;
  @ViewChild("matchResultsModal", { static: true }) matchResultsModal: MatchResultsModalComponent;
  league: RCLeague;
  season: RCLeagueSeason;
  divisions: RCDivisionVM[];
  loading: boolean;
  teams: RCSeasonTeam[];
  publishingProccessing: boolean;
  private destroy$ = new Subject<true>();
  constructor(
    private toastr: ToastrService,
    private analytics: AnalyticsService,
    private leaguesService: LeaguesService,
  ) {}

  ngOnInit() {
    this.leaguesService.currentLeague$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.league = data;
    });

    this.leaguesService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.season = data;

      if (this.season) {
        if (this.season.subSeasons) {
          this.season.subSeasons.forEach((playoff) => {
            playoff["isAssignTeamsVisible"] = this.isPlayOffTooltipVisible(playoff);
          });
        }

        this.divisions = this.season.seasonDivisions;

        this.divisions.forEach((division) => {
          if (!division.rounds || !division.rounds.length) return;

          this.getRound(division.rounds[0].id).subscribe((round) => {
            division.currentRound = round;
          });
        });

        this.getSeasonStandings();
      }
    });
  }

  getSeasonStandings() {
    this.leaguesService.getSeasonStandings(this.season.leagueId, this.season.id).subscribe((response) => {
      this.divisions.map((division) => {
        const foundStanding = response.data.find((s) => s.id === division.id);

        if (foundStanding) {
          division.standings = foundStanding.seasonTeams;
        }

        return division;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  fetchDivisionRound(division: RCDivisionVM, roundId: number) {
    division.roundLoading = true;

    this.getRound(roundId).subscribe(
      (response) => {
        division.roundLoading = false;
        division.currentRound = response;
      },
      () => {
        division.roundLoading = false;
      },
    );
  }

  matchUpdated(divisionId: number) {
    const foundDivision = this.getDivisionById(divisionId);

    if (foundDivision && foundDivision.currentRound) {
      this.fetchDivisionRound(foundDivision, foundDivision.currentRound.id);
    }
  }

  getDivisionById(id: number): RCDivisionVM {
    return this.divisions.find((i) => i.id === id);
  }

  getRound(id: number): Observable<RCSeasonRound> {
    return this.leaguesService.getSeasonRounds(this.league.id, this.season.id, id).pipe(
      map((response) => {
        const currentRound = response.data;

        if (currentRound && currentRound.matches) {
          currentRound.matches = currentRound.matches.filter((i) => {
            return i.status !== EventStatus.CANCELLED && i.status !== EventStatus.DELETED;
          });
        }

        return currentRound;
      }),
    );
  }

  removeMatch(data: { match: RCSeasonRoundMatch; divisionId: number }) {
    const foundDivision = this.getDivisionById(data.divisionId);

    if (foundDivision) {
      foundDivision.currentRound.matches = foundDivision.currentRound.matches.filter((i) => {
        return i.id !== data.match.id;
      });
    }
  }

  matchResultsUpdate(data: { match: RCSeasonRoundMatch; divisionId: number; roundId: number }) {
    this.getSeasonStandings();

    const foundDivision = this.getDivisionById(data.divisionId);
    if (foundDivision) {
      this.fetchDivisionRound(foundDivision, data.roundId);
    }
  }

  matchClicked(data: RCMatchSliderOnClickEvent, divisionId?: number) {
    if (
      data.isPast &&
      data.match &&
      data.match.match &&
      data.match.match.participants[0] &&
      data.match.match.participants[1]
    ) {
      this.matchResultsModal.showModal(data.match, divisionId, data.roundId);
    } else if (!data.isPast) {
      this.matchEditModal.showModal(data.roundId, data.match, divisionId);
    }
  }

  isPlayOffTooltipVisible(playoff: RCLeagueSeason): boolean {
    let visible = false;

    if (moment(this.season.endDate).isBefore(moment())) {
      if (playoff.rounds && playoff.rounds[0] && playoff.rounds[0].matches && playoff.rounds[0].matches.length) {
        playoff.rounds[0].matches.forEach((i) => {
          if (i.match && i.match.participants && i.match.participants.length) {
            visible =
              !i.match.participants[0].entity ||
              !i.match.participants[0].entity.id ||
              !i.match.participants[1].entity ||
              !i.match.participants[1].entity.id;
          } else {
            visible = true;
          }
        });
      }

      return visible;
    }
  }

  matchEditClick(data: { match: RCSeasonRoundMatch; divisionId: number; roundId: number }) {
    this.matchEditModal.showModal(data.roundId, data.match, data.divisionId);
  }
}
