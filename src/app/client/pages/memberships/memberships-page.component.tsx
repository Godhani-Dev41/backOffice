import React from "react";
import ReactDOM from "react-dom";
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { VenuesService } from "app/shared/services/venues/venues.service";
import { Memberships } from "app/react/pages/membership/Memberships";
import { RCOrganization } from "@rcenter/core";
import { AuthenticationService } from "app/shared/services/auth/authentication.service";
import { OrganizationsService } from "app/shared/services/organization/organizations.service";
import { SportsService } from "app/shared/services/utils/sports.service";

interface MembershipProps {
  sportsService: SportsService;
  venuesService: VenuesService;
  authService: AuthenticationService;
  organizationService: OrganizationsService;
}

@Component({
  selector: "rc-react-membership-page",
  template: `<div #reactRoot></div>`,
  encapsulation: ViewEncapsulation.Emulated,
})
export class MembershipPageComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild("reactRoot", { static: true }) containerRef: ElementRef;

  organization: RCOrganization;

  constructor(
    private sportsService: SportsService,
    private venuesService: VenuesService,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
  ) {
    this.organization = this.authService.currentOrganization.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render(this.organization, this.organizationService, this.venuesService, this.sportsService);
  }

  ngAfterViewInit() {
    this.render(this.organization, this.organizationService, this.venuesService, this.sportsService);
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render(organization, organizationService, venuesService, sportsService) {
    if (!this.containerRef) return;

    ReactDOM.render(
      React.createElement(Memberships, { organization, organizationService, venuesService, sportsService }),
      this.containerRef.nativeElement,
    );
  }
}
