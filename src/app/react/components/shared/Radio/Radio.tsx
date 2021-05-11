/** @jsx jsx */

import * as React from "react";
import { jsx, css, SerializedStyles } from "@emotion/react";


// We enforce not to import MUI `Radio` so all Radio
// components will use this component. Thus we need to disable the lint rule.
// eslint-disable-next-line no-restricted-imports
import { Radio as MuiRadio, RadioProps } from '@material-ui/core';

/**
 * Material UI Radio wrapper.
 *
 * @see
 * [Radio](https://material-ui.com/components/radio-buttons/)
 * @see
 * [Radio API](https://material-ui.com/api/radio/)
 */
function Radio({ color = 'primary', ...restProps }: RadioProps) {
  return <MuiRadio color={color} {...restProps} />;
}

export default Radio;
