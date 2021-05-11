/** @jsx jsx */
import Button from "app/react/components/shared/Button/Button";
import { Grid } from "@material-ui/core";
import React, { Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { TranslationEn } from "../../../../../assets/i18n/en";

const footerCss = css`
  width: 100%;
  height: 72px;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  box-shadow: 0 2px 22px rgba(21, 93, 148, 0.0749563);
`;

const footerInternalCss = css`
  height: 100%;
  padding-right: 20px;
`;

interface Props {
  submitted: () => void;
  cancelled?: () => void;
  nextBtnName?: string;
  cancelBtnName?: string;
  hideCancelBtn?: boolean;
}

function FooterWithButtons({ submitted, cancelled, nextBtnName, cancelBtnName, hideCancelBtn }: Props) {
  return (
    <Grid container alignItems="center" css={footerCss}>
      <Grid item sm={12}>
        <Grid container alignItems="center" justify="flex-end" spacing={2} css={footerInternalCss}>
          {hideCancelBtn ? (
            <Fragment />
          ) : (
            <Grid item>
              <Button variant="text" onClick={cancelled}>
                {cancelBtnName ? cancelBtnName : TranslationEn.memberships.footer.defaultCancel}
              </Button>
            </Grid>
          )}
          <Grid item>
            <Button variant="contained" color="secondary" type="submit" onClick={submitted}>
              {nextBtnName ? nextBtnName : TranslationEn.memberships.footer.defaultNext}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FooterWithButtons;
