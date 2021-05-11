/** @jsx jsx */
import DateInput from "@app/react/components/shared/FormControls/DateInput";
import { Card, CardContent, Divider, Grid, Typography } from "@material-ui/core";
import { jsx, css } from "@emotion/react";
import { TranslationEn } from "../../../../../assets/i18n/en";
import { Fragment } from "react";

const mainCardCss = css`
  width: 100%;
  // max-width: 572px;
`;

const cardContentCss = css`
  &.MuiCardContent-root {
    padding: 20px;
  }
`;

const cardTitleCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
  }
`;

const dividerCss = css`
  margin-top: 15px;
  margin-bottom: 20px;
`;

export default function () {
  return (
    <Grid container spacing={4}>
      <Grid item sm={12}>
        {/* Date card */}
        <Card css={mainCardCss}>
          <CardContent css={cardContentCss}>
            <Typography color="primary" css={cardTitleCss}>
              {TranslationEn.memberships.typePage.dateTitle}
            </Typography>
            <Divider css={dividerCss} />
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <DateInput name={"startDate"} title={TranslationEn.memberships.typePage.startDate} />
              </Grid>
              <Grid item xs={6}>
                <DateInput name={"endDate"} title={TranslationEn.memberships.typePage.endDate} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* Registration date card */}
      <Grid item sm={12}>
        <Card css={mainCardCss}>
          <CardContent css={cardContentCss}>
            <Typography color="primary" css={cardTitleCss}>
              {TranslationEn.memberships.typePage.registrationDateTitle}
            </Typography>
            <Divider css={dividerCss} />
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <DateInput name={"registrationStartDate"} title={TranslationEn.memberships.typePage.startDate} />
              </Grid>
              <Grid item xs={6}>
                <DateInput name={"registrationEndDate"} title={TranslationEn.memberships.typePage.endDate} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
