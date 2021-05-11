/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";

const TagColorsMapper = {
  yellow: {
    primary: "#F7B500",
    background: "#FEF4D9",
  },
  red: {
    primary: "#E02020",
    background: "#FBE4E4",
  },
  green: {
    primary: "#24C875",
    background: "#E5F8EE",
  },
  purple: {
    primary: "#A433C5",
    background: "#F4E7F8",
  },
  blue: {
    primary: "#4A90E2",
    background: "#EDF4FC",
  },
};

interface TagProps {
  title: string;
  color?: string;
}

const tagCss = (color: string) => css`
  background: ${TagColorsMapper[color].background};
  color: ${TagColorsMapper[color].primary};
  border-radius: 2px;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  padding: 4px;
  font-size: 1rem;
  line-height: 12px;
  text-align: center;
  text-transform: capitalize;
  margin-right: 5px;
  width: fit-content;
  height: fit-content;
`;

export const Tag = ({ title, color = "blue" }: TagProps) => {
  return <React.Fragment>{title && <div css={tagCss(color)}>{title}</div>}</React.Fragment>;
};
