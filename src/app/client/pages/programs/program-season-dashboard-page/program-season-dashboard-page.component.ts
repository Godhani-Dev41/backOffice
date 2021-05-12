import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import {
  GenderEnum,
  LevelOfPlayEnum,
  ProgramsService,
  RCProgram,
  RCProgramSeason,
} from "@app/shared/services/programs/programs.service";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { SportsEnum } from "@app/shared/services/utils/sports.service";
import { RCSeasonDivision, RCSeasonRound, RCSeasonTeam, RCStanding } from "@rcenter/core";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "../../../../../environments/environment";

interface RCDivisionVM extends RCSeasonDivision {
  currentRound?: RCSeasonRound;
  roundLoading?: boolean;
  standings?: RCStanding[];
}

@Component({
  selector: "rc-program-season-dashboard-page",
  templateUrl: "./program-season-dashboard-page.component.html",
  styleUrls: ["./program-season-dashboard-page.component.scss"],
})
export class ProgramSeasonDashboardPageComponent implements OnInit {
  private destroy$ = new Subject<true>();
  private seasonId: number;
  private currentProgramSubscribe;
  private getDataSubscription;
  private routerSubscribe$: Subscription;
  private seasonSubscribe$: Subscription;

  loading: boolean;
  program: RCProgram;
  season: RCProgramSeason;
  groups: RCSeasonTeam[];
  publishRostersConfirm: any;
  publishingProcessing: boolean;
  currentPage: string;

  publicSiteUrl: string;

  @ViewChild("sendInvitesConfirm", { static: true }) sendInvitesConfirm: any;

  constructor(
    public programsService: ProgramsService,
    public programsFormService: ProgramsFormService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private analytics: AnalyticsService,
    private activeRoute: ActivatedRoute,
  ) {
    this.groups = [];
  }

  ngOnInit() {
    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
      if (data) {
        this.program = data;

        if (this.program) {
          this.activate();
        }
      }
    });

    this.programsService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if (response) {
        this.season = response;
        this.publicSiteUrl =
          environment.CONSUMER_SITE_URL +
          "/activity/programs/" +
          (this.season.gender === GenderEnum.OTHER ? "coed" : GenderEnum[this.season.gender]) +
          this.getLevelOfPlayText(this.season.level) +
          "-" +
          SportsEnum[this.season.sport] +
          "/" +
          this.season.programId +
          "/season/" +
          this.season.name +
          "/" +
          this.season.id;
        this.publicSiteUrl = this.publicSiteUrl.replace(/ /g, "-").toLowerCase();
      }
    });

    const prgId = this.activeRoute.snapshot.params["programId"];
    const seasId = this.activeRoute.snapshot.params["seasonId"];
    if (seasId) this.seasonId = this.programsService.getSeasonId();

    this.programsService.init(prgId, seasId).then();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getLevelOfPlayText(ids: number[]): string {
    let tempString = "";
    for (let level of ids) {
      tempString = tempString + "-" + LevelOfPlayEnum[level];
    }
    return tempString;
  }

  activate() {
    this.loading = false;

    /*const getSeason$ = this.programsService.getSeasonById(this.seasonId).subscribe((season) => {
      this.season = season.data;
      this.programsService.setCurrentSeason(season.data);
      this.loading = false;
    });
    const getTeams$ = this.programsService.getSeasonTeams(this.program.id, this.seasonId, {
      flagPlayerUnassign: true,
      flagPlayerPaymentStatus: true,
    });

    this.season = null;
    this.groups = [];
    this.programsService.setCurrentSeason(null);
    this.programsService.setCurrentTeams(null);*/

    /*this.getDataSubscription = forkJoin([getSeason$, getTeams$]).subscribe(
      ([season, teams]) => {
        this.groups = teams.data as any;
        this.season = season.data as any;

        if (this.season && this.season.seasonDivisions) {
          this.season.seasonDivisions = this.season.seasonDivisions.map((i) => {
            if (this.groups) {
              i.seasonTeams = this.groups.filter((t) => t.divisionId === i.id);
            }

            return i;
          });
        }

        this.programsService.setCurrentSeason(this.season);
        this.programsService.setCurrentTeams(this.groups);

        this.analytics.trackEvent('season-page:view', {
          seasonId: this.season.id,
          seasonName: this.season.name,
        });

        this.loading = false;
      },
      () => {
        this.loading = false;
      },
    );*/
  }

  publishSeason() {
    if (!this.canPublishSeason) return;
    this.publishingProcessing = true;
    this.programsService
      .publishSeason(this.program.id, this.season.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.toastr.success("Season was succesfully published!");

          /*if (this.season.playoffType) {
            this.programsService
              .publishSeasonRoster(this.program.id, this.season.id)
              .subscribe(() => {
                this.programsService
                  .getSeasonById(this.season.id)
                  .subscribe((response) => {
                    this.publishingProcessing = false;
                    this.season = response.data;
                    this.programsService.setCurrentSeason(response.data);
                  });
              });
          } else {
            this.programsService
              .getSeasonById(this.program.id, this.season.id)
              .subscribe((response) => {
                this.publishingProcessing = false;
                this.season = response.data;
                this.programsService.setCurrentSeason(response.data);
              });
          }*/
        },
        () => {
          this.toastr.error("Error occurred while publishing");
        },
      );
  }

  get canPublishSeason() {
    return false;
    // return this.program.isPublished;
  }

  publishSchedule() {}

  publishRoster() {}

  sendInvites() {}
}
