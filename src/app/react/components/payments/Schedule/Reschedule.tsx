/** @jsx jsx */

import React, { useState, Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "@app/react/lib/form";
import { CTAButton } from "../../shared/Button/CTAButton";
import { ChargeButtonCss, SecondaryButtonCss } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { paymentApi } from "../../../lib/api/paymentApi";
import { ButtonLoader } from "../../shared/Loader";

const container = css`
  margin: 1rem 2rem 0.5rem 2rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  svg {
    path {
      fill: ${colors.brandPrimary};
    }
  }
  h1 {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
    text-align: center;
    color: ${colors.brandPrimary};
  }
  h2 {
    max-width: 400px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 130%;
    text-align: center;
    color: ${colors.formInputBg};
  }
`;

const buttonContainerCss = css`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  button {
    margin-top: 0.5rem;
  }
`;

export const Reschedule = ({ toggle, payments, setMethod }) => {
  const [loader, setLoader] = useState(false);

  const handleCharge = () => {
    setLoader(true);
    const statusesForCanceling = ["future", "failed"];
    const paymentsIds = payments
      .filter((payment) => statusesForCanceling.includes(payment.status))
      .map((payment) => payment.id);
    paymentApi.cancelScheduledPayments({ paymentsIds }).then((res) => {
      if (res.error) {
        // handle error
        setMethod("error");
      } else {
        setLoader(false);
        setMethod("");
      }
    });
  };

  return (
    <div css={container}>
      <ReactSVG src="assets/media/icons/wallet.svg" />
      <h1>{TranslationEn.customers.paymentsInvoices.schedulePayments}</h1>
      <h2>{TranslationEn.customers.paymentsInvoices.rescheduleWarning}</h2>
      <div css={buttonContainerCss}>
        <CTAButton css={ChargeButtonCss} onClick={handleCharge}>
          {loader ? <ButtonLoader /> : <Fragment>{TranslationEn.customers.paymentsInvoices.schedulePayment}</Fragment>}
        </CTAButton>
        <CTAButton css={SecondaryButtonCss} onClick={() => toggle()}>
          {TranslationEn.memberships.selectPage.cancel}
        </CTAButton>
      </div>
    </div>
  );
};
