import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeague, RCLeagueBookingStateEnum } from '@rcenter/core';

@Component({
  selector: 'rc-tournaments-view',
  templateUrl: './tournaments-view.component.html',
  styleUrls: ['./tournaments-view.component.scss']
})
export class TournamentsViewComponent implements OnInit {

  leaguesSubscription: Subscription;
  loading: boolean;
  leagues: RCLeague[];
  constructor(
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
    this.loading = true;

    this.leaguesSubscription = this.leaguesService.getLeagues({tournamentsOnly: true}).subscribe((response) => {
      this.loading = false;

      this.leagues = response.data;
    }, () => {
      this.loading = false;
    });
  }

}
