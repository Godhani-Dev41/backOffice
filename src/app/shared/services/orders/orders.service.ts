
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class OrdersService {
  currentOrder$ = new BehaviorSubject<any>(null);
  currentOrderReservations$ = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient
  ) { }

  getOrderById(organizationId: number, orderId: string) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations/orders/${orderId}`).pipe(
      map(response => response));
  }

  getOrderAnswers(organizationId: number, orderId: string) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations/orders/${orderId}/answers`).pipe(
      map(response => response));
  }

  aproveOrderById(orderId: string, data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations/order/${orderId}/accept`, data).pipe(
      map(response => response));
  }

  declineOrderById(orderId: string, data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations/order/${orderId}/decline`, data).pipe(
      map(response => response));
  }
}
