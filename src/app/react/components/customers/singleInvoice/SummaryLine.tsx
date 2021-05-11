/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { flex } from "../../../styles/utils";

const flexBetweenCss = css`
  ${flex};
  justify-content: space-between;
`;

const detailsSummaryCss = (fontSize: number, weight: number | string, sub: boolean) => css`
  ${flexBetweenCss};
  font-family: Montserrat;
  font-style: normal;
  font-weight: ${weight};
  font-size: ${fontSize}rem;
  line-height: 1.5rem;
  margin: 0.5rem 0;
  color: ${sub ? colors.formInputBg : colors.brandPrimary};
`;

export const SummaryLine = ({ sub = false, label, value, weight = 400, fontSize = 1.2 }) => {
  return (
    <div css={detailsSummaryCss(fontSize, weight, sub)}>
      <div>{label}</div>
      <div>{value}</div>
    </div>
  );
};
