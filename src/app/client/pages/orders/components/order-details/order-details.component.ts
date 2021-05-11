import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@app/shared/services/orders/orders.service';
import { SportsService } from '@app/shared/services/utils/sports.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';

@Component({
  selector: 'rc-order-details-component',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: any;
  organization: any;
  loading = false;
  addons = [];
  reservations = [];
  spaces = [];
  allowLoading = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private sportsService: SportsService,
  ) {

  }

  ngOnInit() {
    this.ordersService.currentOrder$.subscribe((order) => {
      if (!order) return;

      this.order = order;
    });

    this.ordersService.currentOrderReservations$.subscribe((reservations) => {
      if (!reservations) return;

      this.reservations = reservations.filter((r) => r.name.indexOf('- Addon') === -1);
      this.addons = reservations.filter((r) => r.name.indexOf('- Addon') !== -1);

      for (const reservation of this.reservations) {
        if (!this.spaces.find(space => space.id === reservation.space.id)) {
          this.spaces.push(reservation.space);
        }
      }
    });
  }

  getOrderStatus(status) {
    if (!status) return '';

    switch (status) {
      case 'waitingAdmin':
        return 'Waiting Admin';
      case 'waitingClient':
        return 'Waiting Client';
      case 'active':
        return 'Active';
      case 'notFinal':
        return 'Not Final';
      case 'canceled':
        return 'Canceled';
    }
  }

  getSportIcon(sport: number) {
    const foundSport = this.sportsService.getSport(sport);
    if (foundSport) return foundSport.icon;
  }

  async allow() {
    this.allowLoading = true;
    await this.ordersService.aproveOrderById(this.order.orderId, {}).toPromise();
    this.order.status = 'active';
    this.allowLoading = false;
  }

  async decline() {
    await this.ordersService.declineOrderById(this.order.orderId, {}).toPromise();
  }
}
