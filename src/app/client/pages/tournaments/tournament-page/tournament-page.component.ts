import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { RCLeague, RCLeagueSeason } from '@rcenter/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'rc-tournament-page',
  templateUrl: './tournament-page.component.html',
  styleUrls: ['./tournament-page.component.scss']
})
export class TournamentPageComponent implements OnInit, OnDestroy {
  private tournamentId: number;
  private currentSeasonSubscription: Subscription;
  tournament: RCLeague;
  currentSeason: RCLeagueSeason;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private vRef: ViewContainerRef,
    private tournamentsService: TournamentService,
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {
    this.tournamentId = this.route.snapshot.params.tournamentId;
    this.activate();
  }

  activate() {
    this.tournament = null;
    this.leaguesService.setCurrentLeague(null);
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    this.tournamentsService.getTournamentById(this.tournamentId).subscribe((response) => {
      this.tournament = response.data;
      this.leaguesService.setCurrentLeague(this.tournament);
    });

    this.currentSeasonSubscription = this.leaguesService.currentSeason$.subscribe((response) => {
      this.currentSeason = response;
    });
  }

  ngOnDestroy() {
    this.currentSeasonSubscription.unsubscribe();
  }
}
