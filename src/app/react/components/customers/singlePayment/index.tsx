/** @jsx jsx */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { Header } from "./Header";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { TCustomer } from "@app/react/types/customers";
import { Info } from "../utils/BillingInfo";
import { Table } from "../../shared/Table";
import { colors } from "../../../styles/theme";
import { flexCol } from "../../../styles/utils";
import { Pricify, capitalize } from "../../../lib/form";
import { MiddleWhiteContainer, SectionContainer } from "../../shared/Containers";
import { TranslationEn } from "assets/i18n/en";

const containerCss = css`
  ${flexCol};
  height: 100%;
`;

const methodContainerCss = css`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 130%;
  color: ${colors.brandPrimary};
`;

interface Props {
  customersService: CustomersService;
  organization: RCOrganization;
}

interface IPayment {
  updatedAt: string;
  price: number;
  paymentType: string;
}

export const SinglePayment = ({ organization, customersService }: Props) => {
  const { customerId, paymentId } = useParams();
  const [paymentState, setPaymentState] = useState<IPayment>();
  const [customerState, setCustomerState] = useState<TCustomer>();
  const [paymentsRows, setPaymentsRows] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customersService
      .getPaymentById(Number(customerId) || 1, Number(paymentId))
      .toPromise()
      .then((data) => {
        customersService
          .getCustomerByUserId(organization.id, data.payingUserId)
          .toPromise()
          .then((res) => {
            if (res.data) {
              setCustomerState(res.data);
              setLoading(false);
            }
          });
        setPaymentState(data);
        setPaymentsRows(
          data.orderToInvoices.map((invoice) => {
            const newRow = {
              description: `${TranslationEn.customers.paymentsInvoices.invoice} ${invoice.order.id}`,
              amount: invoice.order.price,
              total: invoice.order.paidAmount,
            };
            return newRow;
          }),
        );
      });
  }, []);

  const paymentColumns = [
    {
      id: "description",
      label: TranslationEn.memberships.detailsPage.description,
      type: "string",
    },
    {
      id: "amount",
      label: TranslationEn.customers.paymentsInvoices.amount,
      type: "currency",
    },
    {
      id: "total",
      label: TranslationEn.customers.paymentsInvoices.totalRecieved,
      type: "currency",
    },
  ];

  if (loading) {
    return <div>{TranslationEn.isLoading}</div>;
  }
  return (
    <div css={containerCss}>
      <Header paymentState={paymentState} />
      <MiddleWhiteContainer>
        <SectionContainer label={TranslationEn.customers.paymentsInvoices.info}>
          <Info
            label={TranslationEn.customers.paymentsInvoices.paymentInfo}
            paymentState={paymentState}
            customerState={customerState}
          />
        </SectionContainer>
        <SectionContainer label={TranslationEn.customers.paymentsInvoices.paymentDetails}>
          <Table rows={paymentsRows} columns={paymentColumns} isHoverRow={false} pagination={false} />
        </SectionContainer>

        <SectionContainer label={TranslationEn.customers.paymentsInvoices.paymentMethod}>
          <div css={methodContainerCss}>
            <div>{capitalize(paymentState.paymentType)}</div>
            <div>{Pricify(paymentState.price)}</div>
          </div>
        </SectionContainer>
      </MiddleWhiteContainer>
    </div>
  );
};

// /v3/customers/176/invoices/1205
// /v3/customers/176/payments/286
