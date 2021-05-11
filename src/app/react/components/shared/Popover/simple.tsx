/** @jsx jsx */
import React, { FC } from "react";
import { jsx, css } from "@emotion/react";
import Popover from "@material-ui/core/Popover";
import { colors } from "../../../styles/theme";

const toggleButton = css`
  background: none;
  padding: 0;
  width: min-content;
  border: none;
  border-radius: 100px;
  &:hover {
    background: ${colors.formControlBg};
  }
`;

const paperCss = css`
  padding: 5px 0;
  z-index: 1002;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
`;

interface IProps {
  button: JSX.Element;
  callback?: () => void;
}
export const PopoverComp: FC<IProps> = ({ button, callback = () => {}, children }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    callback();
  };

  const handleClose = () => {
    setAnchorEl(null);
    callback();
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <button css={toggleButton} onClick={handleClick}>
        {button}
      </button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        css={paperCss}
      >
        {children}
      </Popover>
    </div>
  );
};
