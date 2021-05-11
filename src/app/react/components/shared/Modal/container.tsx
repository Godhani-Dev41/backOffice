/** @jsx jsx */

import React, { FC, Fragment, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";

const modalContainerCss = (padding: string) => css`
  position: fixed;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  // width: 100%;
  padding: ${padding ? padding + "rem" : "1rem"};
  overflow-y: auto;
  background: ${colors.white};
  z-index: 2002;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 80%;
  max-width: 60%;
`;

const closeButtonCss = css`
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  border-radius: 200px;
  padding: 0.25rem;
  outline: none;
  border: 0;
  background: transparent;
  &:focus {
    outline: none;
  }
  &:hover {
    background: ${colors.disabled};
  }
`;

const iconCss = css`
  div {
    display: flex;
    align-items: center;
  }
`;

interface Props {
  toggle: () => void;
  background?: string;
  showButton?: boolean;
  maxWidth?: string;
  padding?: number;
}

export const Container: FC<Props> = ({
  children,
  showButton = true,
  toggle,
  background,
  padding,
  maxWidth,
  ...props
}) => {
  return (
    <div {...props} css={modalContainerCss(String(padding))}>
      {showButton && (
        <button onClick={toggle} css={closeButtonCss}>
          <ReactSVG src={`assets/media/icons/close.svg`} css={iconCss} />
        </button>
      )}
      {children}
    </div>
  );
};
