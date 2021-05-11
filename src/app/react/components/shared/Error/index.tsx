/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../Modal";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";

const container = css`
  margin: 0 3rem;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat";
  text-align: center;
  h1 {
    color: ${colors.brandPrimary};
    margin: 0.5rem 0;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
  }
  h2 {
    font-size: 1.4rem;
    line-height: 130%;
    text-align: center;
    color: ${colors.formInputBg};
    margin: 0.5rem 0 3rem 0;
  }
`;

export const useErrorModal = () => {
  const { toggle: ErrorToggle, isShowing: isErrorModalShowing } = useModal();

  const ErrorModal = () => {
    return (
      <Modal showButton={false} isShowing={isErrorModalShowing} toggle={() => {}}>
        <div css={container}>
          <ReactSVG src="assets/media/icons/conflict.svg" />
          <h1>{TranslationEn.errors.somethingWentWrong}</h1>
          <h2>
            {TranslationEn.errors.refresh}
            <br />
            {TranslationEn.errors.tryLater}
          </h2>
        </div>
      </Modal>
    );
  };

  return { ErrorToggle, isErrorModalShowing, ErrorModal };
};
