import { Component, OnInit, ViewChild } from "@angular/core";
import { RCOrganization, RCUser } from '@rcenter/core';
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { CustomerEditModalComponent } from "@app/client/pages/customers/customers-page/customer-edit-modal/customer-edit-modal.component";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { ProgramsService } from "@app/shared/services/programs/programs.service";

@Component({
  selector: "rc-program-participant-list",
  templateUrl: "./program-participant-list.component.html",
  styleUrls: ["./program-participant-list.component.scss"],
})
export class ProgramParticipantListComponent implements OnInit {
  @ViewChild("customerEditModal", { static: true }) customerEditModal: CustomerEditModalComponent;

  organization: RCOrganization;
  loading = false;
  customers: RCUser[];
  customersTemp: RCUser[] = [];
  nameFilter: string = "";
  custTypeFilter: string = "all";

  constructor(
    private customersService: CustomersService,
    private authService: AuthenticationService,
    private programsService: ProgramsService
  ) {
    this.loading = true;
    this.authService.currentOrganization.subscribe((response) => {
      this.organization = response;

      if (response) {
        this.loadCustomers();
      }
    });
  }

  ngOnInit() {}

  loadCustomers() {
    this.loading = true;

    this.programsService.getParticipantsFromSeason(this.programsService.getSeasonId()).subscribe((usersResponse) => {
      this.customers = usersResponse.data;
      this.customersTemp = usersResponse.data;
      this.loading = false;
    })
/*
    this.customersService
      .getCustomers(this.organization.id)
      .subscribe((customersResponse) => {
        this.customers = customersResponse.data;
        this.customersTemp = customersResponse.data;
        this.loading = false;
      });*/
  }

  editCustomer(customer) {
    this.customerEditModal.showModal(customer);
  }

  /*changeNameFilter(event) {
    this.nameFilter = event.target.value.trim().toLowerCase();
    this.applyFilters();
  }

  typeFilter(type: string) {
    this.custTypeFilter = type;
    this.applyFilters();
  }

  applyNameFilter() {
    this.customers = this.customers.filter((c) => {
      return (
        this.nameFilter === "" ||
        (c.name && c.name.toLowerCase().indexOf(this.nameFilter) !== -1) ||
        (c.firstName &&
          c.firstName.toLowerCase().indexOf(this.nameFilter) !== -1) ||
        (c.lastName && c.lastName.toLowerCase().indexOf(this.nameFilter) !== -1)
      );
    });
  }

  applyTypeFilter() {
    this.customers = this.customers.filter((c) => {
      return (
        this.custTypeFilter === "all" ||
        (c.entityType && c.entityType === this.custTypeFilter) ||
        (!c.entityType && this.custTypeFilter === "user")
      );
    });
  }

  applyFilters() {
    this.customers = this.customersTemp;
    this.applyTypeFilter();
    this.applyNameFilter();
  }*/
}
