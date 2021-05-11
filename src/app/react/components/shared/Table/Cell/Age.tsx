/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import moment from "moment";
import TableCell from "@material-ui/core/TableCell";
import { cellCss } from "../styles";

export const Age = ({ row, index, column, isLast }) => {
  let duration;
  if (row[column.id]) {
    duration = moment().diff(moment(row[column.id]), "years", false);
  } else {
    duration = "-";
  }
  return (
    <TableCell
      css={cellCss(column.action, isLast)}
      key={column.id}
      onClick={() => {
        if (column.action) {
          column.action(row);
        }
      }}
    >
      {duration}
    </TableCell>
  );
};
