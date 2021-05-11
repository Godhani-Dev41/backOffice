import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { LeaguesService, RCLeagueDetailVM } from '../../../services/leagues/leagues.service';
import { IRCLeagueDetail } from '@rcenter/core';

@Component({
  selector: 'rc-league-detail-stats',
  templateUrl: './league-detail-stats.component.html',
  styleUrls: ['./league-detail-stats.component.scss']
})
export class LeagueDetailStatsComponent implements OnInit, OnChanges {
  @Input() leagueDetails: IRCLeagueDetail[];
  leagueDetailsVM: RCLeagueDetailVM[];
  constructor(
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {

  }

  ngOnChanges(changes) {
    if (changes.leagueDetails && changes.leagueDetails.currentValue) {
      this.leagueDetailsVM = this.leaguesService.parseLeagueDetails(changes.leagueDetails.currentValue);
    }
  }
}
