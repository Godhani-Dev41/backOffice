import { PaymentMethod, IPayment } from "../../types/payment";
import { environment } from "environments/environment";
import { network } from "../network";

const v3APIUrl = `${environment.CS_URLS.API_ROOT_V3}`;

const temporal_url = `${environment.CS_URLS.API_ROOT}/organizations`;

async function getPaymentSecret(userId: number) {
  const response = await network.get(`${v3APIUrl}/purchase/${userId}/clientSecret`);

  return response.client_secret;
}

async function paymentMethods(userId: number): Promise<PaymentMethod[]> {
  const response = await network.get(`${v3APIUrl}/purchase/${userId}/paymentMethods`);

  return response;
}

interface IPayProps {
  orderId: number;
  amountToPay: number;
  organizationId: number;
  payingUserId: number;
  paymentMethodData: {
    token: string;
    type: string;
  };
}
async function payPartialBalance(data: IPayProps) {
  const response = await network.post(`${v3APIUrl}/purchase/partial-payment`, data);

  return response;
}

interface IScheduleProps {
  userId: number;
  invoiceId: number;
  organizationId: number;
  payments: IPayment[];
  paymentMethodType: string;
  payemntMethodId: string;
}

async function schedulePayments(data: IScheduleProps) {
  const response = await network.post(`${v3APIUrl}/purchase/schedule`, data);
  return response;
}

async function getScheduledPayments(organizationId: number, invoiceId: number, userId: number) {
  const response = await network.get(`${v3APIUrl}/purchase/schedule/${organizationId}/${invoiceId}/${userId}`);
  return response;
}

interface ISetDiscountProps {
  lineItemId: number;
  price: number; // total new price of item, not the amount to reduce
  entitlementGroupId: number; // -1 is for manual discount, otherwise send entitlementGroupId
  description: string;
}

async function setDiscount(data: ISetDiscountProps) {
  const response = await network.post(`${v3APIUrl}/customers/invoice/discount`, data);
  return response;
}

interface IChargeScheduled {
  userId: number;
  invoiceId: number;
  organizationId: number;
}
async function chargeScheduled(data: IChargeScheduled) {
  const response = await network.post(`${v3APIUrl}/purchase/charge-scheduled-remaining`, data);
  return response;
}

interface ICancelScheduled {
  paymentsIds: IPayment[];
}

async function cancelScheduledPayments({ paymentsIds }: ICancelScheduled) {
  const response = await network.deleteMethod(`${v3APIUrl}/purchase/schedule`, { paymentsIds });
  return response;
}

export const paymentApi = {
  getPaymentSecret,
  payPartialBalance,
  paymentMethods,
  schedulePayments,
  getScheduledPayments,
  setDiscount,
  chargeScheduled,
  cancelScheduledPayments,
};

// payPartialBalance = (userId: number, orderId: number, amount: number, organizationId: number) => {
//     const data = {
//       orderId: orderId,
//       amountToPay: amount,
//       organizationId,
//       payingUserId: userId,
//     };

// {
//     "orderId": 1354,
//     "amountToPay": 658,
//     "organizationId": 59,
//     "payingUserId": 64,
//     "paymentMethodData": {
//         "token": "pm_1I97bLEFbijCyGAamCdYj3G0",
//         "type": "card"
//     }
// }
//     return this.http
//       .post<any>(`${environment.CS_URLS.API_ROOT_V3}/purchase/partial-payment`, data)
//       .pipe(map((response) => response));
//   };
