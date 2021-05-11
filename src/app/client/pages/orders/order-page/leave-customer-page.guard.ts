import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { OrdersService } from '@app/shared/services/orders/orders.service';

@Injectable()
export class LeaveOrderPageGuard implements CanDeactivate<any> {
  constructor(
    private ordersService: OrdersService
  ) {

  }

  canDeactivate() {
    this.ordersService.currentOrder$.next(null);

    return true;
  }
}
