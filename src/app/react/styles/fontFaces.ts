/** @jsx jsx */
import { jsx, css } from "@emotion/react";

/**
 * woff2 - Super Modern Browsers
 * woff - Modern Browsers
 * ttf - Legacy Safari, Android, iOS (optional at this point)
 *
 * References:
 * - https://medium.com/clio-calliope/making-google-fonts-faster-aadf3c02a36d
 * - https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization
 */
export const fontFacesCss = css`
  /** =================== MONTSERRAT =================== **/

  /** Montserrat Thin **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 100;
    font-style: normal;
  }

  /** Montserrat Thin-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 100;
    font-style: italic;
  }

  /** Montserrat ExtraLight **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 200;
    font-style: normal;
  }

  /** Montserrat ExtraLight-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 200;
    font-style: italic;
  }

  /** Montserrat Light **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 300;
    font-style: normal;
  }

  /** Montserrat Light-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 300;
    font-style: italic;
  }

  /** Montserrat Regular **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 400;
    font-style: normal;
  }

  /** Montserrat Regular-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 400;
    font-style: italic;
  }

  /** Montserrat Medium **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 500;
    font-style: normal;
  }

  /** Montserrat Medium-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 500;
    font-style: italic;
  }

  /** Montserrat SemiBold **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 600;
    font-style: normal;
  }

  /** Montserrat SemiBold-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 600;
    font-style: italic;
  }

  /** Montserrat Bold **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 700;
    font-style: normal;
  }

  /** Montserrat Bold-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 700;
    font-style: italic;
  }

  /** Montserrat ExtraBold **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 800;
    font-style: normal;
  }

  /** Montserrat ExtraBold-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 800;
    font-style: italic;
  }

  /** Montserrat Black **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 900;
    font-style: normal;
  }

  /** Montserrat Black-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 900;
    font-style: italic;
  }

  /** =================== MONTSERRAT ALTERNATES =================== **/

  /** Montserrat Alternates Thin **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 100;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Thin.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Thin.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Thin.ttf") format("truetype");
  }

  /** Montserrat Alternates Thin-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 100;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-ThinItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-ThinItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-ThinItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates ExtraLight **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 200;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-ExtraLight.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-ExtraLight.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-ExtraLight.ttf") format("truetype");
  }

  /** Montserrat Alternates ExtraLight-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 200;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-ExtraLightItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-ExtraLightItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-ExtraLightItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates Light **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 300;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Light.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Light.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Light.ttf") format("truetype");
  }

  /** Montserrat Alternates Light-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 300;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-LightItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-LightItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-LightItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates Regular **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 400;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Regular.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Regular.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Regular.ttf") format("truetype");
  }

  /** Montserrat Alternates Regular-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 400;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-Italic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Italic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Italic.ttf") format("truetype");
  }

  /** Montserrat Alternates Medium **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 500;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Medium.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Medium.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Medium.ttf") format("truetype");
  }

  /** Montserrat Alternates Medium-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 500;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-MediumItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-MediumItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-MediumItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates SemiBold **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 600;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-SemiBold.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-SemiBold.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-SemiBold.ttf") format("truetype");
  }

  /** Montserrat Alternates SemiBold-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 600;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-SemiBoldItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-SemiBoldItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-SemiBoldItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates Bold **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 700;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Bold.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Bold.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Bold.ttf") format("truetype");
  }

  /** Montserrat Alternates Bold-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 700;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-BoldItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-BoldItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-BoldItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates ExtraBold **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 800;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-ExtraBold.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-ExtraBold.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-ExtraBold.ttf") format("truetype");
  }

  /** Montserrat Alternates ExtraBold-Italic **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 800;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-ExtraBoldItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-ExtraBoldItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-ExtraBoldItalic.ttf") format("truetype");
  }

  /** Montserrat Alternates Black **/
  @font-face {
    font-family: "Montserrat Alternates";
    font-weight: 900;
    font-style: normal;
    src: url("../media/fonts/MontserratAlternates-Black.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-Black.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-Black.ttf") format("truetype");
  }

  /** Montserrat Alternates Black-Italic **/
  @font-face {
    font-family: "Montserrat";
    font-weight: 900;
    font-style: italic;
    src: url("../media/fonts/MontserratAlternates-BlackItalic.woff2") format("woff2"),
      url("../media/fonts/MontserratAlternates-BlackItalic.woff") format("woff"),
      url("../media/fonts/MontserratAlternates-BlackItalic.ttf") format("truetype");
  }
`;
