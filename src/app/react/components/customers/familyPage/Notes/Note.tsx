/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import moment from "moment";
import { ReactSVG } from "react-svg";
import { notesCss, headerContainerCss } from "./styles";
import { INote } from "../../../../types/notes";
import { colors } from "../../../../styles/theme";

const container = css`
  margin: 1rem;
  padding: 1rem 0;
  border-top: 1px solid ${colors.borderPrimary};
`;

const headerContainer = css`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 1rem;
`;

const dateCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  text-align: right;
  color: ${colors.formInputBg};
`;

const contentCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 130%;
  display: flex;
  width: 100%;
  white-space: pre-wrap;
  padding: 0.5rem;
  color: ${colors.brandPrimary};
  word-break: break-all;
`;

export const Note = ({ content, datetime }: INote) => {
  return (
    <div css={container}>
      <div css={headerContainer}>
        <div css={headerContainerCss}>
          <ReactSVG css={notesCss} src="assets/media/icons/customers/header/subtract.svg" />
          <span> Note</span>
        </div>
        <div css={dateCss}>{moment(datetime).format("MMM DD, YYYY")}</div>
      </div>
      <div css={contentCss}>{content}</div>
    </div>
  );
};
