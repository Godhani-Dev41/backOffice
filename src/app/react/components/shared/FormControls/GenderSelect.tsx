/** @jsx jsx */
import { required } from "app/react/lib/form";
import { colors } from "app/react/styles/theme";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@material-ui/core";
import React, { Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { Field as FinalField } from "react-final-form";
import { ReactSVG } from "react-svg";

const metaErrorCss = css`
  color: ${colors.dangerRed};
  font-size: 1.2rem;
`;

const genderGroupCss = css`
  justify-content: flex-start;
  color: ${colors.brandPrimary};
  .MuiTypography-body1 {
    font-size: 1.2rem;
  }
`;

const titleCss = css`
  color: ${colors.brandPrimary};
  font-size: 1.2rem;
`;

const genderIconCss = css`
  svg {
    height: 30px;
    width: 30px;
  }
`;

interface Props {
  controlName: string;
  value: number;
  require: boolean;
  text?: string;
}

function GenderSelect({ controlName, value, require, text }: Props) {
  value = Number(value);

  return (
    <FinalField name={controlName} validate={require ? required : null} displayEmpty type="radio">
      {({ input, meta }) => (
        <FormControl fullWidth>
          <FormLabel css={titleCss}>
            {text} {required ? "*" : ""}
          </FormLabel>
          <RadioGroup row aria-label="gender" css={genderGroupCss} {...input}>
            <FormControlLabel
              name={controlName}
              value="1"
              control={
                <Radio
                  icon={
                    <Fragment>
                      <ReactSVG css={genderIconCss} src="assets/media/gender/male_idle.svg" />
                      <ReactSVG css={genderIconCss} src="assets/media/gender/female_idle.svg" />
                    </Fragment>
                  }
                  checkedIcon={
                    <Fragment>
                      <ReactSVG css={genderIconCss} src="assets/media/gender/male_active.svg" />
                      <ReactSVG css={genderIconCss} src="assets/media/gender/female_active.svg" />
                    </Fragment>
                  }
                  color="primary"
                  checked={value === 1}
                />
              }
              label=""
            />
            <FormControlLabel
              name={controlName}
              value="2"
              control={
                <Radio
                  icon={<ReactSVG css={genderIconCss} src="assets/media/gender/male_idle.svg" />}
                  checkedIcon={<ReactSVG css={genderIconCss} src="assets/media/gender/male_active.svg" />}
                  checked={value === 2}
                  color="primary"
                />
              }
              label=""
            />
            <FormControlLabel
              name={controlName}
              value="3"
              control={
                <Radio
                  icon={<ReactSVG css={genderIconCss} src="assets/media/gender/female_idle.svg" />}
                  checkedIcon={<ReactSVG css={genderIconCss} src="assets/media/gender/female_active.svg" />}
                  checked={value === 3}
                  color="primary"
                />
              }
              label=""
            />
          </RadioGroup>
          {meta.error && meta.touched && <div css={metaErrorCss}>{meta.error}</div>}
        </FormControl>
      )}
    </FinalField>
  );
}

export default GenderSelect;
