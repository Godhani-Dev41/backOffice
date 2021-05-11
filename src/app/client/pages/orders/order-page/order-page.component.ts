import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '@app/shared/services/customers/customers.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { OrdersService } from '@app/shared/services/orders/orders.service';
import { SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {
  order: any;
  organization: any;
  loading = false;
  reservations = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private sportsService: SportsService,
    private authService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
    this.loading = true;
    this.ordersService.currentOrder$.next(null);
    this.ordersService.currentOrderReservations$.next(null);
    const organization = this.authService.currentOrganization.getValue();
    this.organization = organization;
    const orderId = this.activeRoute.snapshot.params['orderId'];

    this.ordersService.getOrderById(organization.id, orderId).subscribe((response) => {
      this.order = response.data;

      this.reservations = response.data.reservations;

      this.ordersService.currentOrder$.next(this.order);
      this.ordersService.currentOrderReservations$.next(this.reservations);
      this.loading = false;
    });
  }


}
