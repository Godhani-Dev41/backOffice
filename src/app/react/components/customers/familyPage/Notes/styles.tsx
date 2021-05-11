/** @jsx jsx */
import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../../styles/theme";

export const notesCss = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const headerContainerCss = css`
  display: flex;
  align-items: center;
  span {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 15px;
    margin-left: 5px;
    color: ${colors.formInputBg};
    display: flex;
    align-items: center;
  }
`;
