import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '@app/shared/services/customers/customers.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';

@Component({
  selector: 'rc-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['./customer-page.component.scss']
})
export class CustomerPageComponent implements OnInit {
  customer: any;
  loading = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private customersService: CustomersService,
    private authService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    const organization = this.authService.currentOrganization.getValue();
    const customerId = this.activeRoute.snapshot.params['customerId'];

    this.customersService.getCustomerById(organization.id, customerId).subscribe((response) => {
      this.customer = response.data;

      this.customersService.currentCustomer$.next(this.customer);
      this.loading = false;
    });
  }
}
