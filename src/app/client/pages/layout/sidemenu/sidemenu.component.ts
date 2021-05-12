import { ProgramTypeEnum } from "./../../../../shared/services/programs/programs.service";
import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { takeUntil } from "rxjs/operators";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { RCOrganization, RCLeague, RCLeagueSeason, RCVenue } from "@rcenter/core";
import { Subject } from "rxjs/Subject";
import { Router } from "@angular/router";
import { TooltipModule } from "ngx-bootstrap";
import { TranslationEn } from "assets/i18n/en";

@Component({
  selector: "rc-sidemenu",
  templateUrl: "sidemenu.component.html",
  styleUrls: ["sidemenu.component.scss"],
})
export class SidemenuComponent implements OnInit, OnDestroy {
  @ViewChild("rc-tooltip", { static: false }) modal: TooltipModule;
  organization: RCOrganization;
  currentLeague: RCLeague;
  currentSeason: RCLeagueSeason;
  currentVenue: RCVenue;
  organizationAddress: string;
  userOrganizations: RCOrganization[];
  private destroy$ = new Subject<true>();
  activitiesVisible = false;
  platformUser = false;
  tooltipMsg: string = TranslationEn.tooltips.notPlatformUser;
  existingProgramsTypes: any;

  constructor(
    private router: Router,
    private venueService: VenuesService,
    private authService: AuthenticationService,
    private leaguesService: LeaguesService,
    private programsService: ProgramsService,
  ) {
    this.organizationAddress = "";
  }

  private initActivitiesTypes() {
    this.existingProgramsTypes = {};
    this.existingProgramsTypes[ProgramTypeEnum.LEAGUE] = false;
    this.existingProgramsTypes[ProgramTypeEnum.CAMP] = false;
    this.existingProgramsTypes[ProgramTypeEnum.CLASS] = false;
    this.existingProgramsTypes[ProgramTypeEnum.CLINIC] = false;
    this.existingProgramsTypes[ProgramTypeEnum.TOURNAMENT] = false;
    this.existingProgramsTypes[ProgramTypeEnum.LESSON] = false;
    this.existingProgramsTypes[ProgramTypeEnum.CLUB_TEAM] = false;
  }

  public get programTypeEnum(): typeof ProgramTypeEnum {
    return ProgramTypeEnum;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.authService.userOrganizations.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.userOrganizations = response;
    });

    this.venueService.currentVenue.subscribe((response) => {
      this.currentVenue = response;
    });

    this.authService.currentOrganization.pipe(takeUntil(this.destroy$)).subscribe((organization) => {
      this.organization = organization;
      // Check if this organization is a platforrm user. If there is {} as paymentSettings
      if (this.organization.paymentSettings && this.organization.paymentSettings.paymentSettingStatus)
        this.platformUser = true;

      if (this.organization && this.organization.address && this.organization.address.city) {
        this.organizationAddress = this.organization.address.city;

        if (this.organization.address.state) {
          this.organizationAddress = this.organization.address.city + "," + this.organization.address.state;
        }
      }

      // Get types of programs already created for this org. We only show the program types in the menu if they exist.
      this.handleProgramTypes();
    });

    this.leaguesService.currentLeague$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.currentLeague = response;
    });

    this.leaguesService.currentSeason$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if (response) {
        if ((this.currentSeason && this.currentSeason.id) !== response.connectedSeasonId) {
          this.currentSeason = response;
        }
      }
    });
  }

  handleProgramTypes() {
    this.programsService.getProgramTypesInUse(this.organization.id).subscribe((programTypes) => {
      this.initActivitiesTypes();
      programTypes.data.forEach((typeId: number) => {
        this.existingProgramsTypes[typeId] = true;
      });
    });
  }

  membershipClicked() {
    // force membership click to move back to the default (/#select) route
    setTimeout(function () {
      window.location.hash = "#/";
    }, 100);
  }

  logout() {
    this.authService.logout();
  }

  selectOrganization(organization: RCOrganization) {
    this.authService.currentOrganization.next(organization);

    setTimeout(() => {
      this.router.navigate(["/client/activities"]);
      window.location.reload();
    }, 500);
  }
}
