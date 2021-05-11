/** @jsx jsx */

import React, { FC, HTMLProps, useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const container = (active: boolean) => css`
  border: 1px solid ${active ? colors.brandPrimary : colors.borderPrimary};
  border-radius: 2px;
  background: none;
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 5px;
  font-size: 1.4rem;
  line-height: 1.5rem;
  color: ${colors.brandPrimary};
  &:hover {
    background: ${colors.lightGray};
  }
`;
interface Props {
  active?: boolean;
  onClick: () => void;
}
export const CheckboxButton: FC<Props> = ({ children, active = false, ...props }) => {
  return (
    <button css={container(active)} {...props}>
      {children}
    </button>
  );
};
