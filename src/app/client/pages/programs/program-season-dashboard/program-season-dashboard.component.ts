import { Component, OnInit, ViewChild } from "@angular/core";
import { StandingsTableSmallComponent } from "@app/shared/components/leagues/standings-table-small/standings-table-small.component";
import { MatchEditModalComponent } from "@app/shared/components/leagues/match-edit-modal/match-edit-modal.component";
import { MatchResultsModalComponent } from "@app/shared/components/leagues/match-results-modal/match-results-modal.component";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { EventStatus, RCLeagueSeason, RCSeasonRound, RCSeasonRoundMatch, RCSeasonTeam } from "@rcenter/core";
import { NzModalRef } from "ng-zorro-antd/modal";
import { NzModalService } from "ng-zorro-antd/modal";
import { ToastrService } from "ngx-toastr";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { map } from "rxjs/operators";
import { RCMatchSliderOnClickEvent } from "@app/shared/components/leagues/season-round-matches-slider/season-round-matches-slider.component";
import * as moment from "moment";
import { Observable, Subject } from "rxjs";
import { ProgramsService, RCProgram, RCProgramSeason } from "@app/shared/services/programs/programs.service";
import { Router } from "@angular/router";

@Component({
  selector: "rc-program-season-dashboard",
  templateUrl: "./program-season-dashboard.component.html",
  styleUrls: ["./program-season-dashboard.component.scss"],
})
export class ProgramSeasonDashboardComponent implements OnInit {
  @ViewChild("standingsTable") standingsTable: StandingsTableSmallComponent;
  @ViewChild("matchEditModal") matchEditModal: MatchEditModalComponent;
  @ViewChild("matchResultsModal") matchResultsModal: MatchResultsModalComponent;
  confirmModal: NzModalRef;
  program: RCProgram;
  season: RCProgramSeason;
  divisions: any[];
  loading: boolean = false;
  teams: RCSeasonTeam[];
  publishingProcessing: boolean;

  constructor(
    private toastr: ToastrService,
    private analytics: AnalyticsService,
    private programsService: ProgramsService,
    private programsFormService: ProgramsFormService,
    private router: Router,
    private modal: NzModalService,
  ) {}

  ngOnInit() {
    this.programsService.currentProgram$.subscribe((data) => {
      this.program = data;
    });

    this.programsService.currentSeason$.subscribe((data) => {
      this.season = data;

      if (this.season) {
        if (!this.season.products) {
          this.programsService.getProductsBySeason(this.season.id).subscribe((data) => {
            if (data && data.length > 0) {
              this.season.products = [...data];
              this.programsFormService.productsForm.patchValue({
                products: [...data],
              });
            }
          });
        }

        if (this.season.subSeasons) {
          /*this.season.subSeasons.forEach((playoff) => {
                playoff['isAssignTeamsVisible'] = this.isPlayOffTooltipVisible(playoff);
              });*/
        }
        // this.divisions = this.season.seasonDivisions;

        this.divisions = [];
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
    /*this.programsService
        .getSeasonStandings(this.season.leagueId, this.season.id)
        .subscribe((response) => {
          this.divisions.map((division) => {
            const foundStanding = response.data.find(s => s.id === division.id);

            if (foundStanding) {
              division.standings = foundStanding.seasonTeams;
            }

            return division;
          });
        });*/
  }

  ngOnDestroy(): void {
    // this.destroy$.next(true);
  }

  fetchDivisionRound(division: any, roundId: number) {
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

  getDivisionById(id: number): any {
    return this.divisions.find((i) => i.id === id);
  }

  getRound(id: number): Observable<RCSeasonRound> {
    return this.programsService.getSeasonRounds(this.program.id, this.season.id, id).pipe(
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

  navEditSeason = () => {
    this.router.navigate([
      "/client/programs/" +
        this.programsService.getProgramTypeParam() +
        "/" +
        this.programsService.getPrgId() +
        "/season/" +
        this.programsService.getSeasonId() +
        "/basic",
    ]);
    /*
    this.confirmModal = this.modal.confirm({
      nzTitle: "Do you want to edit this season?",
      nzContent:
        "If you edit this season, all product and space allocations will be removed and you must add them again.",
      nzOnOk: () =>
        this.router.navigate([
          "/client/programs/" +
            this.programsService.getProgramTypeParam() +
            "/" +
            this.programsService.getPrgId() +
            "/season/" +
            this.programsService.getSeasonId() +
            "/basic",
        ]),
    });
*/
  };
}
