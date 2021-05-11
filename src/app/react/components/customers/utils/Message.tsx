/** @jsx jsx */

import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";

const messageContainer = (type: string) => css`
  background: ${type === "cta" ? colors.brandPrimary : colors.statusBlue};
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;
  color: white;
  width: 100%;
  box-shadow: 0px -2px 24px rgba(21, 93, 148, 0.15);
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.4rem;
  line-height: 130%;
  display: flex;
  align-items: start;
  position: relative;
`;

const closeButtonCss = css`
  background: transparent;
  border: none;
  outline: none;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
  height: 25px;
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 100px;
  }
`;

const icosCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const infoContainer = css`
  margin-right: 10px;
`;

interface IMessageProps {
  type: string;
  isClosable?: boolean;
}

export const Message: FC<IMessageProps> = ({ type, isClosable = false, children }) => {
  return (
    <div css={messageContainer(type)}>
      <div css={infoContainer}>
        <ReactSVG src="assets/media/icons/customers/info.svg" />
      </div>
      {children}
      {isClosable && (
        <button css={closeButtonCss}>
          <ReactSVG css={icosCss} src="assets/media/icons/customers/close.svg" />
        </button>
      )}
    </div>
  );
};
