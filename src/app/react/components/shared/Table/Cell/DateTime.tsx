/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import moment from "moment";
import { colors } from "../../../../styles/theme";
import { cellCss } from "../styles";
import { dateCss, timeCss } from "../../../../styles/utils";

export const DateTime = ({ row, index, column, isLast }) => {
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
      <span css={timeCss}>{moment(value).format("HH:mm A")}</span>
    </TableCell>
  );
};
