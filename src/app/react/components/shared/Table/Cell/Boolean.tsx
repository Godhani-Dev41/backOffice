/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import { ReactSVG } from "react-svg";
import { cellCss, iconCell } from "../styles";

export const BooleanCell = ({ expandableKey, row, index, column, isLast }) => {
  let src = "assets/media/icons/customers/minus.svg";
  if (row[column.id] && !row[expandableKey]) {
    src = "assets/media/icons/customers/check.svg";
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
      <ReactSVG css={iconCell} src={src} />
    </TableCell>
  );
};
