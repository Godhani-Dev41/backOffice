/** @jsx jsx */
import { Fragment } from "react";
import { jsx, css } from "@emotion/react";

import { Container, Grid } from "@material-ui/core";

import { ChildrenProps } from "../types/children";

import { colors } from "../styles/theme";

const titleCss = css`
  font-size: 1.8rem;
  font-weight: 900;
  color: ${colors.brandPrimary};
`;

const scrollContentCss = (hasFooter: boolean) => css`
  height: ${hasFooter ? "calc(100vh - 72px)" : "100vh"};
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
`;

interface Props {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

interface HeaderProps {
  title?: string;
}

interface ContentProps {
  hasFooter?: boolean;
}

function ThreeColumnLayout({ maxWidth, children }: Props & ChildrenProps) {
  return (
    <Container maxWidth={maxWidth ? maxWidth : "lg"}>
      <Grid container spacing={4}>
        {children}
      </Grid>
    </Container>
  );
}

function Main({ children }: ChildrenProps) {
  return (
    <Grid item sm={12} md={6}>
      {children}
    </Grid>
  );
}

function Header({ children, title }: ChildrenProps & HeaderProps) {
  return (
    <Fragment>
      {title && <h2 css={titleCss}>{title}</h2>}
      <Grid container spacing={2} justify="space-between">
        {children}
      </Grid>
    </Fragment>
  );
}

function Content({ hasFooter, children }: ChildrenProps & ContentProps) {
  return <div css={scrollContentCss(hasFooter ? hasFooter : false)}>{children}</div>;
}

function SidebarLg({ children }: ChildrenProps) {
  return (
    <Grid item sm={12} md={3}>
      {children}
    </Grid>
  );
}

function SidebarSm({ children }: ChildrenProps) {
  return (
    <Grid item sm={12} md={3}>
      {children}
    </Grid>
  );
}

ThreeColumnLayout.Main = Main;
ThreeColumnLayout.Header = Header;
ThreeColumnLayout.LeftSidebar = SidebarLg;
ThreeColumnLayout.Content = Content;
ThreeColumnLayout.RightSidebar = SidebarSm;

export default ThreeColumnLayout;
