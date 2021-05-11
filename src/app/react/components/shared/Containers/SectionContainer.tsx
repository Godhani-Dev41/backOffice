/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";

const container = css`
  display: flex;
  flex-direction: column;
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.5rem;
    text-transform: uppercase;
    color: ${colors.brandPrimary};
  }
  .section-body {
    position: relative;
    border-radius: 4px;
    margin: 1rem 0 2rem 0;
    border: 1px solid ${colors.borderPrimary};
  }
`;

interface Props {
  label: string;
}

export const SectionContainer: FC<Props> = ({ label, children }) => {
  return (
    <div css={container}>
      <label>{label}</label>
      <div className="section-body">{children}</div>
    </div>
  );
};
