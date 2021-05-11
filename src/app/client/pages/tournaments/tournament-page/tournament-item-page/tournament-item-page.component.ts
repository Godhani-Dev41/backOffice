import { forkJoin, Subscription } from "rxjs";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { TournamentService } from "@app/shared/services/tournament/tournament.service";
import {
  RCLeague,
  RCLeagueSeason,
  RCSeasonTeam,
  RCSeasonRosterStatusEnum,
  RCSeasonScheduleStatusEnum,
} from "@rcenter/core";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "rc-tournament-item-page",
  templateUrl: "./tournament-item-page.component.html",
  styleUrls: ["./tournament-item-page.component.scss"],
})
export class TournamentItemPageComponent implements OnInit, OnDestroy {
  loading: boolean;
  paramsSubscribe: Subscription;
  currentLeagueSubscribe: Subscription;
  getDataSubscription: Subscription;
  tournamentId: number;
  tournament: RCLeague;
  season: RCLeagueSeason;
  teams: RCSeasonTeam[];
  publishingProccessing: boolean;
  routerSubscribe$: Subscription;
  currentPage: string;
  RCSeasonRosterStatusEnum = RCSeasonRosterStatusEnum;
  RCSeasonScheduleStatusEnum = RCSeasonScheduleStatusEnum;
  @ViewChild("publishRostersConfirm") publishRostersConfirm: any;
  @ViewChild("publishRostersConfirmEmpty") publishRostersConfirmEmpty: any;
  @ViewChild("sendInvitesConfirm") sendInvitesConfirm: any;
  constructor(
    private tournamentService: TournamentService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private leaguesService: LeaguesService,
  ) {}

  ngOnDestroy(): void {
    this.routerSubscribe$.unsubscribe();
    this.paramsSubscribe.unsubscribe();
    this.currentLeagueSubscribe.unsubscribe();
  }

  ngOnInit() {
    this.routerSubscribe$ = this.router.events.subscribe((data) => {
      if (data instanceof NavigationEnd) {
        if (
          this.route.snapshot.children &&
          this.route.snapshot.children[0].url &&
          this.route.snapshot.children[0].url[0]
        ) {
          this.currentPage = this.route.snapshot.children[0].url[0].path;
        } else {
          this.currentPage = null;
        }
      }
    });

    this.paramsSubscribe = this.route.params.subscribe((data) => {
      this.tournamentId = data["itemId"];

      if (this.tournament) {
        this.activate();
      }
    });

    this.currentLeagueSubscribe = this.leaguesService.currentLeague$.subscribe((data) => {
      this.tournament = data;

      if (this.tournament) {
        this.activate();
      }
    });
  }

  activate() {
    this.loading = true;

    const getSeason$ = this.leaguesService.getSeasonById(this.tournament.id, this.tournamentId);
    const getTeams$ = this.leaguesService.getSeasonTeams(this.tournament.id, this.tournamentId);

    this.season = null;
    this.teams = [];
    this.leaguesService.setCurrentSeason(null);
    this.leaguesService.setCurrentTeams(null);

    this.getDataSubscription = forkJoin([getSeason$, getTeams$]).subscribe(
      ([season, teams]) => {
        this.teams = teams.data as any;
        this.season = season.data as any;

        this.leaguesService.setCurrentSeason(this.season);
        this.leaguesService.setCurrentTeams(this.teams);

        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );
  }

  publishSeason() {
    if (!this.canPublishSeason || this.publishingProccessing) return;

    this.publishingProccessing = true;
    this.leaguesService.publishSeason(this.tournament.id, this.season.id).subscribe(
      () => {
        this.toastr.success("Season was succesfully published!");

        this.leaguesService.getSeasonById(this.tournament.id, this.season.id).subscribe((response) => {
          this.publishingProccessing = false;
          this.season = response.data;

          this.leaguesService.setCurrentSeason(response.data);
        });
      },
      () => {
        this.toastr.error("Error occurred while publishing");
      },
    );
  }

  publishRoster() {
    if (!this.canPublishRoster || this.publishingProccessing) return;

    this.publishingProccessing = true;

    this.leaguesService.publishSeasonRoster(this.tournament.id, this.season.id).subscribe(
      () => {
        this.toastr.success("Roster was successfully published!");
        this.season.rosterStatus = RCSeasonRosterStatusEnum.PUBLISHED;
        this.publishingProccessing = false;
      },
      () => {
        this.publishingProccessing = false;
        this.toastr.error("Error occurred while publishing");
      },
    );
  }

  publishSchedule() {
    if (!this.canPublishSchedule || this.publishingProccessing) return;

    this.publishingProccessing = true;

    this.leaguesService.publishSeasonSchedule(this.tournament.id, this.season.id).subscribe(
      () => {
        this.publishingProccessing = false;
        this.toastr.success("Schedule was successfully published!");
        this.season.scheduleStatus = RCSeasonScheduleStatusEnum.PUBLISHED;

        if (this.canSendInvites) this.sendInvitesConfirm.showModal();
      },
      () => {
        this.publishingProccessing = false;
        this.toastr.error("Error occurred while publishing");
      },
    );
  }

  get canPublishSchedule() {
    return this.season.status !== 1 && this.season.rosterStatus === RCSeasonRosterStatusEnum.PUBLISHED;
  }

  get canPublishRoster() {
    return (
      this.season.rosterStatus === RCSeasonRosterStatusEnum.DRAFT &&
      this.season.status !== 1 &&
      this.tournament.isPublished
    );
  }

  get canPublishSeason() {
    return this.tournament.isPublished;
  }

  get canSendInvites() {
    return (
      this.tournament.isPublished &&
      this.season.rosterStatus === RCSeasonRosterStatusEnum.PUBLISHED &&
      this.season.scheduleStatus === RCSeasonScheduleStatusEnum.PUBLISHED
    );
  }

  sendInvites() {
    if (!this.canSendInvites) return;

    this.publishingProccessing = true;

    this.leaguesService.sendInvites(this.tournament.id, this.season.id).subscribe(
      () => {
        this.publishingProccessing = false;
        this.toastr.success("Invites succesfully sent");
        this.season.inviteSendDate = new Date();
      },
      () => {
        this.publishingProccessing = false;
        this.toastr.error("Error occurred while sending invites");
      },
    );
  }

  promptPublishRoster() {
    this.publishingProccessing = true;
    this.tournamentService.getTournamentEventById(this.season.leagueId, this.season.id).subscribe(
      (response) => {
        const season = response.data;

        let foundTBA;
        if (season && season.rounds && season.rounds.length) {
          season.rounds[0].matches.forEach((i) => {
            if (i.match && i.match.participants) {
              if (!i.match.participants.length) foundTBA = true;
              const found = i.match.participants.find((j) => !j.entity);

              if (found) foundTBA = true;
            }
          });
        }

        if (foundTBA) {
          this.publishRostersConfirmEmpty.showModal();
        } else {
          this.publishRostersConfirm.showModal();
        }

        this.publishingProccessing = false;
      },
      (err) => {
        this.publishingProccessing = false;
      },
    );
  }
}
