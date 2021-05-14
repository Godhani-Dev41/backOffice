import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class CustomersService {
  currentCustomer$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  getCustomers(
    organizationId: number,
    page?: number,
    itemsPerPage?: number,
    typeFilter?: string[],
    searchFilter?: string,
  ) {
    let searchParam = "";
    if (searchFilter != "") {
      searchParam = `&nameSearch=${encodeURIComponent(searchFilter)}`;
    }

    let typeParam = "";
    if (typeFilter && typeFilter.length != 0) {
      let query = "";
      typeFilter.map((status, index) => {
        if (index == 0) {
          query += status;
        } else {
          query += `,${status}`;
        }
      });
      typeParam = `&customerType=${query}`;
    }
    if (!page) {
      page = 1;
    }
    if (!itemsPerPage) {
      itemsPerPage = 10;
    }
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/orgCustomers/organizations/${organizationId}/customers?page=${page}&itemsPerPage=${itemsPerPage}${typeParam}${searchParam}`,
      )
      .pipe(map((response) => response));
  }

  // getting customers AND subscribers
  getCustomersSubscribers(organizationId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/customersSubscribers`)
      .pipe(map((response) => response));
  }

  getCustomerById(organizationId: number, customerId: number | string) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/customers/${customerId}`)
      .pipe(map((response) => response));
  }

  updateCustomer(organizationId: number, customerId: number, data) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/customers/${customerId}`, data)
      .pipe(map((response) => response));
  }

  getCustomerByUserId(organizationId: number, userId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/customers/user/${userId}`)
      .pipe(map((response) => response));
  }

  getPaymentsByCustomer(
    customerId: number,
    page: number,
    itemsPerPage: number,
    statusFilter: string[],
    methodFilter: string[],
    searchFilter: string,
  ) {
    let searchParam = "";
    if (searchFilter != "") {
      searchParam = `&searchParam=${encodeURIComponent(searchFilter)}`;
    }

    let statusParam = "";
    if (statusFilter.length != 0) {
      let query = "";
      statusFilter.map((status, index) => {
        if (index == 0) {
          query += status;
        } else {
          query += `,${status}`;
        }
      });
      statusParam = `&paymentStatus=${query}`;
    }

    let methodParam = "";
    if (methodFilter.length != 0) {
      let query = "";
      methodFilter.map((method, index) => {
        if (index == 0) {
          query += method;
        } else {
          query += `,${method}`;
        }
      });
      methodParam = `&paymentType=${query}`;
    }
    if (!page) {
      page = 1;
    }
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/customers/${customerId}/payments?page=${page}&itemsPerPage=${itemsPerPage}${statusParam}${methodParam}${searchParam}`,
      )
      .pipe(map((response) => response));
  }

  getPaymentById(customerId: number, paymentId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/customers/${customerId}/payments/${paymentId}`)
      .pipe(map((response) => response));
  }

  getInvoicesByCustomer(
    customerId: number,
    page: number,
    itemsPerPage: number,
    statusFilter: string[],
    methodFilter: string[],
    searchFilter: string,
  ) {
    let searchParam = "";
    if (searchFilter != "") {
      searchParam = `&searchParam=${encodeURIComponent(searchFilter)}`;
    }
    let statusParam = "";
    if (statusFilter.length != 0) {
      let query = "";
      statusFilter.map((status, index) => {
        if (index == 0) {
          query += status;
        } else {
          query += `,${status}`;
        }
      });
      statusParam = `&paymentStatus=${query}`;
    }

    let methodParam = "";
    if (methodFilter.length != 0) {
      let query = "";
      methodFilter.map((method, index) => {
        if (index == 0) {
          query += method;
        } else {
          query += `,${method}`;
        }
      });
      methodParam = `&paymentType=${query}`;
    }
    if (!page) {
      page = 1;
    }
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/customers/${customerId}/invoices?page=${page}&itemsPerPage=${itemsPerPage}${statusParam}${methodParam}${searchParam}`,
      )
      .pipe(map((response) => response));
  }

  getInvoiceById(customerId: number, invoiceId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/customers/${customerId}/invoices/${invoiceId}`)
      .pipe(map((response) => response));
  }
}
