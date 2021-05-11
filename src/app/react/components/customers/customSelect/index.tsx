/** @jsx jsx */

import React, { useEffect, useState, useRef, Component, ReactElement } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";
import { PopoverComp } from "../../shared/Popover";

const customSelectContainer = css`
  position: relative;
  height: 100%;
  margin-right: 1rem;
`;

const customSelectBody = css`
  display: flex;
  height: 100%;
  background: rgba(13, 71, 116, 0.04);
  align-items: center;
  border-radius: 2px;
  span {
    border-radius: 2px 0px 0px 2px;
    display: flex;
    align-items: center;
    text-align: left;
    padding-left: 10px;
    min-width: 120px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 130%;
    color: ${colors.brandPrimary};
  }
  button {
    border: 0;
    background: #a6bccc;
    border-radius: 0px 2px 2px 0px;
    height: 100%;
    div {
      margin: auto;
      align-items: center;
      justify-content: center;
    }
  }
`;

const selectArrowCss = css`
  height: 20px;
  width: 20px;
  margin: 0;
`;

const optionsContainer = css`
  position: absolute;
  top: 100%;
  width: 100%;
`;

interface CustomSelectProps {
  title: string;
  content?: ReactElement;
}

export const CustomSelect = ({ title, content }: CustomSelectProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const ref = useRef(null);

  return (
    <PopoverComp content={content} open={isOpen} placement="bottom" onClose={() => setOpen(false)} arrow={false}>
      <div ref={ref} css={customSelectContainer}>
        <div css={customSelectBody}>
          <span>{title}</span>
          <button onClick={() => setOpen(true)}>
            {isOpen ? (
              <ReactSVG css={selectArrowCss} src="assets/media/icons/arrow_up.svg" />
            ) : (
              <ReactSVG css={selectArrowCss} src="assets/media/icons/arrow_down.svg" />
            )}
          </button>
        </div>
      </div>
    </PopoverComp>
  );
};
