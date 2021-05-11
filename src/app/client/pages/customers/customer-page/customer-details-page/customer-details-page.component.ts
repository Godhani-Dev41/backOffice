import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { RCOrganization } from "@rcenter/core";

@Component({
  selector: "rc-customer-details-page",
  templateUrl: "./customer-details-page.component.html",
  styleUrls: ["./customer-details-page.component.scss"],
})
export class CustomerDetailsPageComponent implements OnInit {
  loading = false;
  organization: RCOrganization;
  customer: any;
  customerForm: FormGroup;
  constructor(
    private customersService: CustomersService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder,
  ) {
    this.customerForm = this.fb.group({
      name: ["", Validators.required],
      email: "",
      phoneNumber: "",
      city: "",
      street: "",
      state: "",
      zip: "",
      vetted: false,
    });
  }

  ngOnInit() {
    this.loading = true;
    this.customerForm.reset();
    this.organization = this.authService.currentOrganization.getValue();

    this.customersService.currentCustomer$.subscribe((customersResponse) => {
      if (!customersResponse) return;
      this.customer = customersResponse;
      const { name, address, phoneNumber, email, vetted } = this.customer;

      this.customerForm.patchValue({
        name,
        phoneNumber,
        email,
        vetted,
      });

      if (address) {
        this.customerForm.patchValue({
          street: address.street,
          zip: address.zip,
          state: address.state,
          city: address.city,
        });
      }

      this.loading = false;
    });
  }

  onSubmit(data) {
    const customer = {
      vetted: data.vetted,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
    };

    this.loading = true;
    this.customersService.updateCustomer(this.organization.id, this.customer.id, customer).subscribe(
      () => {
        this.loading = false;
      },
      () => {
        this.loading = false;
        alert("Error occurred while updating");
      },
    );
  }
}
