/** @jsx jsx */

import React, { FC, useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { CheckboxButton, SimpleButton } from "../utils";
import { flexCol, flex } from "../../../styles/utils";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { TranslationEn } from "assets/i18n/en";
import { PaymentMethod } from "../../../types/payment";
import { paymentApi } from "../../../lib/api/paymentApi";
import { useModal } from "@app/react/hooks/useModal";

const ContainerCss = css`
  ${flexCol};
  padding: 2rem 10rem;
  justify-content: center;
  align-items: center;
`;

const wrapContainerCss = css`
  ${flex};
  max-width: 300px;
  flex-wrap: wrap;
  justify-content: center;
`;

const topPartCss = css`
  ${flexCol};
  margin: 0;
`;

const iconCss = css`
  margin-right: 0.5rem;
  div {
    display: flex;
    justify-content: center;
    aling-items: center;
  }
`;

const middleCss = css`
  color: ${colors.ligntText};
  font-size: 1.2rem;
  line-height: 1.5rem;
  margin-top: 1rem;
`;

const primeryTitle = css`
  font-size: 1.4rem;
  line-height: 130%;
  text-align: center;
  color: ${colors.brandPrimary};
`;

export const Bank = ({ userId, selectedCard, setSelectedCard }) => {
  const [bankAccounts, setBankAccounts] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    paymentApi.paymentMethods(userId).then((res) => {
      setBankAccounts(
        res.filter((paymentMethod) => {
          if (paymentMethod.type === "ach") {
            return paymentMethod;
          }
        }),
      );
    });
  }, []);
  return (
    <div css={ContainerCss}>
      {bankAccounts.length !== 0 && (
        <React.Fragment>
          <div css={topPartCss}>
            <div css={primeryTitle}>{TranslationEn.payments.useExisiting}</div>
            <div css={wrapContainerCss}>
              {bankAccounts.map((bank, index) => {
                return (
                  <CheckboxButton
                    key={index}
                    onClick={() => setSelectedCard(bank.id)}
                    active={selectedCard === bank.id}
                  >
                    <ReactSVG src={`assets/media/icons/payments/ach.svg`} css={iconCss} />
                    {bank.billing_details.name}
                  </CheckboxButton>
                );
              })}
            </div>
          </div>
          <div css={middleCss}>{TranslationEn.payments.or}</div>
        </React.Fragment>
      )}
      <div css={topPartCss}>
        <SimpleButton>
          <ReactSVG src={`assets/media/icons/edit.svg`} css={iconCss} />
          {TranslationEn.payments.enterManually}
        </SimpleButton>
      </div>
    </div>
  );
};
