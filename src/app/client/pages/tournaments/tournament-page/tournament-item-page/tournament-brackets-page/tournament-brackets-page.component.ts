
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import { LeaguesService, RCStandingFetchResult } from '@app/shared/services/leagues/leagues.service';
import { RCLeagueSeason, RCSeasonRound, RCSeasonTeam, RCTeam } from '@rcenter/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rc-tournament-brackets-page',
  templateUrl: './tournament-brackets-page.component.html',
  styleUrls: ['./tournament-brackets-page.component.scss']
})
export class TournamentBracketsPageComponent implements OnInit, OnDestroy {
  season: RCLeagueSeason;
  switchTeams: RCSeasonTeam[];
  rounds: RCSeasonRound[];
  parentSeasonTeams: RCSeasonTeam[];
  loading = false;
  saveLoading = false;
  destroy$ = new Subject<true>();
  parentSeasonDivisions: RCStandingFetchResult[];
  bracketsChanged = false;
  teamBracketAssignments: any[];
  constructor(
    private toastr: ToastrService,
    private tournamentService: TournamentService,
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {
    this.leaguesService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((season) => {
      this.season = season;

      if (season) {
        this.getTournamentEvent();
      }
    });

    this.leaguesService.currentTeams$.pipe(takeUntil(this.destroy$)).subscribe((teams) => {
      this.switchTeams = teams;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getTournamentEvent() {
    this.loading = true;

    this.tournamentService.getTournamentEventById(this.season.leagueId, this.season.id).subscribe((response) => {
      this.rounds = response.data.rounds;

      this.getSeasonTeams();
    }, () => {
      this.loading = false;
    });
  }

  private getSeasonTeams() {
    let id, leagueId;
    if (this.season.parentSeason) {
     id = this.season.parentSeason.id;
     leagueId =  this.season.parentSeason.leagueId;
    } else {
      id = this.season.id;
      leagueId = this.season.leagueId;
    }

    this.leaguesService.getSeasonStandings(leagueId, id).subscribe((response) => {
      this.parentSeasonDivisions = response.data;

      this.loading = false;
      if (this.season && this.season.connectedDivisionId) {
        this.parentSeasonDivisions = this.parentSeasonDivisions.filter(i => i.id === this.season.connectedDivisionId);
      }
    });
  }

  removeSchedule() {
    this.loading = true;

    this.tournamentService
      .removeSchedule(this.season.leagueId, this.season.id, this.season.tournament.id)
      .subscribe(() => {
        this.getTournamentEvent();
      }, () => {
        this.loading = false;
      });
  }

  bracketsAssignmentChanged(assignments) {
    this.teamBracketAssignments = assignments;
    this.bracketsChanged = true;
  }

  submitBracketsChanges() {
    this.saveLoading = true;

    this.leaguesService
      .bulkBracketsAssignment(this.season.leagueId, this.season.id, this.teamBracketAssignments)
      .subscribe((response) => {
        this.saveLoading = false;
        this.toastr.success('Changes saved');
        this.bracketsChanged = false;
        this.getTournamentEvent();
      }, () => {
        this.saveLoading = false;
        this.toastr.error('Error while saving changes');
        this.bracketsChanged = false;
      });
  }
}
