
import {forkJoin,  Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import {
  RCLeagueSeason, RCLeague, RCSeasonTeam, RCSeasonRosterStatusEnum, RCSeasonScheduleStatusEnum,
  RCLeagueSeasonStatusEnum
} from '@rcenter/core';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';

@Component({
  selector: 'rc-league-page-season',
  templateUrl: 'league-page-season.component.html',
  styleUrls: ['league-page-season.component.scss']
})
export class LeaguePageSeasonComponent implements OnInit, OnDestroy {
  loading: boolean;
  league: RCLeague;
  season: RCLeagueSeason;
  teams: RCSeasonTeam[];
  publishRostersConfirm: any;
  private seasonId: number;
  private currentLeagueSubscribe;
  private getDataSubscription;
  private paramsSubscribe;
  private routerSubscribe$: Subscription;
  private seasonSubscribe$: Subscription;
  publishingProccessing: boolean;
  currentPage: string;
  RCSeasonRosterStatusEnum = RCSeasonRosterStatusEnum;
  RCSeasonScheduleStatusEnum = RCSeasonScheduleStatusEnum;
  @ViewChild('sendInvitesConfirm', { static: true }) sendInvitesConfirm: any;
  constructor(
    private leaguesService: LeaguesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private analytics: AnalyticsService
  ) {
    this.teams = [];
  }

  ngOnInit() {
    this.routerSubscribe$ = this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        if (this.route.snapshot.children && this.route.snapshot.children[0].url && this.route.snapshot.children[0].url[0]) {
          this.currentPage = this.route.snapshot.children[0].url[0].path;
        } else {
          this.currentPage = null;
        }
      }
    });

    this.seasonSubscribe$ = this.leaguesService.currentSeason$.subscribe((response) => {
      this.season = response;
    });

    this.paramsSubscribe = this.route.params.subscribe((data) => {
      this.seasonId = data['seasonId'];

      if (this.league) {
        this.activate();
      }
    });

    this.currentLeagueSubscribe = this.leaguesService.currentLeague$.subscribe((data) => {
      this.league = data;

      if (this.league) {
        this.activate();
      }
    });
  }

  ngOnDestroy(): void {
    this.seasonSubscribe$.unsubscribe();
    this.currentLeagueSubscribe.unsubscribe();
    this.paramsSubscribe.unsubscribe();
    this.routerSubscribe$.unsubscribe();
    if (this.getDataSubscription) this.getDataSubscription.unsubscribe();
  }

  activate() {
    this.loading = true;

    const getSeason$ = this.leaguesService.getSeasonById(this.league.id, this.seasonId);
    const getTeams$ = this.leaguesService.getSeasonTeams(this.league.id, this.seasonId, {
      flagPlayerUnassign: true,
      flagPlayerPaymentStatus: true
    });

    this.season = null;
    this.teams = [];
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    this.getDataSubscription = forkJoin([
      getSeason$,
      getTeams$
    ]).subscribe(([season, teams]) => {
      this.teams = teams.data as any;
      this.season = season.data as any;

      if (this.season && this.season.seasonDivisions) {
        this.season.seasonDivisions = this.season.seasonDivisions.map((i) => {
          if (this.teams) {
            i.seasonTeams = this.teams.filter((t) => t.divisionId === i.id);
          }

          return i;
        });
      }

      this.leaguesService.setCurrentSeason(this.season);
      this.leaguesService.setCurrentTeams(this.teams);

      this.analytics.trackEvent('season-page:view', {
        seasonId: this.season.id,
        seasonName: this.season.name
      });

      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  publishSeason() {
    if (!this.canPublishSeason) return;
    this.publishingProccessing = true;
    this.leaguesService.publishSeason(this.league.id, this.season.id).subscribe(() => {
      this.toastr.success('Season was succesfully published!');

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
    }, () => {
      this.toastr.error('Error occurred while publishing');
    });
  }


  publishRoster() {
    if (!this.canPublishRoster) return;

    this.publishingProccessing = true;
    this.leaguesService.publishSeasonRoster(this.league.id, this.season.id).subscribe(() => {
      this.toastr.success('Roster was successfully published!');
      this.season.rosterStatus = RCSeasonRosterStatusEnum.PUBLISHED;
      this.publishingProccessing = false;
    }, () => {
      this.publishingProccessing = false;
      this.toastr.error('Error occurred while publishing');
    });
  }


  publishSchedule() {
    if (!this.canPublishSchedule) return;

    this.publishingProccessing = true;

    this.leaguesService.publishSeasonSchedule(this.league.id, this.season.id).subscribe(() => {
      this.publishingProccessing = false;
      this.toastr.success('Schedule was successfully published!');
      this.season.scheduleStatus = RCSeasonScheduleStatusEnum.PUBLISHED;

      if (this.canSendInvites) this.sendInvitesConfirm.showModal();
    }, () => {
      this.publishingProccessing = false;
      this.toastr.error('Error occurred while publishing');
    });
  }

  sendInvites() {
    if (!this.canSendInvites) return;

    this.publishingProccessing = true;

    this.leaguesService.sendInvites(this.league.id, this.season.id).subscribe(() => {
      this.publishingProccessing = false;
      this.toastr.success('Invites succesfully sent');
      this.season.inviteSendDate = new Date();
    }, () => {
      this.publishingProccessing = false;
      this.toastr.error('Error occurred while sending invites');
    });
  }

  get canPublishSchedule() {
    return (this.season.status !== 1 && this.season.rosterStatus === RCSeasonRosterStatusEnum.PUBLISHED);
  }

  get canPublishRoster() {
    return (this.season.rosterStatus === RCSeasonRosterStatusEnum.DRAFT && this.season.status !== 1 && this.league.isPublished);
  }

  get canPublishSeason() {
    return this.league.isPublished;
  }

  get canSendInvites() {
    return (
      this.league.isPublished &&
      this.season.rosterStatus === RCSeasonRosterStatusEnum.PUBLISHED &&
      this.season.scheduleStatus === RCSeasonScheduleStatusEnum.PUBLISHED
    );
  }
}
