/** @jsx jsx */
import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";

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
  onRequestSort?: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order?: Order;
  orderBy?: string;
  rowCount: number;
  columns: Array<ColumnType>;
  isSelectRow: boolean;
}

export const HeaderRow = (props: EnhancedTableProps) => {
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
        {columns.map((headCell) => {
          return (
            <TableCell
              css={headerTdCss}
              className={`${headCell.id}-head`}
              id="cell"
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "default"}
              // sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.label}
              {/* <TableSortLabel
              // active={orderBy === headCell.id}
              // direction={orderBy === headCell.id ? order : "asc"}
              // onClick={createSortHandler(headCell.id)}
              >
                
                {orderBy === headCell.id ? (
                  <span css={visuallyHiddenCss}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span>
                ) : null}
              </TableSortLabel> */}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
