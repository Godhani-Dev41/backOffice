/** @jsx jsx */
import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { Field } from "react-final-form";
import { flexCol } from "../../../styles/utils";

const containerCss = (focus: boolean) => css`
  display: flex;
  padding: 1rem;
  border: 1px solid ${focus ? colors.borderPrimary : "transparent"};
  background: rgba(13, 71, 116, 0.04);
  align-items: center;
  border-radius: 2px;
  width: 100%;
  input {
    padding: 0 5px;
    width: 100%;
    margin: 0;
    border: none;
    background: transparent;
    color: ${colors.brandPrimary};
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 130%;
    flex-grow: 1;
    &::placeholder {
      color: ${colors.ligntText};
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const iconCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export const withLabelContainer = css`
  ${flexCol};
  margin: 10px 5px;
  width: 100%;

  label {
    font-family: Montserrat;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: ${colors.formInputBg};
  }
`;

const metaErrorCss = css`
  font-size: 1.2rem;
  color: ${colors.dangerRed};
`;

interface ISearchInput {
  placeholder?: string;
  search?: boolean;
  type?: string;
  require?: boolean;

  label?: string;
  credit?: boolean;
  name?: string;
  location?: boolean;
}

export const InputLabel = ({
  label = "",
  name = "",
  type = "string",
  require = false,
  search = false,
  credit = false,
  location = false,
}: ISearchInput) => {
  const [focus, setFocus] = useState(false);
  return (
    <Field
      require={require}
      name={name}
      render={({ input, meta }) => (
        <div css={withLabelContainer}>
          {label && <label>{`${label} ${require ? "*" : ""}`}</label>}
          <div css={containerCss(focus)}>
            {search && <ReactSVG css={iconCss} src="assets/media/icons/search.svg" />}
            {location && <ReactSVG css={iconCss} src="assets/media/icons/location.svg" />}
            {credit && <ReactSVG css={iconCss} src="assets/media/icons/payments/card.svg" />}
            <input {...input} type={type} onBlur={() => setFocus(false)} onFocus={() => setFocus(true)} />
          </div>
          {meta.touched && meta.error && <span css={metaErrorCss}>{meta.error}</span>}
        </div>
      )}
    />
  );
};

/*

    <div css={withLabelContainer}>
      {label && <label>{label}</label>}
      <div css={containerCss}>
        {search && <ReactSVG css={iconCss} src="assets/media/icons/search.svg" />}
        {location && <ReactSVG css={iconCss} src="assets/media/icons/location.svg" />}
        {credit && <ReactSVG css={iconCss} src="assets/media/icons/payments/card.svg" />}
        <input name={name} type="text" placeholder={placeholder} />
      </div>
    </div>

*/
