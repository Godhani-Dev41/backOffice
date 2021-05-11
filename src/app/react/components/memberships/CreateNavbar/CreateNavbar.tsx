/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { AppBar, Container, Grid, Toolbar } from "@material-ui/core";

const toolbarCss = css`
  &.MuiToolbar-gutters {
    padding-left: 0;
    padding-right: 0;
  }
`;

interface Props {
  title?: string;
  breadCrumbs?: boolean;
  stepper?: boolean;
}

function CreateNavbar({ title, breadCrumbs, stepper }: Props) {
  return (
    <AppBar position="static">
      <Toolbar css={toolbarCss} variant="dense">
        <Container maxWidth="lg">
          <Grid container justify="space-between" alignItems="center"></Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default CreateNavbar;
