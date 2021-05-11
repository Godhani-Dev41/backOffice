/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { PaymentMethodBox } from "../utils";
import { CTAButton } from "../../shared/Button/CTAButton";
import { PaymentMethodTypeEnum } from "../../../types/payment";
import { flex, flexCol, flexEndCss, ChargeButtonCss, setOpacity } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";
import { TranslationEn } from "assets/i18n/en";

const labelCss = css`
  font-size: 1.2rem;
  line-height: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${colors.formInputBg};
  text-align: left;
  width: 100%;
`;

const sectionCss = css`
  ${flexCol};
  //   margin: 0.5rem 0;
  padding: 2rem;
  justify-content: center;
  align-items: center;
`;

const inputContainerCss = css`
  background: ${setOpacity(colors.brandPrimary, 0.04)};
  border: 1px solid ${colors.borderPrimary};
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
  ${flex};
  align-items: center;
  border-radius: 2px;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input {
    border: none;
    background: transparent;
    width: 100%;
    color: ${colors.brandPrimary};
  }
`;

const iconCss = css`
  div {
    display: flex;
    align-items: center;
  }
`;

export const SelectMethod = ({ amount, setAmount, method, setMethod, totalAmount, isAmountEditable }: any) => {
  return (
    <React.Fragment>
      {isAmountEditable && (
        <div css={sectionCss}>
          <label css={labelCss}>{TranslationEn.payments.howMuchToCharge}</label>
          <div css={inputContainerCss}>
            <ReactSVG src={`assets/media/icons/payments/dollar.svg`} css={iconCss} />
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder={totalAmount} />
          </div>
        </div>
      )}

      <div css={sectionCss}>
        <label css={labelCss}>{TranslationEn.payments.whichPaymentMethod}</label>
        <div css={flex}>
          {/* {Object.keys(PaymentMethodTypeEnum).map((paymentMethod, index) => {
            return (
              <PaymentMethodBox
                isFirst={index === 0}
                key={index}
                handleClick={setMethod}
                method={PaymentMethodTypeEnum[paymentMethod]}
                active={method === PaymentMethodTypeEnum[paymentMethod]}
              />
            );
          })} */}
          <PaymentMethodBox isFirst={true} handleClick={setMethod} method={"card"} active={method === "card"} />
          <PaymentMethodBox isFirst={false} handleClick={setMethod} method={"cash"} active={method === "cash"} />
          <PaymentMethodBox isFirst={false} handleClick={setMethod} method={"check"} active={method === "check"} />
        </div>
      </div>
    </React.Fragment>
  );
};
