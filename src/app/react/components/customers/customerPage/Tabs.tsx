/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { NavLink, Link, useParams, useHistory } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { Tab } from "./Tab";

interface ISingleTab {
  title: string;
  link: string;
}

interface ITabsProps {
  id: string;
  tabs: ISingleTab[];
}

const TabsCss = css`
  display: flex;
  margin: 2rem 2rem 1rem 2rem;
  .link {
    padding: 1rem;
    margin-right: 1rem;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 17px;
    text-align: center;
    color: ${colors.brandPrimary};
    &:hover {
      background: ${colors.lightGray};
    }
  }
  .active {
    background: ${colors.brandPrimary};
    color: ${colors.white};
    padding: 1rem;
    margin-right: 1rem;
    border-radius: 2px;
    &:hover {
      background: ${colors.brandPrimary};
    }
  }
`;

export const Tabs = ({ tabs, id }: ITabsProps) => {
  return (
    <div css={TabsCss}>
      {tabs.map((tab, index) => {
        return <Tab key={index} title={tab.title} link={`${tab.link}`} />;
      })}
    </div>
  );
};
