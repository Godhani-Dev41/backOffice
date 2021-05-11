/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";

export const cellCss = (isAction: boolean, isLast?: boolean, isIcon?: boolean) => css`
  padding: 6px 8px;
  cursor: ${isAction ? "pointer" : "default"};
  &.MuiTableCell-body {
    color: ${colors.brandPrimary};
    width: ${isIcon ? "20px" : "unset"};
  }
  &.MuiTableCell-root {
    border-bottom: ${isLast ? "none" : "1px solid rgba(224, 224, 224, 1)"};
  }
  .MuiTableCell-paddingCheckbox {
    padding: 0 0 0 8px;
  }
  a {
    text-decoration: underline;
    color: ${colors.brandPrimary};
  }
`;

export const iconCell = css`
  height: 20px;
  cursor: pointer;
  width: 20px;
  display: flex;
  justify-content: center;
  div {
    display: flex;
    justify-content: center;
    cursor: pointer;
  }
`;

export const rowCss = (isHoverRow: boolean, isSubRow: boolean) => css`
  padding: 10px 8px;
  &.Mui-selected {
    background-color: transparent;
  }
  &.MuiTableRow-hover:hover {
    background-color: ${isHoverRow ? "rgba(0, 0, 0, 0.04)" : "transparent"};
  }
  .MuiTableCell-body {
    background: ${isSubRow ? colors.lightGray : colors.white};
  }
`;

export const showingStateCss = css`
  font-family: "Montserrat";
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: #a6bccc;
`;

export const paginationContainer = css`
  display: flex;
  margin-top: 1rem;
  justify-content: space-between;
`;

export const pageItem = css`
  .Mui-selected {
    background: linear-gradient(270deg, ${colors.brandSecondary} 0%, ${colors.brandSecondary} 100%);
    color: ${colors.white};
    outline: none;
    &:focus {
      outline: none;
    }
  }
`;

export const headerCss = css`
  // background: ${colors.formControlBg};
  &.MuiTableCell-stickyHeader{
    background: ${colors.formControlBg};
  }
  td {
    .MuiTableCell-root {
      border-bottom: none;
    }
  }
`;

export const expandableButtonCss = css`
  padding: 0;
  margin-left: 10px;
`;

export const checkboxCss = css`
  &:hover {
    background: transparent;
  }
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

export const intermidiateIconCss = css`
  background-color: rgba(13, 71, 116, 0.04);
  background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.1), hsla(0, 0%, 100%, 0));
  &:before {
    display: block;
    height: 20px;
    width: 20px;
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z' fill='%230d4774'/%3E%3C/svg%3E");
    content: "";
  }
  input:hover ~ & {
    background-color: rgba(13, 71, 116, 0.04);
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

export const headerTdCss = css`
  border-bottom: none;
  color: ${colors.brandPrimary};
  fontfamily: "Montserrat";
  padding: 8px;
  font-size: 1.2rem;
  font-weight: 500;
  padding-top: 4px;
  padding-bottom: 4px;
  &.MuiTableCell-stickyHeader {
    background: ${colors.formControlBg};
  }
  .MuiTableSortLabel-active {
    color: ${colors.brandPrimary};
    font-family: "Montserrat";
    font-size: 1.2rem;
    font-weight: 500;
  }
`;

export const visuallyHiddenCss = css`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  top: 20px;
  width: 1px;
`;
