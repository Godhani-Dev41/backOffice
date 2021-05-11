import { SportsEnum } from "@app/shared/services/utils/sports.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RCGenderEnum } from "@rcenter/core";
import {
  GenderEnum,
  LevelOfPlayEnum,
  ProgramsService,
  RCProgram,
  RCProgramSeason,
} from "@app/shared/services/programs/programs.service";
import { ActivatedRoute, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "rc-program-dashboard-page",
  templateUrl: "./program-dashboard-page.component.html",
  styleUrls: ["./program-dashboard-page.component.scss"],
})
export class ProgramDashboardPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  loading: boolean;
  seasons: RCProgramSeason[];
  filteredSeasons: RCProgramSeason[];
  program: RCProgram;
  RCGenderEnum = RCGenderEnum;
  levelsMap = {
    "1": {
      title: "BEGINNER",
      icon: "icon-rc-star-intermediate",
    },
    "2": {
      title: "INTERMEDIATE",
      icon: "icon-rc-star-medal",
    },
    "3": {
      title: "ADVANCED",
      icon: "icon-rc-star-advanced",
    },
    "4": {
      title: "SEMI-PRO",
      icon: "icon-rc-trophy",
    },
  };
  statusMap = {
    "1": "DRAFT",
    "2": "PUBLISHED",
    "3": "CLOSED",
    "4": "CANCELLED",
  };
  currentSeasonFilter: string = "all";
  publicSiteUrl: string;

  constructor(
    public programsService: ProgramsService,
    private router: Router,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.programsService.loadingProgram$.pipe(takeUntil(this.destroy$)).subscribe((l) => {
      this.loading = l;
    });

    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg) {
        this.program = prg;

        this.publicSiteUrl =
          environment.CONSUMER_SITE_URL +
          "/activity/programs/" +
          (this.program.gender === GenderEnum.OTHER ? "coed" : GenderEnum[this.program.gender]) +
          this.getLevelOfPlayText(this.program.level) +
          "-" +
          SportsEnum[this.program.sport] +
          "/" +
          this.program.id;
        this.publicSiteUrl = this.publicSiteUrl.replace(/ /g, "-").toLowerCase();

        this.programsService
          .getSeasonsByProgram(this.program.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe((s) => {
            this.seasons = s.data;
            this.filteredSeasons = this.seasons;
          });
      }
    });

    const prgId = this.activeRoute.snapshot.params["programId"];
    if (!this.programsService.getPrgId()) this.programsService.init(prgId).then();
    /*
    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((program) => {
      if (program && this.program !== program) {
        this.program = program;
        this.publicSiteUrl =
          environment.CONSUMER_SITE_URL +
          "/activity/programs/" +
          (this.program.gender === GenderEnum.OTHER ? "coed" : GenderEnum[this.program.gender]) +
          this.getLevelOfPlayText(this.program.level) +
          "-" +
          SportsEnum[this.program.sport] +
          "/" +
          this.program.id;
        this.publicSiteUrl = this.publicSiteUrl.replace(/ /g, "-").toLowerCase();

        this.programsService
          .getSeasonsByProgram(this.programsService.getPrgId())
          .pipe(takeUntil(this.destroy$))
          .subscribe((s) => {
            this.seasons = s.data;
            this.filteredSeasons = this.seasons;
          });
      }
    });*/
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  navToSeason = (seasonId: number) => {
    this.router.navigate([
      "/client/programs/" +
        this.programsService.getProgramTypeParam() +
        "/" +
        this.programsService.getPrgId() +
        "/season/" +
        seasonId,
    ]);
  };

  navToPrgEdit = (programId: number) => {
    this.router.navigate([
      "/client/programs/" +
        this.programsService.getProgramTypeParam() +
        "/" +
        this.programsService.getPrgId() +
        "/basic",
    ]);
  };

  navToCreateSeason = (seasonId: number) => {
    this.programsService.clearPrgSeasonValues();
    this.router.navigate([
      "/client/programs/" +
        this.programsService.getProgramTypeParam() +
        "/" +
        this.programsService.getPrgId() +
        "/season/basic",
    ]);
  };

  changeProgramStatus = (status: number) => {
    this.programsService.changePublishingStatusOfProgram(this.program.id, status).subscribe(
      () => {
        this.program.status = status;
        this.toastr.success("Program's status is changed");
      },
      () => {
        this.toastr.error("Error changing the status of the program");
      },
    );
  };

  filterSeason = () => {
    // this.loading = true;
    if (this.seasons && this.seasons.length) {
      switch (this.currentSeasonFilter) {
        case "future":
          this.filteredSeasons = this.seasons.filter((season) => new Date(season.startDate) > new Date());
          // this.loading = false;
          break;
        case "running":
          this.filteredSeasons = this.seasons.filter(
            (season) => new Date(season.startDate) < new Date() && new Date(season.endDate) > new Date(),
          );
          // this.loading = false;
          break;
        case "past":
          this.filteredSeasons = this.seasons.filter((season) => new Date(season.endDate) < new Date());
          // this.loading = false;
          break;
        default:
          this.filteredSeasons = this.seasons;
          // this.loading = false;
          break;
      }
    }
  };

  getLevelOfPlayText(ids: number[]): string {
    let tempString = "";
    for (let level of ids) {
      tempString = tempString + "-" + LevelOfPlayEnum[level];
    }
    return tempString;
  }
}
