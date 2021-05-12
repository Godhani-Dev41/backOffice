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
import { CustomersService } from "app/shared/services/customers/customers.service";
import { Customers } from "app/react/pages/customers";
import { RCOrganization } from "@rcenter/core";
import { AuthenticationService } from "app/shared/services/auth/authentication.service";
import { OrganizationsService } from "app/shared/services/organization/organizations.service";
import { SportsService } from "app/shared/services/utils/sports.service";

interface CustomersProps {
  sportsService: SportsService;
  customersService: CustomersService;
  authService: AuthenticationService;
  organizationService: OrganizationsService;
}

@Component({
  selector: "rc-react-customers-page",
  template: `<div style="height:100%" #reactRoot></div>`,
  encapsulation: ViewEncapsulation.Emulated,
})
export class CustomersNewPageComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild("reactRoot", { static: true }) containerRef: ElementRef;

  organization: RCOrganization;

  constructor(
    private sportsService: SportsService,
    private customersService: CustomersService,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
  ) {
    this.organization = this.authService.currentOrganization.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render(this.organization, this.organizationService, this.customersService, this.sportsService);
  }

  ngAfterViewInit() {
    this.render(this.organization, this.organizationService, this.customersService, this.sportsService);
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render(organization, organizationService, customersService, sportsService) {
    if (!this.containerRef) return;

    ReactDOM.render(
      React.createElement(Customers, { organization, organizationService, customersService, sportsService }),
      this.containerRef.nativeElement,
    );
  }
}
