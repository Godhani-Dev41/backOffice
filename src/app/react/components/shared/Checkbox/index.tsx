/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { createStyles, lighten, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import { colors } from "../../../styles/theme";

import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";

const checkboxCss = css`
  color: ${colors.brandPrimary};
  &:checked {
    color: ${colors.brandPrimary};
  }
  &:hover {
    background-color: transparent;
  }
`;

export const CustomCheckbox = ({ ...props }: CheckboxProps) => {
  return <Checkbox color="default" css={checkboxCss} {...props} />;
};

// export const CustomCheckbox = withStyles({
//   root: {
//     color: colors.brandPrimary,
//     "&$checked": {
//       color: colors.brandPrimary,
//     },
//     "&:hover": {
//       backgroundColor: "transparent",
//     },
//   },
//   checked: {},
// })((props: CheckboxProps) => <Checkbox color="default" {...props} />);
