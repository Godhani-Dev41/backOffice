import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { CustomersService } from '@app/shared/services/customers/customers.service';
import { RCOrganization } from '@rcenter/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'rc-customer-edit-modal',
  templateUrl: './customer-edit-modal.component.html',
  styleUrls: ['./customer-edit-modal.component.scss'],
  exportAs: 'modal'
})
export class CustomerEditModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) modal: ModalDirective;
  customerForm: FormGroup;
  loading = false;
  organization: RCOrganization;
  customer: any;
  reservations: any[];
  @Output() onUpdated = new EventEmitter();
  constructor(
    private customerService: CustomersService,
    private fb: FormBuilder,
    private authService: AuthenticationService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: '',
      phoneNumber: '',
      city: '',
      street: '',
      state: '',
      zip: ''
    });
  }

  ngOnInit() {
    this.authService.currentOrganization.subscribe((organization) => {
      this.organization = organization;
    });
  }

  cancel() {
    this.modal.hide();
  }

  showModal(customer: any) {
    this.reservations = [];
    this.customerForm.reset();
    this.modal.show();
    this.customer = customer;
    const { name, address, phoneNumber, email } = customer;

    this.customerForm.patchValue({
      name,
      phoneNumber,
      email
    });

    if (address) {
      this.customerForm.patchValue({
        street: address.street,
        zip: address.zip,
        state: address.state,
        city: address.city
      });
    }

    this.customerService.getCustomerById(this.organization.id, this.customer.id).subscribe((response) => {
      this.reservations = response.data.reservations;
    });
  }

  onSubmit(data) {
    const customer = {
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip
      }
    };

    this.loading = true;
    this.customerService
      .updateCustomer(this.organization.id, this.customer.id, customer)
      .subscribe(() => {
        this.onUpdated.emit();
        this.loading = false;
        this.modal.hide();
      }, () => {
        this.loading = false;
        alert('Error occurred while updating');
      });
  }

  getPaymentStatus(status) {
    if (!status) return '';

    switch (status) {
      case 1:
        return 'Sent to client';
      case 2:
        return 'Sent to payment';
      case 3:
        return 'Payment accepted';
      case 4:
        return 'Payment rejected';
      case 5:
        return 'Payment cancelled';
      case 6:
        return 'Payment fraud';
    }
  }
}
