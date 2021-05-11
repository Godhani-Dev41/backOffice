/** @jsx jsx */
import React, { ReactElement } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { CTAButton } from "../../shared/Button/CTAButton";

const frameContainerCss = css`
  background: white;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  padding: 1rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const titleCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 20px;
  margin: 0;
  text-transform: uppercase;
  color: ${colors.brandPrimary};
`;

const headerCss = css`
  display: flex;
  margin: 1rem 0;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dae6f0;
`;

interface Props {
  title: string;
  button?: ReactElement;
}

export const FrameContainer: React.FC<Props> = ({ children, title, button }) => {
  return (
    <div css={frameContainerCss}>
      <div css={headerCss}>
        <h1 css={titleCss}>{title}</h1>
        {button}
      </div>
      <div>{children}</div>
    </div>
  );
};
