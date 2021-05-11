/** @jsx jsx */
import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Overview } from "./Overview";
import { Memebership } from "./Membership";
import { jsx, css } from "@emotion/react";
import { TCustomer } from "../../../../types/customers";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { Invoices } from "./Invoices";
import { Payments } from "./Payments";
// in progress to add costumer state interface
interface BodyProps {
  type: string;
  customerState: TCustomer;
  customersService: CustomersService;
}

const comingSoonContainer = css`
  display: flex;
  margin-top: 5rem;
  width: 100%;
  text-align: center;
  justify-content: center;
`;

export const BodyMapper = ({ type, customerState, customersService }: BodyProps) => {
  const location = useLocation();
  switch (type) {
    case "overview":
      return <Overview customerState={customerState} />;
    case "invoices":
      return <Invoices customerState={customerState} customersService={customersService} />;
    case "payments":
      return <Payments customerState={customerState} customersService={customersService} />;
    // case "membership":
    //   return <Memebership />;
    case undefined:
      return (
        <Redirect
          to={`${location.pathname}${location.pathname[location.pathname.length - 1] === "/" ? "" : "/"}overview`}
        />
      );
    // case "refunds":
    //   return <div>{type}</div>;
    // case "reservation":
    //   return <div>{type}</div>;
    // case "activity":
    //   return <div>{type}</div>;
    // case "food":
    //   return <div>{type}</div>;
    // case "equipment":
    //   return <div>{type}</div>;
    default:
      return <div css={comingSoonContainer}> Coming Soon </div>;
  }
};
