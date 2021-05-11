/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { flex } from "../../../styles/utils";

export const SideContainer: FC = ({ children }) => {
  return <div css={flex}>{children}</div>;
};
