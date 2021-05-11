/** @jsx jsx */
import React from "react";
import { Link } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import { jsx, css } from "@emotion/react";

import { Status } from "./Status";
import { DefaultCell } from "./Default";
import { Age } from "./Age";
import { Balance } from "./Balance";
import { DateTime } from "./DateTime";
import { Date } from "./Date";
import { BooleanCell } from "./Boolean";
import { Currency } from "./Currency";
import { Description } from "./Description";

import { ReactSVG } from "react-svg";
import { cellCss, iconCell } from "../styles";

interface CellMapperProps {
  type: string;
  column: any;
  row: any;
  index: number;
  expandOn: string;
  expandableKey: string;
  isLast?: boolean;
  isExpanded: boolean;
  setIsExpanded: any;
}

export const CellMapper = ({
  type,
  column,
  row,
  index,
  expandOn,
  isLast = false,
  expandableKey = "",
  isExpanded = false,
  setIsExpanded = () => {},
}: CellMapperProps) => {
  const cellProps = {
    row,
    column,
    index,
  };
  switch (type) {
    case "icon":
      let icon = <ReactSVG css={iconCell} src={`assets/media/icons/table/${column.id}.svg`} />;
      return (
        <TableCell
          key={column.id}
          onClick={() => {
            if (column.id === "email" && row[column.id]) {
              column.action(row);
            }
            if (column.id !== "email") {
              column.action(row);
            }
          }}
          css={cellCss(column.action, isLast, true)}
        >
          {column.id === "email" && row[column.id] && icon}
          {column.id !== "email" && icon}
        </TableCell>
      );
    case "status":
      return <Status row={row} isLast={isLast} column={column} index={index} />;
    case "balance":
      return <Balance row={row} isLast={isLast} column={column} index={index} />;
    case "age":
      return <Age row={row} isLast={isLast} column={column} index={index} />;
    case "boolean":
      return <BooleanCell isLast={isLast} expandableKey={expandableKey} row={row} column={column} index={index} />;
    case "datetime":
      return <DateTime row={row} isLast={isLast} column={column} index={index} />;
    case "date":
      return <Date row={row} isLast={isLast} column={column} index={index} />;
    case "currency":
      return <Currency row={row} isLast={isLast} column={column} index={index} />;
    case "description":
      return <Description row={row} isLast={isLast} column={column} index={index} />;
    case "custom":
      return (
        <TableCell key={column.id} onClick={() => column.action(row)} css={cellCss(column.action, isLast)}>
          {column.component(row[column.id])}
        </TableCell>
      );
    default:
      return (
        <DefaultCell
          isLast={isLast}
          expandableKey={expandableKey}
          key={index}
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          type={column.type}
          column={column}
          row={row}
          index={index}
          expandOn={expandOn}
        />
      );
  }
};
