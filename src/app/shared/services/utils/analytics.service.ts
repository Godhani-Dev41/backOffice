///<reference path="../../../../../node_modules/@types/mixpanel/index.d.ts"/>
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCOrganization, RCLeague } from '@rcenter/core';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
@Injectable()
export class AnalyticsService {
  private mixpanel = mixpanel;
  private organization: RCOrganization;
  private league: RCLeague;
  constructor(
    private authService: AuthenticationService,
    private leaguesService: LeaguesService
  ) {
    this.leaguesService.currentLeague$.subscribe((response) => {
      this.league = response;
    });

    this.authService.currentOrganization.subscribe((organization) => {
      this.organization = organization;
    });
  }

  trackEvent(name: string, data: any = {}) {
    if (!environment.production || !mixpanel) return;
    if (this.organization) {
      data = Object.assign(data, {
        organization: this.organization.id,
        organizationName: this.organization.name
      });
    }

    if (this.league) {
      data = Object.assign(data, {
        leagueId: this.league.id,
        leagueName: this.league.name
      });
    }

    this.mixpanel.track(name, data);
  }
}
