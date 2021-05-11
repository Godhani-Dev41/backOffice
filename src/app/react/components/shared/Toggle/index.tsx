/** @jsx jsx */

import React, { useState, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";

const toggleContainer = css`
  position: relative;
  margin-right: 1rem;
`;

const toggleBackground = css`
  display: block;

  width: 36px;
  height: 20px;

  border: 1px solid #e2e2e2;
  background: rgba(13, 71, 116, 0.04);
  border-radius: 100px;
`;

const toggleCircle = (isPressed: boolean) => css`
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  top: 2px;
  left: 2px;
  border-radius: 100px;
  cursor: pointer;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  margin-left: ${isPressed ? "16px" : "0"};
  background: ${isPressed ? "#0D4774" : "#7C9CB4"};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const iconCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Toggle = ({ isPressed, setPressed }) => {
  return (
    <div css={toggleContainer}>
      <span css={toggleBackground}></span>
      <span onClick={() => setPressed(!isPressed)} css={toggleCircle(isPressed)}>
        {isPressed && <ReactSVG src="assets/media/icons/whitecheck.svg" css={iconCss} />}
      </span>
    </div>
  );
};
