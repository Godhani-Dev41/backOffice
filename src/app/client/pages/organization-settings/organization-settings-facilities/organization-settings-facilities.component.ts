import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCLinkedAccountStatus, RCLeagueBookingStateEnum, RCPaymentSettingStatus, RCOrganization } from '@rcenter/core';
import { Subject } from 'rxjs/Subject';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillingSettingVMEnum, OrgFacilitiesSettingsForm } from './organization-settings-facilities.model';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'rc-organization-settings-facilities',
  templateUrl: './organization-settings-facilities.component.html',
  styleUrls: ['./organization-settings-facilities.component.scss']
})
export class OrganizationSettingsFacilitiesComponent implements OnInit, OnDestroy {
  organization: RCOrganization;
  destroy$ = new Subject<true>();
  stripeUrl: string;
  orgSettingsForm: FormGroup;
  loading = false;
  RCLinkedAccountStatus = RCLinkedAccountStatus;
  RCLeagueBookingStateEnum = RCLeagueBookingStateEnum;
  RCPaymentSettingStatus = RCPaymentSettingStatus;
  BillingSettingVMEnum = BillingSettingVMEnum;
  constructor(
    private organizationService: OrganizationsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthenticationService,
  ) {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.orgSettingsForm = this.fb.group({
      currentBillingSetting: [BillingSettingVMEnum.DISABLED],
      vettedCustomerDirectBooking: [false],
      bookingRequestOnly: [false],
    });


    this.authService.currentOrganization.pipe(
        takeUntil(this.destroy$)
    ).subscribe((org) => {
        if (!org) return;
        this.organizationService.getOrganizationById(org.id).subscribe((response) => {
          this.organization = response.data;

          if (this.organization.paymentSettings) {
            this.orgSettingsForm.patchValue({
              vettedCustomerDirectBooking: this.organization.paymentSettings.vettedCustomerDirectBooking,
              bookingRequestOnly: this.organization.paymentSettings.bookingRequestOnly,
            });
          }


          if (this.organization.paymentSettings && this.organization.paymentSettings.onlinePaymentEnabled) {
            if (
              this.organization.paymentSettings.bookingRequestOnly &&
              !this.organization.paymentSettings.vettedCustomerDirectBooking
            ) {
              this.orgSettingsForm.patchValue({
                currentBillingSetting: BillingSettingVMEnum.BOOKING_REQUEST_ALL_CUSTOMERS
              });
            } else if (
              this.organization.paymentSettings.bookingRequestOnly &&
              this.organization.paymentSettings.vettedCustomerDirectBooking
            ) {
              this.orgSettingsForm.patchValue({
                currentBillingSetting: BillingSettingVMEnum.VETTED_CUSTOMER_DIRECT_BOOKING
              });
            } else if (
              !this.organization.paymentSettings.bookingRequestOnly &&
              !this.organization.paymentSettings.vettedCustomerDirectBooking
            ) {
              this.orgSettingsForm.patchValue({
                currentBillingSetting: BillingSettingVMEnum.DIRECT_BOOKING
              });
            } else {
              this.orgSettingsForm.patchValue({
                currentBillingSetting: BillingSettingVMEnum.DISABLED
              });
            }
          }
        });
      });
  }


  submit(data: OrgFacilitiesSettingsForm) {
    switch (data.currentBillingSetting) {
      case BillingSettingVMEnum.DIRECT_BOOKING:
        this.organization.paymentSettings.vettedCustomerDirectBooking = false;
        this.organization.paymentSettings.bookingRequestOnly = false;
        this.organization.paymentSettings.paymentSettingStatus = RCPaymentSettingStatus.ENABLED;
        this.organization.paymentSettings.onlinePaymentEnabled = true;
        this.organization.paymentSettings.allowCash = true;
        break;
      case BillingSettingVMEnum.VETTED_CUSTOMER_DIRECT_BOOKING:
        this.organization.paymentSettings.vettedCustomerDirectBooking = true;
        this.organization.paymentSettings.bookingRequestOnly = true;
        this.organization.paymentSettings.paymentSettingStatus = RCPaymentSettingStatus.ENABLED;
        this.organization.paymentSettings.onlinePaymentEnabled = true;
        this.organization.paymentSettings.allowCash = true;
        break;
      case BillingSettingVMEnum.BOOKING_REQUEST_ALL_CUSTOMERS:
        this.organization.paymentSettings.vettedCustomerDirectBooking = false;
        this.organization.paymentSettings.bookingRequestOnly = true;
        this.organization.paymentSettings.paymentSettingStatus = RCPaymentSettingStatus.ENABLED;
        this.organization.paymentSettings.onlinePaymentEnabled = true;
        this.organization.paymentSettings.allowCash = true;
        break;
      case BillingSettingVMEnum.DISABLED:
        this.organization.paymentSettings.vettedCustomerDirectBooking = false;
        this.organization.paymentSettings.bookingRequestOnly = false;
        this.organization.paymentSettings.paymentSettingStatus = RCPaymentSettingStatus.DISABLED_INFO_ONLY;
        this.organization.paymentSettings.onlinePaymentEnabled = false;
        break;
    }
    this.loading = true;

    this.organizationService.updateOrganization(this.organization.id, {
      ...this.organization
    }).subscribe((response) => {
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
