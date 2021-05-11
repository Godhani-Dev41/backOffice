/** @jsx jsx */

import React, { FC, Fragment, useEffect } from "react";
import { jsx, css } from "@emotion/react";

const backroundCss = css`
  position: fixed;
  z-index: 2001;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.5;
`;
export const Background = ({ ...props }) => {
  return <div css={backroundCss} {...props} />;
};
