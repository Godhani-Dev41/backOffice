import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CustomersService } from '@app/shared/services/customers/customers.service';

@Injectable()
export class LeaveCustomerPageGuard implements CanDeactivate<any> {
  constructor(
    private customersService: CustomersService
  ) {

  }

  canDeactivate() {
    this.customersService.currentCustomer$.next(null);

    return true;
  }
}
