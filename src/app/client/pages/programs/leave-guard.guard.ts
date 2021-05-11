import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { LeaguePageComponent } from '@app/client/pages/leagues/league-page/league-page.component';
import { LeaguesService } from '../../../shared/services/leagues/leagues.service';

@Injectable()
export class LeaveGuard implements CanDeactivate<LeaguePageComponent> {
  constructor(private leaguesService: LeaguesService) {

  }

  canDeactivate() {
    this.leaguesService.setCurrentLeague(null);
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    return true;
  }
}


@Injectable()
export class SeasonLeaveGuard implements CanDeactivate<LeaguePageComponent> {
  constructor(private leaguesService: LeaguesService) {

  }

  canDeactivate() {
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    return true;
  }
}
