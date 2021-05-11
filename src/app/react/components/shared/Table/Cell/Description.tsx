/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import { cellCss } from "../styles";

export const Description = ({ row, index, column, isLast }) => {
  return (
    <TableCell
      css={cellCss(column.action, isLast)}
      onClick={() => {
        if (column.action) {
          column.action(row);
        }
      }}
      key={column.id}
    >
      {row[column.id]} {column.label}
    </TableCell>
  );
};
