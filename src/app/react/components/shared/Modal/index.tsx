/** @jsx jsx */

import React, { FC, Fragment, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import ReactDOM from "react-dom";

import { Container } from "./container";
import { Background } from "./background";

interface ModalProps {
  isShowing: boolean;
  toggle: () => void;
  padding?: number;
  showButton?: boolean;
  isDismissable?: boolean;
}

export const Modal: FC<ModalProps> = ({
  showButton = true,
  isShowing,
  toggle,
  children,
  padding = 1,
  isDismissable = true,
}) => {
  useEffect(() => {
    let body = document.querySelectorAll("BODY")[0] as HTMLElement;
    if (isShowing) {
      body.style.overflowY = "hidden";
    } else {
      body.style.overflowY = "auto";
    }
  }, [isShowing]);

  return isShowing
    ? ReactDOM.createPortal(
        <Fragment>
          <Background onClick={() => (isDismissable ? toggle() : undefined)} />
          <Container showButton={showButton} padding={padding} toggle={toggle}>
            {children}
          </Container>
        </Fragment>,
        document.body,
      )
    : null;
};
