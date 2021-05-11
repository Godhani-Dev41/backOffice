/** @jsx jsx */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { jsx, css } from "@emotion/react";
import { flex, flexCol, dateCss, timeCss } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { Pricify } from "../../../lib/form";
import { TranslationEn } from "assets/i18n/en";
import { ReactSVG } from "react-svg";

const paymentContainerCss = css`
  ${flex};
  padding: 1rem;
  justify-content: space-between;
  .marginY {
    margin: 10px 0;
  }
`;

const priceCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2rem;
  color: ${colors.brandPrimary};
  text-align: right;
`;
const imgCss = css`
  width: 36px;
  height: 36px;
  border-radius: 36px;
  margin-right: 5px;
`;

const seperator = css`
  display: block;
  width: 5px;
  height: 10px;
`;

const iconCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  background: ${colors.formControlBg};
  padding: 10px;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Info = ({ label, paymentState, customerState }) => {
  return (
    <div css={paymentContainerCss}>
      <div css={flexCol}>
        <label style={{ margin: 0 }}>{label}</label>
        <div className="marginY">
          <span css={dateCss}>{moment(paymentState.updatedAt).format("MMM DD, YYYY")}</span>
          <span css={timeCss}>{moment(paymentState.updatedAt).format("HH:mm A")}</span>
        </div>
      </div>
      <div css={flexCol}>
        <label style={{ margin: 0 }}>{TranslationEn.customers.customer}</label>
        <div css={flex}>
          {customerState.profilePicture ? (
            <img css={imgCss} src={customerState.profilePicture.url} />
          ) : (
            <ReactSVG src="assets/media/icons/customers/image_placeholder.svg" css={iconCss} />
          )}

          <div className="marginY">
            <span css={dateCss}>
              {customerState.firstName} {customerState.lastName}
            </span>
            <span css={timeCss}>
              {customerState.email}
              <span css={seperator} />
              {customerState.phoneNumber}
            </span>
          </div>
        </div>
      </div>
      <div css={priceCss}>{Pricify(paymentState.price)}</div>
    </div>
  );
};
