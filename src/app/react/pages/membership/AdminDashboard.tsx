/** @jsx jsx */
import { colors } from "app/react/styles/theme";
import { mobileOnly, tabletUp } from "app/react/styles/utils";
import { Box, Card, CardActions, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
import React from "react";
import { jsx, css } from "@emotion/react";
import { HashRouter as Router, Route } from "react-router-dom";
import ThreeColumnLayout from "app/react/layouts/ThreeColumn";
import Button from "app/react/components/shared/Button/Button";
import { TranslationEn } from "../../../../assets/i18n/en";

const mainGridCss = css`
  height: 100vh;
`;

const mainCardCss = css`
  height: 320px;
  width: 100%;
  max-width: 375px;
  ${mobileOnly} {
    padding: 40px;
  }
  ${tabletUp} {
    padding: 90px;
  }
`;

const cardContentCss = css`
  height: 100%;
`;

const createTextCss = css`
  &.MuiTypography-root {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.brandPrimary};
    text-align: center;
  }
`;

const buttonContainerCss = css`
  text-align: center;
`;

const largeButtonCss = css`
  &.MuiButton-root {
    font-size: 1.6rem;
    font-weight: 700;
    width: 172px;
    height: 48px;
  }
`;

export const AdminDashboard = () => {
  return (
    <ThreeColumnLayout>
      <ThreeColumnLayout.LeftSidebar>
        <Grid item sm={false} md={12} />
      </ThreeColumnLayout.LeftSidebar>
      <ThreeColumnLayout.Main>
        <Grid container alignItems="center" css={mainGridCss}>
          <Grid item sm={12}>
            <Card css={mainCardCss}>
              <Grid container justify="center" alignItems="center" css={cardContentCss}>
                <Grid item sm={6}>
                  <Typography css={createTextCss}>{TranslationEn.memberships.selectPage.title}</Typography>
                </Grid>
                <Grid item sm={12} css={buttonContainerCss}>
                  <Button variant="contained" color="secondary" css={largeButtonCss}>
                    {TranslationEn.memberships.selectPage.button}
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </ThreeColumnLayout.Main>
      <ThreeColumnLayout.RightSidebar>
        <Grid item sm={false} md={12} />
      </ThreeColumnLayout.RightSidebar>
    </ThreeColumnLayout>
  );
};
