export const colors = {
  brandPrimary: "#0d4774",
  brandPrimaryLight: "#155d94",
  brandSecondary: "#f7b500",
  brandSecondaryLight: "#f7c500",
  textColor: "#0f0238",
  black: "#000",
  white: "#fff",
  dangerRed: "#e23401",
  successGreenText: "#00a35a",
  successGreenBg: "#01e27d",
  btnGreenBg: "#52c483",
  searchTabText: "#535353",
  grayText: "#949494",
  formControlBg: "#f3f7fa",
  formInputBg: "#7c9cb4",
  grayBorder: "#e8e8e8",
  lightGreenBorder: "#869097",
  redBorder: "#e02020",
  darkGray: "#535353",
  lightGray: "#FAFCFD",
  ligntText: "#A6BCCC",
  statusGreen: "#24C875",
  disabled: "#DBE4EB",
  statusBlue: "#4A90E2",
  borderPrimary: "#DAE6F0",
  borderSeperator: "#E2E7EB",
};

export const typography = {
  browserBaseFontSize: 16,
  // `px` value, all CSS `rem` values will be relative to this value
  rootFontSize: 10,
  // `body` font-size multiplier of `rootFontSize`
  globalBodyFontSizeBase: 1.4,
  fontPrimary: "Montserrat",
};

/* Content's grid maximum width */
export const gridMaxWidth = 940;

/* Content's grid padding */
export const gridPadding = 15;

/**
 * Screen breakpoints based on "popularity" guesstimates and statistics derived
 * from annualized monthly Google queries and some fuzzy math.
 *
 * @see
 * [Screen Size.es](http://screensiz.es/) (Using "Device width" for media-queries)
 */
export const breakpoints = {
  // Smallest mobile screen we support
  // Anything below that is unsupported
  mobile: 360,
  mobilePx: "360px",
  // Smallest tablet screen we support
  tablet: 768,
  tabletPx: "768px",
  // Smallest desktop screen we support
  desktop: 1280,
  desktopPx: "1280px",
};

export const tabletBreakpointRem = breakpoints.tablet / typography.rootFontSize;
export const desktopBreakpointRem = breakpoints.desktop / typography.rootFontSize;

export const zLayers = {
  behindAll: -1,
  base: 0,
  aboveAll: 1000,
};
