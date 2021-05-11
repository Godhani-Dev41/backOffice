import { Component, OnInit } from '@angular/core';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeague } from '@rcenter/core';

@Component({
  selector: 'rc-league-page-details',
  templateUrl: './league-page-details.component.html',
  styleUrls: ['./league-page-details.component.scss']
})
export class LeaguePageDetailsComponent implements OnInit {
  league: RCLeague;
  constructor(
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {
    this.leaguesService.currentLeague$.subscribe((data) => {
      this.league = data;
    });
  }

}
