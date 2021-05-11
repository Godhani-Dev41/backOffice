import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeaguesService, RCSeriesBulkUpdateObject } from '@app/shared/services/leagues/leagues.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RCLeagueSeason, RCSeasonRound, RCStanding } from '@rcenter/core';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

interface RCStandingVM extends RCStanding {
  selected?: boolean;
}

@Component({
  selector: 'rc-playoff-teams-assign-page',
  templateUrl: './playoff-teams-assign-page.component.html',
  styleUrls: ['./playoff-teams-assign-page.component.scss']
})
export class PlayoffTeamsAssignPageComponent implements OnInit {
  playoffAssignForm: FormGroup;
  season: RCLeagueSeason;
  standings: RCStandingVM[];
  rounds: RCSeasonRound[];
  teamCountNeeded: number;
  loading: boolean;
  pageLoading: boolean;
  constructor(
    private fb: FormBuilder,
    private leaguesService: LeaguesService,
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.playoffAssignForm = this.fb.group({
      selectedTeams: this.fb.array([])
    });
  }

  ngOnInit() {
    const seasonId = this.activatedRoute.snapshot.params['seasonId'];
    const leagueId = this.activatedRoute.snapshot.parent.params['id'];
    this.pageLoading = true;

    this.tournamentService.getTournamentEventById(leagueId, seasonId).subscribe((response) => {
      this.season = response.data;
      this.rounds = response.data.rounds;

      if (!this.rounds || !this.rounds.length) {
        this.toastr.error('No brackets yet created for this playoff. Please create empty brackets first.');
        return;
      }

      this.teamCountNeeded = _.flatten(this.rounds[0].series.map(i => i.matches)).length * 2;

      this.leaguesService.getSeasonStandings(leagueId, this.season.connectedSeasonId).subscribe((standingsRepsonse) => {
        this.standings = _.flatten(standingsRepsonse.data.map(i => i.seasonTeams)) as any;

        if (this.season.connectedDivisionId) {
          this.standings = this.standings.filter(i => i['divisionId'] === this.season.connectedDivisionId);
        }

        this.pageLoading = false;
        let selectTop = this.teamCountNeeded;

        if (this.season && this.season.metaData && this.season.metaData.playoff && this.season.metaData.playoff.teamsToChoose) {
          selectTop = this.season.metaData.playoff.teamsToChoose.amount;
        }

        this.standings.forEach((i, index) => {
          if (index < selectTop) {
            i.selected = true;
          }
        });
      }, () => {
        this.pageLoading = false;
        this.toastr.error('Error occurred while fetching standings');
      });
    }, () => {
      this.pageLoading = false;
      this.toastr.error('Error occurred while fetching playoff');
    });
  }

  assignSelectedTeams() {
    const selectedTeams = this.standings.filter((i) => {
      return i.selected;
    });

    if (!selectedTeams || selectedTeams.length !== this.teamCountNeeded) {
      this.toastr.warning(`You must select ${this.teamCountNeeded} teams for current brackets setup`);
      return;
    }

    const teamIds = selectedTeams.map(i => i.teamId);
    this.loading = true;

    this.leaguesService
      .bulkSeasonTeamAssign(this.season.leagueId, this.season.id, teamIds)
      .subscribe(() => {
        this.updateSeriesParticipants(selectedTeams);
      }, () => {
        this.loading = false;
        this.toastr.error('Error while assigning teams');
      });
  }

  updateSeriesParticipants(selectedTeams: RCStanding[]) {
    const seriesArray: RCSeriesBulkUpdateObject[] = [];

    // we want to randomize the order of the teams
    const teamsArray = _.shuffle(selectedTeams);

    this.rounds[0].series.forEach((series) => {
      const seriesObject: RCSeriesBulkUpdateObject = {
        id: series.id,
        seriesParticipants: [{
          entityType: 'team',
          entityId: teamsArray[0].teamId,
          name: teamsArray[0].team.name
        }, {
          entityType: 'team',
          entityId: teamsArray[1].teamId,
          name: teamsArray[1].team.name
        }]
      };

      seriesArray.push(seriesObject);

      if (teamsArray.length && teamsArray.length > 1) {

        // remove the first 2 selected teams;
        teamsArray.splice(0, 2);
      }
    });

    this.leaguesService.bulkBracketsAssignment(this.season.leagueId, this.season.id, seriesArray).subscribe((response) => {
      this.loading = false;
      this.toastr.success('Teams Successfully assigned!');
      this.router.navigate([
        '/client/tournaments/view/' + this.season.leagueId + '/item/' + this.season.id + '/brackets'
      ]);
    }, () => {
      this.toastr.error('Error occurred while assigning teams to the schedule');
    });
  }
}
