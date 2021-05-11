/** @jsx jsx */
import React from "react";
import { Field as FinalField } from "react-final-form";
import { FormControl, FormLabel, MenuItem, Select } from "@material-ui/core";
import { jsx, css } from "@emotion/react";
import { colors } from "app/react/styles/theme";
import { setOpacity } from "app/react/styles/utils";
import { required } from "app/react/lib/form";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const fullWidthControlCss = css`
  width: 100%;
`;

const metaErrorCss = css`
  font-size: 1.2rem;
  color: ${colors.dangerRed};
`;

const labelCss = css`
  // color: ${colors.brandPrimary};
  // font-size: 1.2rem;
  font-family: Montserrat;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
`;

const userInputBgCss = css`
  background-color: ${colors.formControlBg};
  .MuiSelect-icon {
    background-color: ${setOpacity(colors.brandPrimary, 0.37)};
    top: 0;
    height: 100%;
    color: ${colors.white};
    width: 30px;
    border-radius: 2px;
  }
  &.MuiInput-formControl {
    margin-top: 0;
  }
  .MuiSelect-root {
    padding: 9px 24px 9px 12px;
  }
`;

export interface MenuOptions {
  text: string;
  value: number | string;
}

interface Props {
  controlName: string;
  require: boolean;
  menuOptions: MenuOptions[];
  text?: string;
}

function SelectTextInput({ controlName, require, menuOptions, text }: Props) {
  return (
    <FinalField name={controlName} validate={require ? required : null} displayEmpty>
      {({ input, meta }) => (
        <FormControl css={fullWidthControlCss}>
          {text && (
            <FormLabel css={labelCss}>
              {text} {require ? "*" : ""}
            </FormLabel>
          )}
          <Select
            labelId={controlName}
            id={controlName}
            displayEmpty
            disableUnderline
            IconComponent={ExpandMoreIcon}
            css={userInputBgCss}
            {...input}
          >
            {menuOptions.map((value, key) => (
              <MenuItem key={key} value={value.value}>
                {value.text}
              </MenuItem>
            ))}
          </Select>
          {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
        </FormControl>
      )}
    </FinalField>
  );
}

export default SelectTextInput;
