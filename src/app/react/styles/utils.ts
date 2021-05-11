import { ColorInput, TinyColor } from "@ctrl/tinycolor";
import { css } from "@emotion/react";

import { breakpoints, colors, gridMaxWidth, gridPadding } from "./theme";

/**
 * Media Query helpers
 * See usage examples in `docs/styling.md`
 */

export const mediaUp = (screenSize: string) => `@media (min-width: ${screenSize})`;
export const mediaDown = (screenSize: string) => `@media (max-width: ${screenSize})`;
export const mediaDownVertical = (screenSize: string) => `@media (max-height: ${screenSize})`;
export const mediaBetween = (minScreenSize: string, maxScreenSize: string) =>
  `@media (min-width: ${minScreenSize}) and (max-width: ${maxScreenSize})`;
/** CSS media query for anything below tablet screen. */
export const mobileOnly = mediaDown(`${breakpoints.tablet - 1}px`);
/** CSS media query for smallest tablet screen and above. */
export const tabletUp = mediaUp(breakpoints.tabletPx);
/** CSS media query for smallest desktop screen and above. */
export const desktopUp = mediaUp(breakpoints.desktopPx);
/** CSS media query for screens that go above theme's grid. */
export const gridUp = `@media (min-width: ${gridMaxWidth + gridPadding * 2}px)`;
/** CSS media query for screens that go between tablet and our grid width. */
export const tabletToGrid = mediaBetween(breakpoints.tabletPx, `${gridMaxWidth + gridPadding * 2}px`);

/**
 * Color helpers
 */

/**
 * Sets the alpha value on a current color and returns it as an RGBA string.
 */
export function setOpacity(
  // Any valid color that TinyColor accepts
  color: ColorInput,
  // Opacity level (from 0 to 1)
  opacity: number,
) {
  return new TinyColor(color).setAlpha(opacity).toRgbString();
}

/**
 * Adding measurements to make a target mobile-friendly and easier to tap.
 *
 * @see
 * [Tap targets are not sized appropriately](https://developers.google.com/web/tools/lighthouse/audits/tap-targets)
 */
export const tapTargetCss = css`
  ${mobileOnly} {
    min-height: 48px;
    min-width: 48px;
  }
`;

/**
 * Truncate text.
 */
export const truncateTextCss = (
  // The number of lines to clamp
  lineClamp: number | "none",
) => css`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${lineClamp};
`;

export const brandGradientBackgroundCss = css`
  background-image: linear-gradient(90deg, ${colors.brandSecondary}, ${colors.brandSecondaryLight});
`;

export const customerHeaderContainer = css`
  display: flex;
  justify-content: space-between;
  background: white;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  padding: 1rem;
  z-index: 1;
`;

export const flex = css`
  display: flex;
  align-items: center;
`;

export const flexCol = css`
  display: flex;
  flex-direction: column;
`;

export const baseCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  display: flex;
  align-items: center;
`;
export const dateCss = css`
  ${baseCss};
  font-size: 1.4rem;
  line-height: 130%;
  color: ${colors.brandPrimary};
`;

export const timeCss = css`
  ${baseCss};
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
`;

export const ChargeButtonCss = css`
  background: linear-gradient(270deg, ${colors.brandSecondary} 0%, ${colors.brandSecondary} 100%);
  color: ${colors.white};
  border: 1px solid ${colors.brandSecondary};
  &:hover {
    box-shadow: 0px 2px 16px 8px rgba(247, 181, 0, 0.2);
    border: 1px solid ${colors.brandSecondary};
  }
  &:disabled {
    box-shadow: none;
    border: none;
  }
`;

export const SecondaryButtonCss = css`
  border: 1px solid transparent;
  &:hover {
    box-shadow: none;
    text-decoration: underline;
    border: 1px solid transparent;
  }
`;

export const flexEndCss = css`
  ${flex};
  justify-content: flex-end;
`;

export const iconCss = css`
  border-radius: 2px;
  width: 20px;
  height: 20px;
  background-color: rgba(13, 71, 116, 0.04);
  input:hover ~ & {
    background-color: #ebf1f5;
  }
  input:disabled ~ & {
    box-shadow: none;
    background-color: rgba(206, 217, 224, 0.5);
  }
`;

export const checkedIconCss = css`
  background-color: rgba(13, 71, 116, 0.04);
  background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0));
  &:before {
    display: block;
    height: 20px;
    width: 20px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%230d4774'/%3E%3C/svg%3E");
    content: "";
  }
  input:hover ~ & {
    background-color: rgba(13, 71, 116, 0.04);
  }
`;

export const CheckedIconCss = css`
  ${iconCss}
  ${checkedIconCss}
`;

export const checkboxCss = (equalPadding?: boolean) => css`
  &.MuiCheckbox-root {
    padding: 8px;
    padding-left: ${equalPadding ? 0 : "8px"};
  }
  &:hover {
    background: transparent;
  }
`;

export const filterContainer = css`
  ${flexCol};
  width: 150px;
  margin-top: 1rem;
  padding: 1rem;
  font-family: Montserrat;
  font-size: 1.4rem;
  line-height: 130%;
  color: ${colors.brandPrimary};
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: ${colors.ligntText};
  }
`;

export const TableContainer = css`
  td {
    padding: 10px !important;
  }
  th {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
`;
