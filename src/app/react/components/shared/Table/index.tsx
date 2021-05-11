/** @jsx jsx */
import React, { useState, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { Table as TableComp } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import * as queryString from "querystring";
import TableHead from "@material-ui/core/TableHead";
import { TranslationEn } from "../../../../../assets/i18n/en";
import { ItemsPerPageCalculator } from "./utils";

import TableRow from "@material-ui/core/TableRow";

import Paper from "@material-ui/core/Paper";

import Pagination from "@material-ui/lab/Pagination";
import PaginationItem from "@material-ui/lab/PaginationItem";
import { Link, useLocation, useParams } from "react-router-dom";

import { ExpandableRow } from "./ExpandableRow";
import { HeaderRow } from "./HeaderRow";
import { colors } from "../../../styles/theme";
import { paginationContainer, showingStateCss, pageItem } from "./styles";

const rootCss = css`
  // margin: 1rem 0;
  width: 100%;
  height: 100%;
  display: flex;
  color: ${colors.black};
`;

const paperCss = (pagination: boolean) => css`
  width: 100%;
  padding: ${pagination ? "2rem" : "0"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const tableContainerCss = (height: number) => css`
  max-height: ${height}px;
  display: flex;
  flex-grow: 1;
  border-bottom: 1px solid rgba(224, 224, 224, 1);
`;

const tableCss = css`
  height: 100%;
  min-width: 150px;
`;

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//   console.log(a);
//   console.log(b);
//   console.log(orderBy);
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

const emptyCellCss = css`
  &.MuiTableCell-root {
    border-bottom: none;
  }
`;

type Order = "asc" | "desc";

interface TableProps {
  rows: any;
  columns: any;
  isLoading?: boolean;
  isSelectRow?: boolean;
  isHoverRow?: boolean;
  page?: number;
  ssr?: boolean;
  expandable?: boolean;
  expandableKey?: string;
  expandOn?: string;
  pagination?: boolean;
  isExpand?: boolean;
  maxHeight?: number;
  meta?: {
    totalItems?: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };
}

export { ItemsPerPageCalculator };

export const Table = ({
  isLoading = false,
  rows,
  columns,
  isSelectRow = false,
  isHoverRow = true,
  page,
  pagination = true,
  expandableKey = "",
  expandable = false,
  expandOn = "",
  ssr = false,
  meta,
  isExpand = false,
  maxHeight = 700,
}: TableProps) => {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Data>("calories");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [dense, setDense] = React.useState(false);

  // const [page, setPage] = React.useState(0);
  const location = useLocation();

  // const params = useParams();

  function compare(a, b) {
    const key = orderBy;

    let bandA;
    let bandB;

    if (typeof a[key] === "number") {
      bandA = a[key] ? a[key] : 0;
      bandB = b[key] ? b[key] : 0;
    } else {
      bandA = a[key] ? a[key].toUpperCase() : "";
      bandB = b[key] ? b[key].toUpperCase() : "";
    }
    // Use toUpperCase() to ignore character casing

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    if (order === "asc") {
      return comparison;
    } else {
      return comparison * -1;
    }
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string | number) => {
    const selectedIndex = selected.indexOf(String(name));
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, String(name));
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string | number) => selected.indexOf(String(name)) !== -1;
  const emptyRows = meta ? meta.itemsPerPage - Math.min(meta.itemsPerPage, rows.length) : 0;
  return (
    <div css={rootCss}>
      <Paper css={paperCss(pagination)}>
        <TableContainer css={tableContainerCss(maxHeight)}>
          <TableComp
            stickyHeader
            css={tableCss}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <HeaderRow
              isSelectRow={isSelectRow}
              columns={columns}
              numSelected={selected.length}
              // order={order}
              // orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              // onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows
                .sort(compare)
                // stableSort(rows, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <ExpandableRow
                      isExpand={isExpand}
                      isHoverRow={isHoverRow}
                      key={index}
                      isLast={index + 1 === rows.length}
                      row={row}
                      columns={columns}
                      isItemSelected={isItemSelected}
                      expandableKey={expandableKey}
                      isSelected={isSelected}
                      handleClick={handleClick}
                      expandable={expandable}
                      isSelectRow={isSelectRow}
                      labelId={labelId}
                      expandOn={expandOn}
                    />
                  );
                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 52 * emptyRows }}>
                  <TableCell css={emptyCellCss} colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </TableComp>
        </TableContainer>
        {pagination && (
          <div css={paginationContainer}>
            <div css={showingStateCss}>
              {TranslationEn.customers.pagination.showing} {page * meta.itemsPerPage + 1}{" "}
              {TranslationEn.customers.pagination.to}{" "}
              {page + 1 === meta.totalPages ? meta.totalItems : (page + 1) * meta.itemsPerPage}{" "}
              {TranslationEn.customers.pagination.of} {ssr ? meta.totalItems : rows.length}{" "}
              {TranslationEn.customers.pagination.clients}
            </div>
            <Pagination
              page={Number(page + 1)}
              count={meta.totalPages}
              shape="rounded"
              css={pageItem}
              renderItem={(item) => {
                return (
                  <PaginationItem
                    type={"start-ellipsis"}
                    component={Link}
                    to={`${location.pathname}?page=${item.page}`}
                    {...item}
                  />
                );
              }}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};
