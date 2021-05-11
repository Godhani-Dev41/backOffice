/** @jsx jsx */
import { required } from "app/react/lib/form";
import { colors } from "app/react/styles/theme";
import { FilledInput, FormControl, FormLabel } from "@material-ui/core";
import React from "react";
import { jsx, css } from "@emotion/react";
import { Field as FinalField } from "react-final-form";

const metaErrorCss = css`
  font-size: 1.2rem;
  color: ${colors.dangerRed};
`;

const labelCss = css`
  color: ${colors.brandPrimary};
  font-size: 1.2rem;
`;

const multilineCss = css`
&.MuiInputBase-multiline {
  padding: 0;
}

.MuiFilledInput-inputMultiline {
  padding: 8px;
}
`;


interface Props {
  controlName: string;
  require: boolean;
  text?: string;
  multiline?: boolean;
}

function FreeText({ controlName, require, text, multiline }: Props) {
  return (
    <FinalField name={controlName} validate={require ? required : null} displayEmpty>
      {({ input, meta }) => (
        <FormControl fullWidth>
          <FormLabel css={labelCss}>
            {text} {required ? "*" : ""}
          </FormLabel>
          <FilledInput css={multilineCss} multiline={multiline || false} rows={multiline ? 6 : null} disableUnderline {...input} />
          {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
        </FormControl>
      )}
    </FinalField>
  );
}

export default FreeText;
