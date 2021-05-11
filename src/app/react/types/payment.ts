export interface GetPaymentsResponse {
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  data: Payment[];
}

export interface Payment {
  id: number;
  total: number;
  paymentMethod: PaymentMethodTypeEnum;
  status: PaymentChargeStatusEnum;
  createdAt: Date;
  invoices: number[];
}

export enum PaymentMethodTypeEnum {
  CASH = "cash",
  CREDIT_CARD = "card",
  ACH = "ach",
}

export enum EPaymentMethod {
  cash = "cash",
  card = "card",
  ach = "ach",
}

export enum EPaymentStatus {
  not_paid = "Not Paid",
  paid = "Paid",
  partial = "Partially paid",
}

export enum PaymentChargeStatusEnum {
  paid = "Paid",
  refunded = "Refunded",
}

export interface IPayment {
  plannedDate: string;
  price: number;
}

export interface PaymentMethod {
  id: string;
  billing_details: {
    address: {
      city: string | null;
      country: string | null;
      line1: string | null;
      line2: string | null;
      postalCode: string | null;
      state: string | null;
    };
    email: string;
    name: string;
    phone: string;
  };
  card: {
    brand: string;
    country?: string;
    exp_month: string;
    exp_year: string;
    fingerprint?: string;
    funding?: string;
    generated_from?: string | null;
    last4: string;
  };
  type: EPaymentMethod;
}
