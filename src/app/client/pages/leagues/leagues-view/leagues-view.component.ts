import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeaguesService } from '../../../../shared/services/leagues/leagues.service';
import { RCLeague } from '@rcenter/core';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';

@Component({
  selector: 'rc-leagues-view',
  templateUrl: './leagues-view.component.html',
  styleUrls: ['./leagues-view.component.scss']
})
export class LeaguesViewComponent implements OnInit, OnDestroy {
  leagues: RCLeague[];
  private leaguesSubscription;
  loading: boolean;
  constructor(
    private leaguesService: LeaguesService,
    private analytics: AnalyticsService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.analytics.trackEvent('leagues-page:open');

    this.leaguesSubscription = this.leaguesService.getLeagues().subscribe((response) => {
      this.loading = false;

      this.leagues = response.data;
    }, () => {
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.leaguesSubscription.unsubscribe();
  }
}
