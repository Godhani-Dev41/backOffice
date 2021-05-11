
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RCServerResponse } from '@app/shared/services/main';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentsService {

  constructor(
    private http: HttpClient,
    private leaguesService: LeaguesService
  ) {

  }

  getAuthLink(): Observable<RCServerResponse<string>> {
    const arr = window.location.href.split('/');
    const baseUrl = arr[0] + '//' + arr[2];

    const redirectUrl = baseUrl + '/client/organization/settings/billing';

    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/payments/connect-url?provider=stripe&callbackUrl=${
        encodeURIComponent(redirectUrl)
      }&dstEntityType=organization&dstEntityId=${this.leaguesService.currentOrganization.id}`).pipe(
      map((response) => response));
  }

  /**
   * After the proccess of authorization finished on braintree side
   */
  authorizeAccount(code: string, merchantId: number, state: string) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT
      }/payments/connect-url-callback?provider=stripe&code=${code}&state=${state}&merchantId=${merchantId}`).pipe(
      map(response => response));
  }

  switchToStripePendingStatus(organizationId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/payments/connect-url/pending`, {
        creatorType: 'organization',
        creatorId: organizationId
      }).pipe(
      map(response => response));
  }
}
