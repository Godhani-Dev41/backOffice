/** @jsx jsx */
import React, { ChangeEvent, useState } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { setOpacity } from "../../../styles/utils";

const containerCss = (focus: boolean, width: number) => css`
  display: flex;
  padding: 1rem;
  border: 1px solid ${focus ? colors.borderPrimary : "transparent"};
  background: ${setOpacity(colors.brandPrimary, 0.04)};
  align-items: center;
  border-radius: 2px;
  width: ${width}px;
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
    &:disabled {
      background: ${setOpacity(colors.brandPrimary, 0.04)};
      color: ${colors.disabled};
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

interface ISearchInput {
  placeholder?: string;
  search?: boolean;
  type?: string;
  onFocus?: () => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  disabled?: boolean;
  width?: number;
}

export const Input = ({
  placeholder,
  search = false,
  width = 250,
  value,
  onChange,
  type = "text",
  disabled = false,
  ...props
}: ISearchInput) => {
  const [focus, setFocus] = useState(false);
  return (
    <div css={containerCss(focus, width)}>
      {search && <ReactSVG css={iconCss} src="assets/media/icons/search.svg" />}
      <input
        {...props}
        value={value == 0 || value == "" ? "" : value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        disabled={disabled}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};
