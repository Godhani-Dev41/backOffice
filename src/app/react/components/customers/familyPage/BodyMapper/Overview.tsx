/** @jsx jsx */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../../styles/theme";
import { ReactSVG } from "react-svg";
import clsx from "clsx";
import { FormPart } from "../../utils/formPart";
import { FrameContainer } from "../../utils/FrameContainer";

import { CTAButton } from "../../../shared/Button/CTAButton";
import { TCustomer } from "../../../../types/customers";
import { MemberCard } from "../MemberCard";
import { TranslationEn } from "assets/i18n/en";
import { useComingSoonPopUp } from "../../../shared/ComingSoon";

const overviewContainer = css`
  display: flex;
  margin: 2rem 0 0 0;
  height: 100%;
`;

const scrollWrapperCss = css`
  flex-direction: column;
  display: flex;
`;
const subScrollWrapperCss = css`
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  height: 500px;
  overflow: auto;
`;

const leftContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 1rem 2rem 2rem;

  overflow-x: visible;

  padding-right: 1rem;
`;

const mainContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 1rem 2rem 2rem;
  overflow-x: visible;
  padding-right: 1rem;

  // margin: 2rem 0 0 0;
  // height: 500px;
  // flex-grow: 1;
`;

const detailsPartCss = css`
  display: flex;
  flex-wrap: wrap;
`;

const waiverDownloadCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 17px;
  color: ${colors.brandPrimary};
  width: 100%;
  border-bottom: 1px solid #dae6f0;
  padding: 1rem;
  padding-top: 0;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const downloadIconCss = css`
  height: 20px;
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  border-radius: 100px;
  padding: 3px;
  cursor: pointer;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

interface Props {
  customerState: TCustomer;
}
// In Progress

export const Overview = ({ customerState }: Props) => {
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  return (
    <React.Fragment>
      <div css={overviewContainer}>
        <div css={scrollWrapperCss}>
          <div css={subScrollWrapperCss}>
            <div css={leftContainer}>
              {customerState.members.map((member, index) => {
                return <MemberCard member={member} key={index} />;
              })}
            </div>
          </div>
        </div>

        <div css={scrollWrapperCss}>
          <div css={subScrollWrapperCss}>
            <div css={mainContainer}>
              <FrameContainer
                title="Family Details"
                button={
                  <CTAButton onClick={() => ComingSoonToggle()}>
                    {TranslationEn.customers.customerHeader.editProfile}
                  </CTAButton>
                }
              >
                <div css={detailsPartCss}>
                  <FormPart label="ACCOUNT NAME" value={customerState.name || "-"} />
                  <FormPart label="REGISTRATION DATE" value={moment(customerState.createdAt).format("MMM DD,YYYY")} />
                  <FormPart label="PHONE" value={customerState.phoneNumber || "-"} />
                  <FormPart label="EMAIL" value={customerState.email || "-"} />
                </div>
                <div css={detailsPartCss}>
                  <FormPart
                    label="address"
                    value={
                      (customerState.address &&
                        customerState.address.street + ", " + customerState.address.streetNum) ||
                      "-"
                    }
                  />
                  <FormPart
                    label="city"
                    value={
                      (customerState.address && customerState.address.city + ", " + customerState.address.state) || "-"
                    }
                  />
                  <FormPart label="zip code" value={(customerState.address && customerState.address.zip) || "-"} />
                </div>
              </FrameContainer>

              {/* <FrameContainer title="EMERGENCY CONTACT">
                <div style={{ display: "flex" }}>
                  <FormPart width={100} label="contact name" value="Mike  Albertson" />
                  <FormPart width={100} label="Phone no." value="323.2345.678" />
                </div>
              </FrameContainer> */}
              {/* <FrameContainer title="FILES" button="Upload file">
              <div css={waiverDownloadCss}>
                File number one
                <div style={{ display: "flex" }}>
                  <ReactSVG src="assets/media/icons/customers/download.svg" css={downloadIconCss} />
                  <ReactSVG src="assets/media/icons/customers/more.svg" css={downloadIconCss} />
                </div>
              </div>
              <div css={waiverDownloadCss}>
                Another file
                <div style={{ display: "flex" }}>
                  <ReactSVG src="assets/media/icons/customers/download.svg" css={downloadIconCss} />
                  <ReactSVG src="assets/media/icons/customers/more.svg" css={downloadIconCss} />
                </div>
              </div>
            </FrameContainer>
            <FrameContainer title="TAGS" button="Edit tags">
              <div>
                <span>tags</span>
                <span>long tags</span>
                <span>verylong tag</span>
              </div>
            </FrameContainer> */}
            </div>
          </div>
        </div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
