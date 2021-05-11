/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { customerHeaderContainer } from "../../../styles/utils";

export const HeaderContainer: FC = ({ children }) => {
  return <div css={customerHeaderContainer}>{children}</div>;
};
