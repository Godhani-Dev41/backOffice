/** @jsx jsx */

import React from "react";
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

const iconBackCss = css`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface Props {
  to: string;
}

export const BackButton = ({ to = "/" }) => {
  return (
    <Link to={to}>
      <div>
        <ReactSVG css={iconBackCss} src="assets/media/icons/customers/header/back.svg" />
      </div>
    </Link>
  );
};
