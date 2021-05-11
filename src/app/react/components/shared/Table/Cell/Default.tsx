/** @jsx jsx */
import React, { useRef } from "react";
import { jsx, css } from "@emotion/react";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { cellCss, expandableButtonCss } from "../styles";

interface IDefaultCellProps {
  type: string;
  column: any;
  row: any;
  index: number;
  expandOn: string;
  expandableKey: string;
  isExpanded: boolean;
  isLast: boolean;
  setIsExpanded: any;
}

export const DefaultCell = ({
  type,
  column,
  row,
  // classes,
  index,
  expandOn,
  isLast,
  expandableKey = "",
  isExpanded = false,
  setIsExpanded,
}: IDefaultCellProps) => {
  const ref = useRef(null);
  //
  const handleClick = (e) => {
    const btn = ref.current;
    if (btn && !btn.contains(e.target)) {
      if (column.action) {
        column.action(row);
      }
    }
    if (!btn) {
      if (column.action) {
        column.action(row);
      }
    }
  };

  return (
    <TableCell key={column.id} onClick={(e) => handleClick(e)} css={cellCss(column.action, isLast)}>
      {column.id === expandOn ? row[column.id] || row.name || "-" : row[column.id] || "-"}
      {row[expandableKey] && column.id === expandOn && (
        <IconButton ref={ref} css={expandableButtonCss} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      )}
    </TableCell>
  );
};
