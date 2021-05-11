/** @jsx jsx */

import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/react";
import { flex } from "../../../styles/utils";
import { colors } from "../../../styles/theme";

const buttonCss = css`
  ${flex};
  align-items: center;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 1.7rem;
  justify-content: center;
  color: ${colors.formInputBg};
  &:hover {
    svg {
      fill: ${colors.brandPrimary};
    }
    path {
      fill: ${colors.brandPrimary};
    }
    color: ${colors.brandPrimary};
  }
`;

interface Props {
  onClick?: () => void;
}

export const SimpleButton: FC<Props> = ({ children, onClick, ...props }) => {
  return (
    <button css={buttonCss} onClick={onClick} {...props}>
      {children}
    </button>
  );
};
