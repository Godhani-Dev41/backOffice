
import { Injectable } from '@angular/core';
import { AdminAuthService } from '@app/shared/services/auth/admin-auth.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCServerResponse } from '@app/shared/services/main';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface RCGetUsersAdminQuery {
  organizationOnly?: boolean;
}

@Injectable()
export class AdminUsersService {
  get adminToken(): string {
    return this.adminAuth.getToken();
  }

  constructor(
    private auth: AuthenticationService,
    private adminAuth: AdminAuthService,
    private http: HttpClient
  ) {

  }

  getUsers(query?: RCGetUsersAdminQuery): Observable<RCServerResponse<any>> {
    const authHeaders = new HttpHeaders();
    authHeaders.append('Authorization', 'Bearer ' + this.adminToken);

    return this.http
      .get<any>(environment.CS_URLS.API_ROOT + '/users', {
        headers: authHeaders,
        params: query
      } as any) as any;
  }

  getUserToken(id: number): Observable<RCServerResponse<any>> {
    const authHeaders = new HttpHeaders();
    authHeaders.append('Authorization', 'Bearer ' + this.adminToken);

    return this.http
      .get<any>(environment.CS_URLS.API_ROOT + '/users/token/' + id, {
        headers: authHeaders
      }).pipe(
      map((response) => response),
      map((response: any) => {
        this.auth.setToken(response.data);

        return response;
      }),);
  }
}
