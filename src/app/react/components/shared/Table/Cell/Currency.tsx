/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import { cellCss } from "../styles";
import { Pricify } from "../../../../lib/form";

export const Currency = ({ index, column, row, isLast }) => {
  return (
    <TableCell
      key={index}
      className={column.id}
      onClick={() => {
        if (column.action) {
          column.action(row);
        }
      }}
      css={cellCss(column.action, isLast)}
    >
      {Pricify(row[column.id])}
    </TableCell>
  );
};
