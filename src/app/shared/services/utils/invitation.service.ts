
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RCServerResponse } from '@app/shared/services/main';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class InvitationService {
  constructor(
    private http: HttpClient
  ) {

  }

  /**
   * Resend the invites to a particular entity list based on their invite token
   * @param tokens
   * @returns { Observable<R> }
   */
  resendInvites(tokens: string[]): Observable<RCServerResponse<any>> {
    return this.http.post<any>(environment.CS_URLS.API_ROOT + '/invites/resend', {
      tokens
    }).pipe(map(response => response));
  }

  removeInvite(inviteId: number) {
    return this.http
      .delete(environment.CS_URLS.API_ROOT + '/invites/invite/' + inviteId).pipe(
      map(response => response));
  }
}
