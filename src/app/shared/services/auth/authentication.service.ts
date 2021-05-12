import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable, ReplaySubject, BehaviorSubject } from "rxjs";
import { environment } from "../../../../environments/environment";
import { OrganizationsService } from "../organization/organizations.service";
import { RCOrganization } from "@rcenter/core";
import * as moment from "moment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class AuthenticationService {
  private tokenName = "id_token";
  private renewTokenName = "renew_token";

  currentOrganization: BehaviorSubject<RCOrganization> = new BehaviorSubject(null);
  userOrganizations: ReplaySubject<RCOrganization[]> = new ReplaySubject(1);
  constructor(
    public jwtHelper: JwtHelperService,
    private http: HttpClient,
    private authHttp: HttpClient,
    private organizationsService: OrganizationsService,
    private router: Router,
  ) {
    this.currentOrganization.subscribe((organization) => {
      if (organization) {
        localStorage.setItem("selected_org_id", String(organization.id));
      }
    });
  }

  /**
   * Performs a login request to the server
   * @param email
   * @param password
   * @returns {Observable<RCOrganization>}
   */
  login(email: string, password: string): Observable<RCOrganization> {
    let o = {
      email,
      password,
      backoffice: true,
    };
    // console.log("performin login with ", window['ybt'] = this, o);
    let p = this.http.post<any>(environment.CS_URLS.API_DOMAIN + "/auth/login", {
      email,
      password,
      backoffice: true,
    });

    return new Observable<RCOrganization>((subscriber) => {
      p.subscribe(
        (res: any) => {
          if (res.token) {
            localStorage.removeItem("admin_token");
            this.setToken(res.token);
          }

          if (res.renewToken) {
            this.setRenewToken(res.renewToken);
          }

          this.fetchActiveOrganization().subscribe(
            (o) => {
              subscriber.next();
              subscriber.complete();
            },
            (err) => subscriber.error(err),
          );
        },
        (err) => subscriber.error(err),
      );
    });
  }

  /**
   * TODO: refactor login with login and fetch organization on different steps
   * @param {string} email
   * @param {string} password
   * @returns {Observable<any>}
   */
  signIn(email: string, password: string) {
    return this.http
      .post<any>(environment.CS_URLS.API_DOMAIN + "/auth/login", {
        email,
        password,
        backoffice: true,
      })
      .pipe(
        map((response: any) => {
          const res = response;

          if (res.token) {
            this.setToken(res.token);
          }

          if (res.renewToken) {
            this.setRenewToken(res.renewToken);
          }

          return res;
        }),
      );
  }

  renewToken() {
    const lastFetch = localStorage.getItem("lastTokenFetch");
    const renewToken = localStorage.getItem(this.renewTokenName);

    if (!lastFetch || moment(lastFetch).isBefore(moment().startOf("day"))) {
      this.authHttp
        .post(`${environment.CS_URLS.API_DOMAIN}/auth/renew`, {
          renewToken: renewToken || this.getToken(),
        })
        .pipe(map((response) => response))
        .subscribe((response: { token: string; renewToken: string }) => {
          if (response.token) {
            this.setToken(response.token);
            this.setRenewToken(response.renewToken);

            localStorage.setItem("lastTokenFetch", moment().format());
          }
        });
    }
    this.authHttp.post<any>(`${environment.CS_URLS.API_DOMAIN}/auth/renew`, {});
  }

  /**
   * Performs a signup request to the server
   * @returns {Observable<RCOrganization>}
   */
  signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    backoffice?: boolean;
  }): Observable<any> {
    data.backoffice = true;

    return this.http.post<any>(environment.CS_URLS.API_DOMAIN + "/auth/signup", data).pipe(
      map((res) => res),
      map((res: any) => {
        if (res.token) {
          this.setToken(res.token);
        }

        if (res.renewToken) {
          this.setRenewToken(res.renewToken);
        }

        return res;
      }),
    );
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenName, token);
  }

  setRenewToken(token: string) {
    localStorage.setItem(this.renewTokenName, token);
  }

  getToken(): string {
    return localStorage.getItem(this.tokenName);
  }

  /**
   * Retrieves the user current organization
   * For now it's simply the first user organization from the returned array from the server
   * Later it will be implemented using current organization id
   * @returns {Observable<RCOrganization>}
   */
  fetchActiveOrganization(): Observable<RCOrganization> {
    return this.organizationsService.getUserOrganizations().pipe(
      map((response) => {
        if (!response.data || !response.data.length) throw new Error("No organization was found");

        this.userOrganizations.next(response.data);

        const selectedOrg = localStorage.getItem("selected_org_id");
        let currentOrganization = response.data[0];

        if (selectedOrg) {
          const foundOrg = response.data.find((i) => i.id === Number(selectedOrg));

          if (foundOrg) {
            currentOrganization = foundOrg;
          }
        }

        this.currentOrganization.next(currentOrganization);

        return response.data[0];
      }),
    );
  }

  /**
   * Sends a password request to the server
   * Email address must be provided in order to request a password reset
   * @param email
   * @returns {Observable<Response>}
   */
  requestPasswordReset(email: string): Observable<any> {
    if (!email) throw new Error("Email was not provided for password reset service.");
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_DOMAIN}/auth/password-reset?email=${encodeURIComponent(
          email,
        )}&url=${encodeURIComponent(environment.SITE_URL)}`,
      )
      .pipe(map((res) => res));
  }

  /**
   * Resets the user password using a token generated by the server
   * @param newPassword
   * @param passwordRepeat
   * @param token
   * @returns {Observable<Response>}
   */
  resetPassword(newPassword: string, passwordRepeat: string, token: string): Observable<any> {
    if (!token) throw new Error("Token must be provided");
    if (newPassword !== passwordRepeat) throw new Error("Password must match");

    return this.http
      .post<any>(`${environment.CS_URLS.API_DOMAIN}/auth/password-reset`, {
        password: newPassword,
        passwordRepeat,
        token,
      })
      .pipe(map((res) => res));
  }

  updateUserProfile(userId: string, data: { profile: any }): Observable<any> {
    return this.authHttp.put(`${environment.CS_URLS.API_ROOT}/users/${userId}/settings`, data).pipe(map((res) => res));
  }

  /**
   * Logs the user out of the system
   * It will remove the token from the localStorage
   * and perform additional reset functionality
   */
  logout(): void {
    localStorage.removeItem("selected_org_id");
    localStorage.removeItem(this.tokenName);
    this.router.navigate(["/login"]);

    if (window["Intercom"]) {
      window["Intercom"]("shutdown");
    }
  }

  /**
   * Checks if the user is authenticated.
   * This method will also validate if the token is not expired
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    return !this.jwtHelper.isTokenExpired(this.getToken());
  }

  getTokenData() {
    return this.jwtHelper.decodeToken(this.getToken());
  }

  getOrCreateUser(email: string, firstName: string, lastName: string, phoneNumber: string): Observable<any> {
    //const authHeaders = new HttpHeaders();
    //authHeaders.append('Authorization', 'Bearer ' + this.adminToken);

    return this.http
      .post<any>(environment.CS_URLS.API_DOMAIN + "/v1/users/get-create-customer-by-email", {
        email,
        firstName,
        lastName,
        phoneNumber,
      })
      .pipe(map((response) => response));
  }
}
