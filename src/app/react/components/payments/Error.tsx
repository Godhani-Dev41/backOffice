/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { CTAButton } from "../shared/Button/CTAButton";
import { SecondaryButtonCss, ChargeButtonCss } from "../../styles/utils";
import { colors } from "../../styles/theme";
import { TranslationEn } from "assets/i18n/en";

const container = css`
  margin: 0 3rem;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat";
  text-align: center;
  h1 {
    color: ${colors.brandPrimary};
    margin: 0.5rem 0;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
  }
  h2 {
    font-size: 1.4rem;
    line-height: 130%;
    text-align: center;
    color: ${colors.formInputBg};
    margin: 0.5rem 0 3rem 0;
  }
`;

const error = css`
  color: red;
`;

const buttomButton = css`
  ${SecondaryButtonCss};
  margin-top: 1rem;
`;

export const Error = ({ toggle, message }: { toggle: () => void; message?: string }) => {
  return (
    <div css={container}>
      <ReactSVG src="assets/media/icons/conflict.svg" />
      <h1>{TranslationEn.errors.somethingWentWrong}</h1>
      <h2>
        {TranslationEn.errors.chargeCouldntBeCompleted}
        {message ? <div css={error}>{message}</div> : ""}
        <br />
        {TranslationEn.errors.tryLater}
      </h2>
      <CTAButton onClick={() => toggle()} css={ChargeButtonCss}>
        {TranslationEn.errors.approve}
      </CTAButton>
      <CTAButton onClick={() => toggle()} css={buttomButton}>
        {TranslationEn.memberships.selectPage.cancel}
      </CTAButton>
    </div>
  );
};
