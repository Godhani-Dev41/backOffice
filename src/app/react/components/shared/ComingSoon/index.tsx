/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../Modal";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../../../styles/theme";

const container = css`
  padding: 8rem;
  font-size: 2rem;
  font-family:"Montserrat";
  color:${colors.brandPrimary};
  font-weight:bold;
}
`;

export const useComingSoonPopUp = () => {
  const { toggle: ComingSoonToggle, isShowing: isComingSoonShowing } = useModal();

  const ComingSoonModal = () => {
    return (
      <Modal isShowing={isComingSoonShowing} toggle={ComingSoonToggle}>
        <div css={container}>{TranslationEn.comingSoon}</div>
      </Modal>
    );
  };

  return { ComingSoonToggle, isComingSoonShowing, ComingSoonModal };
};
