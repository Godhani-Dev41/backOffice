/** @jsx jsx */
import React from "react";
import { jsx } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import { cellCss } from "../styles";
import { dateCss } from "../../../../styles/utils";

export const Date = ({ row, column, isLast, index }) => {
  let value = row[column.id];
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
      <span css={dateCss}>{moment(value).format("MMM DD, YYYY")}</span>
    </TableCell>
  );
};
