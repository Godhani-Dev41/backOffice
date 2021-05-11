/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { useHistory, useLocation } from "react-router-dom";
import { CTAButton } from "../../shared/Button/CTAButton";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { Tag } from "../../shared/Tag";
import { ICustomer } from "../../../types/customers";
import moment from "moment";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "../../../lib/form";

const container = css`
  background: #ffffff;
  box-shadow: 0px 2px 22px 8px rgba(21, 93, 148, 0.0749563);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  width: 300px;
`;

const imgContainer = css`
  display: flex;
  width: 100%;
  justify-content: space-between;
  items-align: start;
  margin-bottom: 1.5rem;
  img {
    height: 44px;
    width: 44px;
    border-radius: 100px;
  }
`;

const justifyBetween = css`
  display: flex;
  justify-content: space-between;
`;

const detailsCss = css`
  ${justifyBetween};
  width: 100%;
  flex-wrap: wrap;
`;

const paymentsCss = css`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const personNameCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 20px;
  color: ${colors.brandPrimary};
`;

const textCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 15px;
  color: ${colors.formInputBg};
  margin: 0 2px;
`;

const iconCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const iconImgCss = css`
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

const tagsWrapper = css`
  display: flex;
  flex-wrap: wrap;
  div {
    margin-right: 5px;
  }
`;

interface Props {
  member: ICustomer;
}

export const MemberCard = ({ member }: Props) => {
  const location = useLocation();
  const history = useHistory();
  return (
    <div css={container}>
      <div css={imgContainer}>
        {member.profilePicture ? (
          <img src={member.profilePicture.url || ""} alt="a" />
        ) : (
          <ReactSVG src="assets/media/icons/customers/image_placeholder.svg" css={iconImgCss} />
        )}
        <div>
          <CTAButton
            onClick={() => {
              history.push(`${location.pathname.replace("/overview", "")}/customer/${member.id}/overview`);
            }}
            css={textCss}
          >
            {TranslationEn.customers.familyPage.viewProfile}
          </CTAButton>
        </div>
      </div>
      <div css={detailsCss}>
        <span css={personNameCss}>
          {!member.firstName && !member.lastName ? "-" : `${member.firstName || "-"} ${member.lastName || "-"}`}
        </span>
        <div css={tagsWrapper}>
          {/* <Tag title="Parent" />
          <Tag title="Active" />
          <Tag title="Billed To" /> */}
        </div>
      </div>
      <div css={paymentsCss}>
        <ReactSVG src="assets/media/icons/customers/wallet.svg" css={iconCss} />
        <span css={textCss}>
          {TranslationEn.customers.listColumns.balance}:{Pricify(member.balance)}{" "}
        </span>
        <span css={textCss}>
          {TranslationEn.customers.listColumns.balance}:{Pricify(member.balance)}
        </span>
      </div>
      <div css={detailsCss}>
        <span css={textCss}>#{member.id}</span>
        <span css={justifyBetween}>
          <ReactSVG css={iconCss} src="assets/media/icons/customers/clock.svg" />
          <span css={textCss}>
            {TranslationEn.customers.customerHeader.lastActivity} {moment(member.updatedAt).format("MMM DD,YYYY")}
          </span>
        </span>
      </div>
    </div>
  );
};
