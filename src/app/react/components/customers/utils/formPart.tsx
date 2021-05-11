/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";

interface FormPartProps {
  label: string;
  value: string | number;
  width?: number;
  margin?: number;
}

const formPartCss = (width: number, margin: number) => css`
  display: flex;
  flex-direction: column;
  margin: ${margin}rem;
  padding: 1rem;
  width: ${width}%;
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 1.2rem;
    line-height: 15px;
    text-transform: uppercase;
    color: ${colors.formInputBg};
  }
  div {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 130%;
    color: ${colors.brandPrimary};
  }
`;

export const FormPart = ({ label, value, width = 25, margin = 2 }: FormPartProps) => {
  return (
    <React.Fragment>
      <div css={formPartCss(width, margin)}>
        <label>{label}</label>
        <div>{value}</div>
      </div>
    </React.Fragment>
  );
};
