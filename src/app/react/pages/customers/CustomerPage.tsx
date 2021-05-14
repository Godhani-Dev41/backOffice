/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams, useHistory } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { colors } from "../../styles/theme";
import { CustomerHeader, Tabs, BodyMapper } from "../../components/customers/customerPage";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { TCustomer } from "@app/react/types/customers";
import { TranslationEn } from "../../../../assets/i18n/en";

const containerCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

interface Props {
  organization: RCOrganization;
  customersService: CustomersService;
}

interface paramsProps {
  id: string;
  tab?: string;
}
const tabs = [
  {
    title: TranslationEn.customers.tabs.overview,
    link: "overview",
  },
  {
    title: TranslationEn.customers.tabs.membership,
    link: "membership",
  },
  {
    title: TranslationEn.customers.tabs.invoices,
    link: "invoices",
  },
  {
    title: TranslationEn.customers.tabs.payments,
    link: "payments",
  },
  {
    title: TranslationEn.customers.tabs.reservation,
    link: "reservation",
  },
  {
    title: TranslationEn.customers.tabs.activity,
    link: "activity",
  },
  {
    title: TranslationEn.customers.tabs.food,
    link: "food",
  },
  {
    title: TranslationEn.customers.tabs.equipment,
    link: "equipment",
  },
];
export const CustomerPage = ({ organization, customersService }: Props) => {
  const { id, tab } = useParams<paramsProps>();
  const [customerState, setCustomerState] = useState<TCustomer>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const data = await customersService.getCustomerById(Number(organization.id), id).toPromise();
      setCustomerState(data.data);
      setLoading(false);
    })();
  }, []);

  return (
    <div css={containerCss}>
      {isLoading ? (
        "is loading..."
      ) : (
        <React.Fragment>
          <CustomerHeader customerState={customerState} />
          <Tabs tabs={tabs} id={id} />
          <BodyMapper type={tab} customersService={customersService} customerState={customerState} />
        </React.Fragment>
      )}
    </div>
  );
};
