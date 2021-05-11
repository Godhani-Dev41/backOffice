/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import { cellCss } from "../styles";

export const Balance = ({ row, index, column, isLast }) => {
  let balance;
  if (row[column.id]) {
    if (row[column.id] > 0) {
      balance = `+ $${row[column.id]}`;
    } else {
      balance = `- $${row[column.id] * -1}`;
    }
  } else {
    balance = "-";
  }
  return (
    <TableCell
      key={column.id}
      onClick={() => {
        if (column.action) {
          column.action(row);
        }
      }}
      css={cellCss(column.action, isLast)}
    >
      {balance}
    </TableCell>
  );
};
