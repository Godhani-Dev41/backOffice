/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";

const clockIconCss = css`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const dateCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.ligntText};
  display: flex;
  align-items: center;
`;

export const ClockLabel: FC = ({ children }) => {
  return (
    <div css={dateCss}>
      <ReactSVG css={clockIconCss} src="assets/media/icons/customers/header/clock.svg" />
      {children}
    </div>
  );
};
