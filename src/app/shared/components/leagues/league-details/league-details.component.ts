import { Component, Input, OnChanges } from '@angular/core';
import { LeaguesService, RCLeagueDetailVM } from '../../../services/leagues/leagues.service';
import { RCLeague } from '@rcenter/core';

@Component({
  selector: 'rc-league-details',
  templateUrl: './league-details.component.html',
  styleUrls: ['./league-details.component.scss']
})
export class LeagueDetailsComponent implements OnChanges {
  @Input() league: RCLeague;
  @Input() tournament: boolean;
  leagueDetails: RCLeagueDetailVM[];
  images: string[];

  constructor(
    private leaguesService: LeaguesService
  ) {

  }

  ngOnChanges(changes: any) {
    if (changes.league && this.league) {
      this.leagueDetails = this.leaguesService.parseLeagueDetails(this.league.leagueDetails);
    }
  }
}
