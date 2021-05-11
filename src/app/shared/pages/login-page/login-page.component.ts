
import {mergeMap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';

type pageStates = 'login' | 'forgot-password' | 'email-sent' | 'password-change' | 'signup';

@Component({
  selector: 'rc-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  backgrounds = ['assets/img/login/login-bg-1.jpg'];
  user: { password: string, email: string, rememberMe?: boolean, passwordRepeat?: string };
  loading: boolean;
  isError: boolean;
  errorMessage: string;
  currentState: pageStates;
  /** token received from the server when visiting the login page with token provided */
  resetToken: string;
  organizationForm: FormGroup;
  userConnectOrganizationWidget: boolean;
  organizationConnectMode: boolean;
  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private toastr: ToastrService,
    private analytics: AnalyticsService,
    private organizationService: OrganizationsService
  ) {
    this.organizationForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      passwordRepeat: ['', Validators.required],
      termsAgreed: ['', Validators.required]
    });

    this.user = {
      password: '',
      email: ''
    };

    this.currentState = 'login';
    this.isError = false;
    this.loading = false;
    this.errorMessage = 'User name or password is incorrect';
  }

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((data: any) => {
      if (data.resetToken) {
        this.currentState = 'password-change';
        this.resetToken = data.resetToken;
      } else {
        this.currentState = 'login';
      }
    });
  }

  submitOrganizationRegister(data) {
    this.isError = false;
    this.errorMessage = '';

    if (data.passwordRepeat !== data.password) {
      this.toastr.error('Passwords don\'t match');
      return;
    }

    if (!data.password || data.password.length < 6) {
      this.toastr.error('Password must be at least 6 characters long');
      return;
    }

    this.analytics.trackEvent('signup:attempt');

    this.loading = true;
    // First we create the user object
    // the user will be a general organization user

    if (this.organizationConnectMode) {
      this.auth
        .signIn(data.email, data.password)
        .subscribe((response) => {
          this.createOrganizationEntity(data, response.user);
        });
    } else {
      this.auth
        .signup({
          email: data.email,
          password: data.password,
          firstName: data.name,
          lastName: ''
        })
        .subscribe((response: any) => {
          this.createOrganizationEntity(data, response.user);
        }, (err) => {
          this.loading = false;

          if (err) {
            const errorObject = err;
            this.analytics.trackEvent('signup:failed');

            this.isError = true;
            this.errorMessage = errorObject.error || 'Error occurred while signing up';
          }
        });
    }
  }

  createOrganizationEntity(data, user) {
    // after the user was created we create and empty organization object
    // later all the other information will be filled in the signup form
    this.organizationService.createOrganization({
      name: data.name,
      email: data.email,
      userCreatorId: user.id
    }).pipe(mergeMap(() => {
      return this.auth.fetchActiveOrganization();
    })).subscribe((organization) => {
      this.auth.updateUserProfile(user.id, {
        profile: {
          createAsId: organization.id,
          createAsType: 'organization'
        }
      })
        .subscribe(() => {
          this.loading = false;
          this.analytics.trackEvent('signup:success');
          this.endRequest();

          this.route.navigate(['/client/organization/edit'], {
            queryParams: {
              signup: true
            }
          });
        }, () => {
          this.loading = false;
          this.toastr.error('Error occurred while creating organization.');
        });
    }, () => {
      this.loading = false;
      this.toastr.error('Error occurred while creating organization.');
    });
  }

  /**
   * Local login submit function
   * requires password and email from model
   */
  onLogin(): void {
    if (this.loading) return;
    this.beginRequest();
    this.analytics.trackEvent('login:attempt');

    this.auth
      .login(this.user.email, this.user.password)
      .subscribe(() => {
        this.analytics.trackEvent('login:success');
        this.endRequest();
        this.route.navigate(['/client']);
      }, (err) => {
        if (err.message === 'No organization was found') {
          this.loading = false;
          this.userConnectOrganizationWidget = true;
        } else {
          this.analytics.trackEvent('login:failed');
          this.endRequest(true);
        }
      });
  }

  /**
   * Creates the initial password reset step
   * Request to generate a new reset token will be sent to server,
   * User will receive email and will re enter the web app with the new url (including the token generated by server)
   */
  onPasswordResetRequest(): void {
    this.beginRequest();

    this.auth.requestPasswordReset(this.user.email).subscribe(() => {
      this.currentState = 'email-sent';
      this.endRequest();
    }, () => {
      this.currentState = 'email-sent';
    });
  }

  onPasswordChange() {
    this.errorMessage = null;

    const error = this.validatePasswordReset();
    if (error) {
      this.errorMessage = error;
      this.isError = true;
      return;
    }

    this.beginRequest();
    this.auth
      .resetPassword(this.user.password, this.user.passwordRepeat, this.resetToken)
      .subscribe(() => {
        this.currentState = 'login';

        this.endRequest();
      }, () => {
        this.errorMessage = 'Error occurred while resetting password';
        this.endRequest(true);
      });
  }

  validatePasswordReset(): string {
    if (this.user.passwordRepeat !== this.user.password) {
      return 'Passwords don\'t match';
    }

    if (!this.user.password || this.user.password.length < 6) {
      return 'Password must meet minimum requirements';
    }

    if (!this.resetToken) {
      return 'User password reset link timeout';
    }
  }

  /**
   * Called on each request begging,
   * useful for managing loading state of buttons and etc..
   */
  beginRequest(): void {
    this.userConnectOrganizationWidget = false;
    this.loading = true;
  }

  /**
   * Called on each loading finish proccess
   * resets error state and other relevant info
   * @param err
   */
  endRequest(err?: boolean): void {
    this.loading = false;
    this.isError = err;
  }

  /**
   * Change the current view state between available states
   * the state will change the current visible login widget
   * @param state
   */
  goToState(state: pageStates): void {
    if (this.userConnectOrganizationWidget) {
      this.userConnectOrganizationWidget = false;
      this.organizationConnectMode = true;

      this.organizationForm.patchValue({
        email: this.user.email,
        password: this.user.password,
        passwordRepeat: this.user.password
      });
    } else {
      this.organizationConnectMode = false;
    }
    this.isError = false;
    this.currentState = state;
  }

  getBGImage() {
    if (this.currentState === 'signup') {
      return 'assets/img/signup_bg_image.jpg';
    } else {
      return this.backgrounds[0];
    }
  }

  openTerms(site: string) {
    console.log(site);
  }
}
