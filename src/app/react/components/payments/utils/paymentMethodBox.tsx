/** @jsx jsx */

import React from "react";
import { jsx, css } from "@emotion/react";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";

type TPaymentMethodTemporal = "ach" | "card";

interface Props {
  method: string;
  handleClick?: (method: TPaymentMethodTemporal | string) => void;
  active?: boolean;
  isFirst?: boolean;
}

const container = (isActive: boolean, isFirst: boolean) => css`
  background: ${colors.lightGray};
  border: 1px solid ${isActive ? colors.brandPrimary : colors.borderPrimary};
  margin-left: ${isFirst ? "0" : ".5rem"};
  display: flex;
  padding: 2rem;
  flex-direction: column;
  justify-content: center;
  width: 150px;
  box-sizing: border-box;
  border-radius: 3px;
  text-align: center;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 1.7rem;
  text-align: center;
  cursor: pointer;
  color: ${colors.brandPrimary};
  &:hover {
    background: ${colors.formControlBg};
  }
`;

const iconCss = css``;

export const PaymentMethodBox = ({ method, handleClick, active, isFirst = false }: Props) => {
  return (
    <div css={container(active, isFirst)} onClick={() => handleClick(method)}>
      <ReactSVG src={`assets/media/icons/payments/${method}.svg`} css={iconCss} />
      <div>{TranslationEn.payments.methods[method]}</div>
    </div>
  );
};
