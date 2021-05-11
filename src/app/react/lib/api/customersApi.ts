import { MediaUpload } from "./../../types/media";
import { MembershipMember } from "./../../types/membershipMember";
import { Membership, CreateMembershipDto, UpdateMembrshipDto } from "../../types/membership";
import { GetPaymentsResponse, PaymentMethod } from "../../types/payment";
import { environment } from "environments/environment";
import { network } from "../network";

const v3APIUrl = `${environment.CS_URLS.API_ROOT_V3}`;

const temporal_url = `${environment.CS_URLS.API_ROOT}/organizations`;

async function getCustomersByOrganization(organizationId: number): Promise<Membership> {
  const response = await network.get(
    `${v3APIUrl}/orgCustomers/organizations/${organizationId}/customers?limit=10000000`,
  );
  return response;
}

async function getPaymentsByCustomer(customerId: number, page: number): Promise<GetPaymentsResponse> {
  if (!page) {
    page = 1;
  }
  const response = await network.get(`${v3APIUrl}/payments/${customerId}/payments?itemsPerPage=10&page=${page}`);
  return response;
}

async function getPaymentSecret(userId: number) {
  const response = await network.get(`${v3APIUrl}/purchase/${userId}/clientSecret`);

  return response.client_secret;
}

async function paymentMethods(userId: number): Promise<PaymentMethod[]> {
  const response = await network.get(`${v3APIUrl}/purchase/${userId}/paymentMethods`);

  return response;
}

const getCustomerByUserId = async (organizationId: number, userId: number) => {
  const response = await network.get(
    `${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/customers/user/${userId}`,
  );
  return response;
};

const getInvoiceById = async (customerId: number, invoiceId: number) => {
  const response = await network.get(
    `${environment.CS_URLS.API_ROOT_V3}/customers/${customerId}/invoices/${invoiceId}`,
  );
  return response;
};

export const customersApi = {
  getCustomersByOrganization,
  getPaymentsByCustomer,
  getPaymentSecret,
  paymentMethods,
  getCustomerByUserId,
  getInvoiceById,
};
