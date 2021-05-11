/** @jsx jsx */

import React from "react";
import { css, jsx } from "@emotion/react";
import { flexEndCss, ChargeButtonCss } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { TranslationEn } from "assets/i18n/en";
import { CTAButton } from "../../shared/Button/CTAButton";
import { ButtonLoader } from "../../shared/Loader";

const bottomCss = css`
  ${flexEndCss};
  margin-top: 1rem;
  border-top: 1px solid ${colors.borderSeperator};
  padding: 1rem;
`;

interface Props {
  toggle: () => void;
  disabled: boolean;
  loader: boolean;
  submitButtonText: string;
  onSubmit?: () => void;
}

export const Footer = ({ toggle, disabled = false, loader, submitButtonText, onSubmit = () => {} }: Props) => {
  return (
    <div css={bottomCss}>
      <CTAButton onClick={toggle}>{TranslationEn.memberships.selectPage.cancel}</CTAButton>
      <CTAButton
        onClick={() => {
          if (onSubmit) {
            onSubmit();
          }
        }}
        type="submit"
        css={ChargeButtonCss}
        disabled={disabled}
      >
        {loader ? <ButtonLoader /> : <React.Fragment>{submitButtonText}</React.Fragment>}
      </CTAButton>
    </div>
  );
};
