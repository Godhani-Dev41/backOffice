/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import moment from "moment";
import clsx from "clsx";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import IconButton from "@material-ui/core/IconButton";
import { colors } from "../../../styles/theme";
import { CustomCheckbox } from "../Checkbox";
import { CellMapper } from "./Cell";
import { rowCss, cellCss } from "./styles";
import { checkboxCss, checkedIconCss, iconCss } from "../../../styles/utils";
import { ReactSVG } from "react-svg";

// classes: ReturnType<typeof useStyles>;
interface ExpandableRowProps {
  row: any;
  columns: any;
  isItemSelected: boolean;
  expandableKey: string;
  expandable: boolean;
  handleClick: any;
  isSelectRow: boolean;
  labelId: string;
  expandOn: string;
  isSelected: any;
  isLast: boolean;
  isHoverRow?: boolean;
  isExpand?: boolean;
}

interface IRedirectProps {
  id: number;
}

const checkboxCell = css`
  background: ${colors.lightGray};
`;

const CheckedIconCss = css`
  ${iconCss}
  ${checkedIconCss}
`;

export const ExpandableRow = ({
  row,
  columns,
  isItemSelected,
  expandableKey,
  isHoverRow,
  handleClick,
  isSelectRow,
  labelId,
  expandOn,
  expandable,
  isSelected,
  isLast,
  isExpand,
}: ExpandableRowProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const history = useHistory();
  useEffect(() => {
    setIsExpanded(isExpand);
  }, [isExpand]);
  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isSelected(row.name)}
        tabIndex={-1}
        key={row.name}
        selected={isSelected(row.name)}
        css={rowCss(isHoverRow, false)}
      >
        {isSelectRow && (
          <TableCell css={cellCss(true, isLast)} padding="checkbox" onClick={(event) => handleClick(event, row.name)}>
            <CustomCheckbox
              checked={isSelected(row.name)}
              inputProps={{ "aria-labelledby": labelId }}
              css={checkboxCss(false)}
              checkedIcon={
                <span
                  id="checked"
                  css={CheckedIconCss}
                  // className={clsx(classes.icon, classes.checkedIcon)}
                />
              }
              icon={<span css={iconCss} />}
            />
          </TableCell>
        )}
        {columns.map((column, index) => {
          return (
            <CellMapper
              expandableKey={expandableKey}
              key={index}
              isLast={isLast}
              setIsExpanded={setIsExpanded}
              isExpanded={isExpanded}
              type={column.type}
              column={column}
              row={row}
              index={index}
              expandOn={expandOn}
            />
          );
        })}
      </TableRow>
      {isExpanded &&
        expandable &&
        row[expandableKey] &&
        row[expandableKey].map((subRow, sindex) => {
          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={subRow.name + sindex}
              selected={isItemSelected}
              css={rowCss(isHoverRow, true)}
            >
              {isSelectRow && (
                <TableCell css={checkboxCell} padding="checkbox" onClick={(event) => handleClick(event, subRow.name)}>
                  <CustomCheckbox
                    checked={isSelected(subRow.name)}
                    inputProps={{ "aria-labelledby": labelId }}
                    css={checkboxCss(false)}
                    checkedIcon={
                      <span
                        css={CheckedIconCss}
                        // className={clsx(classes.icon, classes.checkedIcon)}
                      />
                    }
                    icon={<span css={iconCss} />}
                  />
                </TableCell>
              )}
              {columns.map((column, index) => {
                return (
                  <CellMapper
                    expandableKey={expandableKey}
                    isExpanded={isExpanded}
                    key={index}
                    // isLast={sindex + 1 === row[expandableKey].length}
                    type={column.type}
                    column={column}
                    row={subRow}
                    index={index}
                    expandOn={expandOn}
                    setIsExpanded={() => {}}
                  />
                );
              })}
            </TableRow>
          );
        })}
    </React.Fragment>
  );
};
