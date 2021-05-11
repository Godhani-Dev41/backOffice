
import {takeUntil} from 'rxjs/operators';
import { Component, Input, OnInit } from "@angular/core";
import { RCVenue, RCOrganization } from "@rcenter/core";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { Subject } from "rxjs";

@Component({
  selector: "rc-venue-card",
  templateUrl: "./venue-card.component.html",
  styleUrls: ["./venue-card.component.scss"],
})
export class VenueCardComponent implements OnInit {
  @Input() venue: any;
  private destroy$ = new Subject<true>();
  organization: RCOrganization;
  platformUser: boolean = true;

  constructor(
    private sportsService: SportsService,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.auth.currentOrganization.pipe(
      takeUntil(this.destroy$))
      .subscribe((organization) => {
        this.organization = organization;
        // Check if this organization is a platforrm user. If there is {} as paymentSettings
        if (!this.organization.paymentSettings || (this.organization.paymentSettings && !this.organization.paymentSettings.paymentSettingStatus))
          this.platformUser = false;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getSportIcon(sports: number[]): string {
    if (!sports) sports = [];

    return this.sportsService.getSportsIcon(sports, true);
  }
}
