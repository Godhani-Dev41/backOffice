/** @jsx jsx */
import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { TranslationEn } from "../../../../../assets/i18n/en";

import { CustomCheckbox } from "../Checkbox";
import {
  headerCss,
  headerTdCss,
  checkboxCss,
  visuallyHiddenCss,
  intermidiateIconCss,
  checkedIconCss,
  iconCss,
} from "./styles";

const CheckedIconCss = css`
  ${iconCss}
  ${checkedIconCss}
`;

const IntermidateCss = css`
  ${iconCss}
  ${intermidiateIconCss}
`;

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

type Order = "asc" | "desc";

interface ColumnType {
  id: string;
  label: string;
  type: string;
  numeric?: boolean;
  disablePadding?: boolean;
}

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  columns: Array<ColumnType>;
  isSelectRow: boolean;
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, columns, isSelectRow } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead css={headerCss}>
      <TableRow>
        {isSelectRow && (
          <TableCell css={headerTdCss} padding="checkbox">
            <CustomCheckbox
              css={checkboxCss}
              checkedIcon={<span css={CheckedIconCss} />}
              indeterminateIcon={<span css={IntermidateCss} />}
              icon={<span css={iconCss} />}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all desserts" }}
              indeterminate={numSelected > 0 && numSelected < rowCount}
            />
          </TableCell>
        )}
        {columns.map((headCell) => (
          <TableCell
            css={headerTdCss}
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span css={visuallyHiddenCss}>
                  {order === "desc" ? TranslationEn.table.sortedDesc : TranslationEn.table.sortedAsc}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
