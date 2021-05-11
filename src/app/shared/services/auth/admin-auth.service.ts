
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AdminAuthService {
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) {

  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(environment.CS_URLS.API_DOMAIN + '/auth/admin-login', { email, password }).pipe(
      map(res => res),
      map((res: any) => {
        if (res.token) {
          if (window['Intercom']) {
            window['Intercom']('shutdown');
          }

          localStorage.setItem('admin_token', res.token);
        }

        return res;
      }),);
  }

  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  getToken(): string {
    return localStorage.getItem('admin_token');
  }
}
