import { css } from "@emotion/react";

import { colors, typography } from "../styles/theme";

import { fontFacesCss } from "./fontFaces";

export const globalCss = css`
  ${fontFacesCss}

  /**
   * Box model like it should be:
   * http://www.paulirish.com/2012/box-sizing-border-box-ftw/
   */
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  /**
   * Reset
   */
  .container-fluid {
    margin: 0;
    padding: 0;
    letter-spacing: 0.2px;
    background-color: ${colors.formControlBg};
    ul,
    ol {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }

  html.no-vertical-scroll {
    height: 100%;
    overflow-y: hidden;
  }

  a {
    text-decoration: none;
    color: ${colors.brandPrimary};
  }

  textarea {
    resize: none;
  }

  /**
   * Font sizing strategy making 1rem equal 10px for easy usage
   * e.g. 1.6rem = 16px
   */
  :root {
    /* e.g. (10 / 16) * 100 = 62.5% */
    font-size: ${(typography.rootFontSize / typography.browserBaseFontSize) * 100}%;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #7f7f7f;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /**
   * Default font settings for all generic text
   */
  .container-fluid {
    font-family: ${typography.fontPrimary};
    font-size: ${typography.globalBodyFontSizeBase}rem;
    color: ${colors.textColor};
  }

  /**
   * Fix default input font styles not taken from body styles
   */
  input {
    font-size: inherit;
    font-weight: inherit;
  }

  /**
   * Makes the hidden attribute work even when an element has display: flex
   * http://lists.w3.org/Archives/Public/public-whatwg-archive/2014May/0001.html
   */
  [hidden] {
    display: none !important;
  }

  b {
    font-weight: 500;
  }

  /**
   * A fix for WebKit browsers as inputs behave differently on it.
   * Using the text-fill-color, sets coloring right.
   */
  input::placeholder,
  input[disabled] {
    -webkit-text-fill-color: currentColor;
  }

  .scroller::-webkit-scrollbar-thumb {
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s linear 300ms, opacity 600ms;
  }
  .scroller:hover::-webkit-scrollbar-thumb {
    visibility: visible;
    opacity: 1;
    transition: visibility 0s linear 0s, opacity 600ms;
  }

  ::selection {
    color: ${colors.white};
    background: ${colors.brandSecondary};
  }

  // Stripe styling
  .StripeElement {
    width: 100%;
    height: 40px;
    padding: 11px 5px;
    background: ${colors.formControlBg};
    font-family: ${typography.fontPrimary};
    font-size: ${typography.globalBodyFontSizeBase}rem;
    color: ${colors.textColor};
  }

  // styling datepicker inline mode
  .MuiPopover-root {
    z-index: 13000 !important;
  }

  .skeleton {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    background: #e4e4e4;
  }
  @-webkit-keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
`;
