import { Component, OnInit, OnDestroy } from '@angular/core';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';
import { PaymentsService } from '@app/shared/services/payments/payments.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCLinkedAccountStatus, RCLeagueBookingStateEnum, RCPaymentSettingStatus, RCOrganization } from '@rcenter/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { OrgRegistrationSettingsForm } from './organization-settings-billing.model';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'rc-organization-settings-billing',
  templateUrl: './organization-settings-billing.component.html',
  styleUrls: ['./organization-settings-billing.component.scss']
})
export class OrganizationSettingsBillingComponent implements OnInit, OnDestroy {
  organization: RCOrganization;
  destroy$ = new Subject<true>();
  stripeUrl: string;
  orgSettingsForm: FormGroup;
  loading = false;
  RCLinkedAccountStatus = RCLinkedAccountStatus;
  RCLeagueBookingStateEnum = RCLeagueBookingStateEnum;
  RCPaymentSettingStatus = RCPaymentSettingStatus;
  constructor(
    private organizationService: OrganizationsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private analytics: AnalyticsService,
    private paymentsService: PaymentsService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.orgSettingsForm = this.fb.group({
      paymentMethod: [''],
      onlinePaymentEnabled: [false],
      activeInstallments: [false],
      offlinePaymentEnabled: [false],
      paymentSettingStatus: [RCPaymentSettingStatus.DISABLED_INFO_ONLY],
      installmentsAmount: [12, Validators.compose([CustomValidators.min(2), CustomValidators.max(12)])]
    });

    if (
      this.activatedRoute.snapshot.queryParams &&
      this.activatedRoute.snapshot.queryParams['state'] &&
      this.activatedRoute.snapshot.queryParams['code']
    ) {
      const params = this.activatedRoute.snapshot.queryParams;

      this.paymentsService.authorizeAccount(
        params['code'],
        params['merchantId'],
        params['state']
      ).subscribe((response) => {
        this.toastr.success('Account was successfully connected');
        this.organization.stripeAccount = RCLinkedAccountStatus.ACTIVE;
        this.toggleOnlinePaymentDisabledState();
      }, (err) => {
        this.toastr.error('Error occurred while connecting stripe account');
      });
    }

    this.authService.currentOrganization.pipe(
        takeUntil(this.destroy$)
    )      .subscribe((org) => {
        if (!org) return;
        this.organizationService.getOrganizationById(org.id).subscribe((response) => {
          this.organization = response.data;

          let installmentsActive = false;

          if (this.organization.paymentSettings && this.organization.paymentSettings.installments) {
            installmentsActive = true;
          }

          if (this.organization.paymentSettings) {
            this.orgSettingsForm.patchValue({
              paymentSettingStatus: this.organization.paymentSettings.paymentSettingStatus || RCPaymentSettingStatus.DISABLED_INFO_ONLY,
              onlinePaymentEnabled: this.organization.paymentSettings.onlinePaymentEnabled,
              activeInstallments: installmentsActive,
              installmentsAmount: installmentsActive && this.organization.paymentSettings.installments
            });
          }

          if (!this.organization.stripeAccount || this.organization.stripeAccount === 0 ||
            this.organization.stripeAccount === 1 || this.organization.stripeAccount === 3) {
            this.paymentsService.getAuthLink().subscribe((linkResponse) => {
              this.stripeUrl = linkResponse.data;
            });
          }

          this.toggleOnlinePaymentDisabledState();
        });
      });
  }

  toggleOnlinePaymentDisabledState() {
    if (this.organization.stripeAccount !== RCLinkedAccountStatus.ACTIVE) {
      this.orgSettingsForm.get('onlinePaymentEnabled').disable();
    } else if (this.organization.stripeAccount === RCLinkedAccountStatus.ACTIVE) {
      this.orgSettingsForm.get('onlinePaymentEnabled').enable();
    }
  }

  stripeStartProccess() {
    this.analytics.trackEvent('stripe:connect:start');

    this.paymentsService
      .switchToStripePendingStatus(this.organization.id)
      .subscribe(() => { console.log('Entered pending state'); });
  }


  submit(data: OrgRegistrationSettingsForm) {
    let installments = null;
    if (data.activeInstallments) {
      installments = data.installmentsAmount;
    }

    if (!this.organization.paymentSettings) this.organization.paymentSettings = {};

    this.organization.paymentSettings.installments = installments;

    if (this.organization.paymentSettings.paymentSettingStatus !== this.RCPaymentSettingStatus.ENABLED) {
      this.organization.paymentSettings.allowCash = false;
      this.organization.paymentSettings.vettedCustomerDirectBooking = false;
      this.organization.paymentSettings.onlinePaymentEnabled = false;
      this.organization.paymentSettings.installments = null;
    } else {
      if (!this.organization.paymentSettings.bookingRequestOnly) {
        this.organization.paymentSettings.vettedCustomerDirectBooking = false;
      }
    }

    this.loading = true;

    this.organizationService.updateOrganization(this.organization.id, {
      ...this.organization
    }).subscribe((response) => {
      this.organization.paymentSettings = {
        paymentSettingStatus: data.paymentSettingStatus,
        onlinePaymentEnabled: data.onlinePaymentEnabled,
        installments: installments
      };

      this.authService.currentOrganization.next(this.organization);

      this.loading = false;
      this.orgSettingsForm.markAsPristine();
      this.toastr.success('Settings saved successfully');
    }, () => {
      this.toastr.error('Error while saving');
      this.loading = false;
    });
  }

}
