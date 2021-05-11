/** @jsx jsx */

import * as React from "react";
import { jsx, css, SerializedStyles } from "@emotion/react";
// We enforce not to import MUI `Button` so all Button
// components will use this component. Thus we need to disable the lint rule.
// eslint-disable-next-line no-restricted-imports
import { Button as MuiButton, ButtonProps } from "@material-ui/core";

import { colors } from "../../../styles/theme";
import { setOpacity } from "../../../styles/utils";

type Skin = "outlineAction";

const btnSkins: { [k in Skin]?: SerializedStyles } = {
  outlineAction: css`
    color: ${colors.white};
    border-color: ${colors.btnGreenBg};
    background-color: ${colors.btnGreenBg};

    &:hover {
      background-color: ${setOpacity(colors.btnGreenBg, 0.7)};
    }

    &:disabled {
      color: ${setOpacity(colors.white, 0.4)};
    }
  `,
};

const btnCss = (skin: Skin | undefined, textTransform: string, fullWidth: boolean) => {
  return css`
    &.MuiButtonBase-root {
      text-transform: ${textTransform};
      width: ${fullWidth && "100%"};

      /* Set button's styling by a skin */
      ${skin && btnSkins[skin]}
    }
  `;
};

/**
 * See `DevOnly.tsx` for examples
 */
interface Props extends ButtonProps {
  /** Set a custom skin */
  skin?: Skin;
  /** Transform the label text */
  textTransform?: "capitalize" | "uppercase" | "lowercase" | "none";
  /** Make the button spread horizontally 100% */
  fullWidth?: boolean;
}

/**
 * The component is making use of Material UI's Button.
 *
 * @see
 * [Button](https://material-ui.com/components/buttons/)
 */
function Button({ children, skin, textTransform = "uppercase", fullWidth = false, ...restProps }: Props) {
  return (
    <MuiButton css={btnCss(skin, textTransform, fullWidth)} color="inherit" disableElevation {...restProps}>
      {children}
    </MuiButton>
  );
}

export default Button;
