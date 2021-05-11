import { RCPaymentSettingStatus } from '@rcenter/core';

export interface OrgRegistrationSettingsForm {
  activeInstallments: boolean;
  installmentsAmount: number;
  onlinePaymentEnabled: boolean;
  paymentSettingStatus: RCPaymentSettingStatus;
}
