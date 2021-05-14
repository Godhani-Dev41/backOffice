/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { NavLink, Link, useParams, useHistory } from "react-router-dom";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { TCustomer } from "@app/react/types/customers";
import { Tabs } from "../../components/customers/customerPage";
import { FamilyHeader, BodyMapper } from "../../components/customers/familyPage";

interface IFamilyPage {
  organization: RCOrganization;
  customersService: CustomersService;
}

interface IparamsProps {
  id: string;
  tab?: string;
}

const containerCss = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const tabs = [
  {
    title: "Overview",
    link: "overview",
  },
  {
    title: "Membership",
    link: "membership",
  },
  {
    title: "Invoices",
    link: "invoices",
  },
  {
    title: "Payments",
    link: "payments",
  },

  {
    title: "Refunds",
    link: "refunds",
  },
  {
    title: "Reservation",
    link: "reservation",
  },
  {
    title: "Activity",
    link: "activity",
  },
  {
    title: "Food & Beverage",
    link: "food",
  },
  {
    title: "Equipment",
    link: "equipment",
  },
];

export const FamilyPage = ({ organization, customersService }: IFamilyPage) => {
  const { id, tab } = useParams<IparamsProps>();
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
          <FamilyHeader customerState={customerState} />
          <Tabs tabs={tabs} id={id} />
          <BodyMapper type={tab} customerState={customerState} customersService={customersService} />
        </React.Fragment>
      )}
    </div>
  );
};
