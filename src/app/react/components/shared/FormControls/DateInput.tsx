/** @jsx jsx */
import React from "react";

import { setOpacity } from "app/react/styles/utils";
import { jsx, css } from "@emotion/react";
import { Field as FinalField, FieldMetaState, FieldRenderProps } from "react-final-form";
import { KeyboardDatePicker, KeyboardDatePickerProps } from "@material-ui/pickers";
import { FormControl, FormLabel } from "@material-ui/core";
import { colors } from "app/react/styles/theme";

const dateControlCss = css`
  .MuiInput-root {
    height: 36px;
    background-color: ${setOpacity(colors.formInputBg, 0.04)};
    border-radius: 2px;
  }
`;

const formControlCss = css`
  &.MuiFormControl-root {
    width: 100%;
  }
`;

const formLabelCss = css`
  font-family: Montserrat;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
`;

type DatePickerWrapperProps = FieldRenderProps<KeyboardDatePickerProps>;

interface ShowErrorProps {
  meta: FieldMetaState<never>;
}

type ShowErrorFunc = (props: ShowErrorProps) => boolean;

const showErrorOnChange: ShowErrorFunc = ({
  meta: { submitError, dirtySinceLastSubmit, error, touched, modified },
}: ShowErrorProps) => Boolean(((submitError && !dirtySinceLastSubmit) || error) && (touched || modified));

function KeyboardDatePickerWrapper(props: DatePickerWrapperProps) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    showError = showErrorOnChange,
    ...rest
  } = props;

  const { error, submitError } = meta;
  const isError = showError({ meta });

  const { helperText, ...lessrest } = rest;

  return (
    <KeyboardDatePicker
      disableToolbar
      fullWidth
      autoOk
      helperText={isError ? error || submitError : helperText}
      error={isError}
      onChange={onChange}
      name={name}
      variant={props.variant}
      value={value || null}
      inputProps={restInput}
      format="MM/dd/yyyy"
      InputProps={{
        disableUnderline: true,
      }}
      {...lessrest}
    />
  );
}

interface Props {
  name: string;
  title: string;
  isMandatory?: boolean;
  variant?: string;
}

export default function ({ name, title, isMandatory = true, variant = "dialog" }: Props) {
  return (
    <FinalField
      name={name}
      render={(fieldRenderProps) => (
        <FormControl css={formControlCss}>
          <FormLabel css={formLabelCss}>{`${title} ${isMandatory && "*"}`}</FormLabel>
          <KeyboardDatePickerWrapper variant={variant} {...fieldRenderProps} css={dateControlCss} />
        </FormControl>
      )}
    />
  );
}
