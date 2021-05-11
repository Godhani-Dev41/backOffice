import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LeaguesService } from "../../../../shared/services/leagues/leagues.service";
import { RCLeague, RCLeagueSeason } from "@rcenter/core";
import { environment } from "../../../../../environments/environment";
import { Subscription } from "rxjs";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";

@Component({
  selector: "rc-league-page",
  templateUrl: "./league-page.component.html",
  styleUrls: ["./league-page.component.scss"],
})
export class LeaguePageComponent implements OnInit, OnDestroy {
  private leagueId: number;
  private paramsSubscribe;
  private getLeagueSubscription: Subscription;
  league: RCLeague;
  publishingProccessing: boolean;
  season: RCLeagueSeason;
  seasonSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private vRef: ViewContainerRef,
    private leaguesService: LeaguesService,
    private analytics: AnalyticsService,
  ) {}

  ngOnInit() {
    this.paramsSubscribe = this.route.params.subscribe((data) => {
      this.leagueId = data["id"];
      this.activate();
    });
  }

  ngOnDestroy() {
    this.paramsSubscribe.unsubscribe();
    if (this.getLeagueSubscription) this.getLeagueSubscription.unsubscribe();
    if (this.seasonSubscription) this.seasonSubscription.unsubscribe();
  }

  activate() {
    this.league = null;
    this.leaguesService.setCurrentLeague(null);
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    this.getLeagueSubscription = this.leaguesService.getLeagueById(this.leagueId).subscribe((response) => {
      this.league = response.data;
      this.leaguesService.setCurrentLeague(this.league);

      setTimeout(() => {
        this.analytics.trackEvent("league-page:open");
      }, 1000);
    });

    this.seasonSubscription = this.leaguesService.currentSeason$.subscribe((response) => {
      this.season = response;
    });
  }

  publishLeague() {
    this.publishingProccessing = true;

    this.leaguesService.publishLeague(this.leagueId).subscribe(
      (response) => {
        this.publishingProccessing = false;
        this.league.isPublished = true;

        this.leaguesService.setCurrentLeague(this.league);

        setTimeout(() => {
          this.analytics.trackEvent("league:publish");
        }, 1000);
      },
      () => {
        this.publishingProccessing = false;
        this.toastr.error("Error publishing league");
      },
    );
  }

  getLeagueUrl() {
    if (this.league) {
      // return environment.MOBILE_LEAGUE_URL + this.league.id;

      if (this.season) {
        return (
          environment.CONSUMER_SITE_URL +
          "/activity/leagues/" +
          this.league.name.replace(/ /g, "-").toLowerCase() +
          "/" +
          this.league.id +
          "/season/" +
          this.season.id
        );
      } else {
        return (
          environment.CONSUMER_SITE_URL +
          "/activity/leagues/" +
          this.league.name.replace(/ /g, "-").toLowerCase() +
          "/" +
          this.league.id
        );
      }
    } else {
      return "";
    }
  }

  publishSeason() {
    this.publishingProccessing = true;
    this.leaguesService.publishSeason(this.league.id, this.season.id).subscribe(
      () => {
        this.toastr.success("Season was succesfully published!");

        this.analytics.trackEvent("season:publish", {
          seasonId: this.season.id,
          seasonName: this.season.name,
        });

        if (this.season.playoffType) {
          this.leaguesService.publishSeasonRoster(this.league.id, this.season.id).subscribe(() => {
            this.leaguesService.getSeasonById(this.league.id, this.season.id).subscribe((response) => {
              this.publishingProccessing = false;
              this.season = response.data;
              this.leaguesService.setCurrentSeason(response.data);
            });
          });
        } else {
          this.leaguesService.getSeasonById(this.league.id, this.season.id).subscribe((response) => {
            this.publishingProccessing = false;
            this.season = response.data;
            this.leaguesService.setCurrentSeason(response.data);
          });
        }
      },
      () => {
        this.toastr.error("Error occurred while publishing");
      },
    );
  }
}
