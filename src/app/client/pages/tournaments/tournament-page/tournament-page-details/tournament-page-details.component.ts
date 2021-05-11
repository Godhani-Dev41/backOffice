import { Component, OnInit } from '@angular/core';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import { RCLeague } from '@rcenter/core';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';

@Component({
  selector: 'rc-tournament-page-details',
  templateUrl: './tournament-page-details.component.html',
  styleUrls: ['./tournament-page-details.component.scss']
})
export class TournamentPageDetailsComponent implements OnInit {
  tournament: RCLeague;
  constructor(
    private leagueService: LeaguesService
  ) { }

  ngOnInit() {
    this.leagueService.currentLeague$.subscribe((data) => {
      this.tournament = data;
    });
  }

}
