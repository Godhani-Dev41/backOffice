/** @jsx jsx */

import React, { FC, useState } from "react";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { PopoverComp } from "../Popover";
import { ReactSVG } from "react-svg";

const moreButtonContainer = css`
  display: flex;
  flex-direction: column;
  button {
    color: ${colors.brandPrimary};
    background: white;
    border: none;
    padding: 1rem 2rem;
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    text-align: left;
    line-height: 130%;
    flex-grow: 1;
    &:hover {
      background: ${colors.formControlBg};
    }
  }
`;

const iconMoreCss = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

interface IAction {
  label: string;
  action: () => void;
}

interface Props {
  actions?: IAction[];
}

export const MoreMenu: FC<Props> = ({ children, actions }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const Body = () => (
    <div css={moreButtonContainer}>
      {actions.map((action, index) => {
        return (
          <button key={index} onClick={action.action}>
            {action.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <PopoverComp
      content={<Body />}
      open={isMenuOpen}
      placement="bottom"
      onClose={() => setMenuOpen(false)}
      arrow={false}
    >
      <button style={{ margin: "0 5px", background: "transparent", border: "none" }} onClick={() => setMenuOpen(true)}>
        <ReactSVG css={iconMoreCss} src="assets/media/icons/customers/more.svg" />
      </button>
    </PopoverComp>
  );
};
