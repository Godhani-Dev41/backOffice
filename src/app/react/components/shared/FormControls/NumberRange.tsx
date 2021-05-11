/** @jsx jsx */
import { required } from "app/react/lib/form";
import { colors } from "app/react/styles/theme";
import { FilledInput, FormControl, FormLabel, Grid } from "@material-ui/core";
import React from "react";
import { jsx, css } from "@emotion/react";
import { Field as FinalField } from "react-final-form";
import { TranslationEn } from "../../../../../assets/i18n/en";

const inputFieldCss = css`
  .MuiFilledInput-input {
    width: 100%;
  }
`;

const labelCss = css`
  font-size: 1.2rem;
  color: ${colors.brandPrimary};
`;

const metaErrorCss = css`
  font-size: 1.2rem;
  color: ${colors.dangerRed};
`;

interface Props {
  controlName: string;
  require: boolean;
  text?: string;
  start: number;
  end: number;
}

const validPositive = (value) => (value < 0 ? "Invalid" : undefined);

const validFromRange = (endValue: number) => (value: string) => {
  return endValue && Number(value) > endValue ? "Inavalid low value" : undefined;
};

const validToRange = (startValue: number) => (value: string) => {
  return startValue && Number(value) < startValue ? "Invalid high value" : undefined;
};

const composeValidators = (...validators) => (value) =>
  validators.reduce((error, validator) => error || validator(value), undefined);

function NumberRange({ controlName, require, text, start, end }: Props) {
  return (
    <Grid container direction="column">
      <Grid item>
        <FormControl>
          <FormLabel css={labelCss}>
            {text} {required ? "*" : ""}
          </FormLabel>
        </FormControl>
      </Grid>
      <Grid item sm={12}>
        <Grid container alignItems="center" direction="row" spacing={1}>
          <Grid item sm={6}>
            <FinalField
              name={controlName + "Start"}
              validate={composeValidators(require ? required : null, validFromRange(end), validPositive)}
              displayEmpty
            >
              {({ input, meta }) => (
                <FormControl fullWidth>
                  <Grid container direction="row" spacing={1}>
                    <Grid item>
                      <FormLabel css={labelCss}>{TranslationEn.memberships.settingsPage.from}</FormLabel>
                    </Grid>
                    <Grid item sm={7}>
                      <FilledInput disableUnderline type="number" css={inputFieldCss} {...input} />
                      {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
                    </Grid>
                  </Grid>
                </FormControl>
              )}
            </FinalField>
          </Grid>
          <Grid item sm={6}>
            <FinalField
              name={controlName + "End"}
              validate={composeValidators(require ? required : null, validToRange(start), validPositive)}
              displayEmpty
            >
              {({ input, meta }) => (
                <FormControl fullWidth>
                  <Grid container direction="row" spacing={1}>
                    <Grid item>
                      <FormLabel css={labelCss}>{TranslationEn.memberships.settingsPage.to}</FormLabel>
                    </Grid>
                    <Grid item sm={7}>
                      <FilledInput disableUnderline type="number" css={inputFieldCss} {...input} />
                      {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
                    </Grid>
                  </Grid>
                </FormControl>
              )}
            </FinalField>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default NumberRange;
