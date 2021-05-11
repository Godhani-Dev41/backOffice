/** @jsx jsx */

import * as React from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";

const addButton = css`
  padding: 0.6rem 0.75rem;
  border: 1px solid ${colors.ligntText};
  box-sizing: border-box;
  border-radius: 3px;
  background: transparent;
  color: ${colors.formInputBg};
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 1.4rem;
  margin-left: 10px;
  text-align: center;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    border: 1px solid ${colors.formInputBg};
  }
  &:disabled {
    background: ${colors.formControlBg};
    box-shadow: none;
    color: ${colors.disabled};
    border: none;
  }
`;

export const CTAButton = ({ children, ...rest }) => (
  <button css={addButton} {...rest}>
    {children}
  </button>
);
