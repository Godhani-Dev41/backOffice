/** @jsx jsx */
import React, { ReactElement, Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { Box, ClickAwayListener, Fade, Paper, Popper, PopperPlacementType } from "@material-ui/core";
import { Theme, createStyles } from "@material-ui/core/styles";
import { colors } from "../../../styles/theme";

interface Props {
  content: ReactElement;
  children: ReactElement;
  open: boolean;
  onClose?: () => void;
  background?: boolean;
  marginTop?: string | number;
  arrow?: boolean;
  placement?: PopperPlacementType;
}

const popoverRootCss = css`
  background-color: ${colors.white};
  max-width: 1000px;
`;

const contentCss = css`
  padding: 5px 0;
`;

const bottomCss = css`
  top: 0;
  left: 0;
  margin-top: -0.71em;
  margin-left: 4px;
  margin-right: 4px;
  &:before {
    transform-origin: 0 100%;
  }
`;

const topCss = css`
  bottom: 0;
  left: 0;
  margin-bottom: -0.71em;
  margin-left: 4px;
  margin-right: 4px;
  &:before {
    transform-origin: 100% 0;
  }
`;

const leftCss = css`
  right: 0;
  margin-right: -0.71em;
  height: 1em;
  width: 0.71em;
  margin-top: 4px;
  margin-bottom: 4px;
  &:before {
    transform-origin: 0 0;
  }
`;

const rightCss = css`
  left: 0;
  margin-left: -0.71em;
  height: 1em;
  width: 0.71em;
  margin-top: 4px;
  margin-bottom: 4px;
  &:before {
    transform-origin: 100% 100%;
  }
`;

const backgroundCss = css`
  background: black;
  opacity: 0.5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: fixed;
  z-index: 1001;
`;

const popperCss = (placement: string) => css`
  z-index: 2000;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  .arrow{
  ${placement === "bottom" && bottomCss}
  ${placement === "left" && leftCss}
  ${placement === "top" && topCss}
  ${placement === "right" && rightCss}
  }
`;

const arrowCss = css`
  overflow: hidden;
  position: absolute;
  width: 1em;
  height: 0.71em;
  box-sizing: border-box;
  color: ${colors.white};
  &:before {
    content: "";
    margin: auto;
    display: block;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    background-color: ${colors.white};
    transform: rotate(45deg);
  }
`;

export const PopoverComp = ({
  placement = "top",
  arrow = true,
  open,
  onClose = () => {},
  content,
  background = false,
  marginTop = 0,
  children,
}: Props) => {
  const [arrowRef, setArrowRef] = React.useState<HTMLElement | null>(null);
  const [childNode, setChildNode] = React.useState<HTMLElement | null>(null);
  return (
    <Fragment>
      {React.cloneElement(children, { ...children.props, ref: setChildNode })}
      <Popper
        open={open}
        anchorEl={childNode}
        placement={placement}
        transition
        id="poper"
        // className={classes.popper}
        css={popperCss(placement)}
        style={{ marginTop }}
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: "window",
          },
          arrow: {
            enabled: arrow,
            element: arrowRef,
          },
        }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={onClose}>
                <Paper
                  css={popoverRootCss}
                  // className={classes.popoverRoot}
                >
                  {arrow ? <span className="arrow" css={arrowCss} ref={setArrowRef} /> : null}
                  <Box>{content}</Box>
                </Paper>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {open && background && <div css={backgroundCss} />}
    </Fragment>
  );
};
