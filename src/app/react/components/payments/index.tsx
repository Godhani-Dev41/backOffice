/** @jsx jsx */

import React from "react";
import { jsx, css } from "@emotion/react";
import { Charge } from "./Charge";
import { ManageDiscounts } from "./temporals/ManageDiscounts";
import { Discount } from "./Discount";
import { SchedulePayment } from "./Schedule";

const PaymentRequest = () => {
  return <div>payment Request</div>;
};

const Refund = () => {
  return <div>refund</div>;
};

export const usePayments = () => {
  return { Charge, Discount, SchedulePayment, PaymentRequest, Refund, DiscountTemp: ManageDiscounts };
};
