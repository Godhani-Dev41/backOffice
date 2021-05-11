import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

import { breakpoints, colors, typography } from "../styles/theme";

/**
 * Material UI customization using a theme.
 * Changing the theme configuration variables is the most
 * effective way to match Material-UI to our needs.
 *
 * @see
 * [Material UI Theme](https://material-ui.com/customization/theming)
 * @see
 * [Material Default Theme](https://material-ui.com/customization/default-theme/)
 */
const muiTheme = createMuiTheme({
  // https://material-ui.com/customization/palette/
  palette: {
    primary: {
      main: colors.brandPrimary,
    },
    secondary: {
      main: colors.brandSecondary,
    },
  },

  // https://material-ui.com/customization/typography/
  typography: {
    fontFamily: typography.fontPrimary,
    // Tell UI what's the font-size on the HTML element.
    htmlFontSize: typography.rootFontSize,
  },

  // https://material-ui.com/customization/breakpoints/
  breakpoints: {
    values: {
      xs: 0,
      sm: breakpoints.mobile,
      md: breakpoints.tablet,
      lg: breakpoints.desktop,
      xl: 1920,
    },
  },

  // MUI components overrides
  overrides: {
    MuiTypography: {
      h1: {
        textTransform: "uppercase",
        fontWeight: 900,
      },
      h2: {
        textTransform: "uppercase",
        fontWeight: 900,
      },
      h3: {
        textTransform: "uppercase",
        fontWeight: 900,
      },
      h4: {
        textTransform: "uppercase",
        fontWeight: 900,
      },
      h5: {
        fontWeight: 900,
      },
      h6: {
        fontWeight: 900,
      },
    },
    MuiToolbar: {
      root: {
        backgroundColor: colors.brandPrimary,
      },
      dense: {
        minHeight: 50,
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: colors.brandPrimary,
      },
    },
    MuiButton: {
      root: {
        borderRadius: "2px",
      },
      contained: {
        fontWeight: 900,
      },
      containedPrimary: {
        backgroundColor: colors.brandPrimary,
      },
      containedSecondary: {
        backgroundColor: colors.brandSecondary,
        color: colors.white,
        "&:hover": {
          backgroundColor: colors.brandSecondaryLight,
        },
      },
      containedSizeSmall: {
        fontSize: "1.1rem",
        height: "30px",
      },
      containedSizeLarge: {
        fontSize: "1.6rem",
        height: "50px",
      },
      outlined: {
        color: colors.grayText,
      },
      outlinedPrimary: {
        borderColor: "currentColor",
      },
      outlinedSizeSmall: {
        fontSize: "1.1rem",
        height: "30px",
      },
      outlinedSizeLarge: {
        fontSize: "1.6rem",
        height: "50px",
      },
    },
    MuiRadio: {
      colorPrimary: {
        color: colors.brandPrimary,
      },
      colorSecondary: {
        color: colors.brandSecondary,
      },
    },
    MuiCheckbox: {
      colorPrimary: {
        color: colors.brandPrimary,
      },
      colorSecondary: {
        color: colors.brandSecondary,
      },
    },
    MuiFilledInput: {
      input: {
        backgroundColor: colors.formControlBg,
        padding: "8px",
      },
      inputMarginDense: {
        paddingTop: "8px",
        paddingBottom: "8px",
      },
    },
    MuiInputBase: {
      input: {
        color: colors.formInputBg,
      },
    },
    MuiFormLabel: {
      root: {
        color: colors.brandPrimary,
      },
    },
    MuiPaper: {
      elevation1: {
        boxShadow: "0px 2px 22px rgba(21, 93, 148, 0.0749563)",
      },
    },
  },
});

export default responsiveFontSizes(muiTheme);
