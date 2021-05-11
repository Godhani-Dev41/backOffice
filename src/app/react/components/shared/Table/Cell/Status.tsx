/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { cellCss } from "../styles";
import { Tag } from "../../Tag";
import TableCell from "@material-ui/core/TableCell";
import { TranslationEn } from "../../../../../../assets/i18n/en";
import { EStatusColorMapper } from "../../../../types/customers";

export const Status = ({ column, row, index, isLast }) => {
  const value = row[column.id];
  const title = TranslationEn.customers.tags[value];
  return (
    <TableCell
      className={column.id}
      key={column.id}
      onClick={() => {
        if (column.action) {
          column.action(row);
        }
      }}
      css={cellCss(column.action, isLast)}
    >
      <Tag title={title} color={EStatusColorMapper[row[column.id]] || "blue"} />
    </TableCell>
  );
};
