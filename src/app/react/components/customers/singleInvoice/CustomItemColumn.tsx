/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { ReactSVG } from "react-svg";
import { flex, flexCol } from "../../../styles/utils";
import { colors } from "../../../styles/theme";

const textCss = css`
  ${flexCol};
  div {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    display: flex;
    align-items: center;
  }

  .item-name {
    color: ${colors.brandPrimary};
    font-size: 1.4rem;
    line-height: 130%;
  }
  .item-description {
    color: ${colors.formInputBg};
    font-size: 1.2rem;
    line-height: 1.5rem;
  }
`;

const placeholderContainerCss = css`
  ${flex};
  padding: 12px;
  justify-content: center;
  border-radius: 2px;
  margin: 10px;
  background: ${colors.formControlBg};
`;

const placeholderIconCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  svg {
    height: 24px;
    width: 24px;
  }
`;

export const CustomItemColumn = ({ name, description, img }) => (
  <div css={flex}>
    {img ? (
      <img src={img} />
    ) : (
      <div css={placeholderContainerCss}>
        <ReactSVG src="assets/media/icons/customers/image_placeholder.svg" css={placeholderIconCss} />
      </div>
    )}
    <div css={textCss}>
      <div className="item-name">{name}</div>
      <span className="item-description">{description ? description.slice(0, 30) : "description"}</span>
    </div>
  </div>
);
