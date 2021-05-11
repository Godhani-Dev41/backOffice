/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";

const CustomerNameTitle = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 24px;
  margin: 0;
  margin-right: 1rem;
  color: ${colors.brandPrimary};
`;

export const HeaderTitle: FC = ({ children }) => {
  return <h1 css={CustomerNameTitle}>{children}</h1>;
};
