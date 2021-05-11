import { Component, OnInit } from '@angular/core';
import { CustomersService } from '@app/shared/services/customers/customers.service';

@Component({
  selector: 'rc-customer-reservations-page',
  templateUrl: './customer-reservations-page.component.html',
  styleUrls: ['./customer-reservations-page.component.scss']
})
export class CustomerReservationsPageComponent implements OnInit {
  reservations: any[] = [];
  constructor(
    private customersService: CustomersService
  ) { }
  ngOnInit() {
    this.customersService.currentCustomer$.subscribe((customersResponse) => {
      if (!customersResponse) return;

      this.reservations = customersResponse.reservations;
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

  updateItems() {
    this.getReservations();
  }


  getReservations() {

  }

}
