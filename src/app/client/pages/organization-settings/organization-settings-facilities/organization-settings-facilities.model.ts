
export interface OrgFacilitiesSettingsForm {
  bookingRequestOnly: boolean;
  vettedCustomerDirectBooking: boolean;
  currentBillingSetting: BillingSettingVMEnum;
}

export enum BillingSettingVMEnum {
  DISABLED,
  DIRECT_BOOKING,
  BOOKING_REQUEST_ALL_CUSTOMERS,
  VETTED_CUSTOMER_DIRECT_BOOKING
}
