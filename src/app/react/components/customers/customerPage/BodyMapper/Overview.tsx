/** @jsx jsx */

import React, { useEffect, useState } from "react";
import moment from "moment";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../../styles/theme";
import { ReactSVG } from "react-svg";
import clsx from "clsx";
import { FormPart } from "../../utils/formPart";
import { FrameContainer } from "../../utils/FrameContainer";
import { Message } from "../../utils/Message";
import { CTAButton } from "../../../shared/Button/CTAButton";
import { TCustomer } from "../../../../types/customers";
import { TranslationEn } from "../../../../../../assets/i18n/en";
import { useComingSoonPopUp } from "../../../shared/ComingSoon";

const imageContainerCss = css`
  background: ${colors.white};
  border: 1px dashed ${colors.formInputBg};
  box-sizing: border-box;
  box-shadow: 0px 1.57143px 17.2857px 6.28571px rgba(21, 93, 148, 0.0749563);
  border-radius: 1.57143px;
  padding: 3rem;
`;

const iconCss = css`
  height: 60px;
  width: 60px;
  margin: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const overviewContainer = css`
  display: flex;
  margin: 2rem 0 0 0;
  height: 100%;
`;
const leftContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0rem 1rem 2rem 2rem;
`;

const frameContainer = css`
  background: white;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  padding: 1rem;
  width: 100%;
  margin-bottom: 2rem;
`;

const balanceContainer = css`
  background: white;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  padding: 1rem;
  width: 100%;
  text-align: left;
  margin: 2rem 0;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 20px;
  color: ${colors.brandPrimary};
  span {
    color: ${colors.statusGreen};
  }
`;

const mainContainer = css`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0rem 0 0 0;
  height: 500px;
  flex-grow: 1;
`;

const detailsPartCss = css`
  display: flex;
  flex-wrap: wrap;
`;

const waiverCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 20px;
  margin: 1rem 0;
  color: ${colors.brandPrimary};
`;

const mainCon = css`
  overflow: auto;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding-right: 1rem;
`;

const waiverDownloadCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.4rem;
  line-height: 17px;
  color: ${colors.brandPrimary};
  width: 100%;
  border: 1px solid #dae6f0;
  border-left: 0;
  border-right: 0;
  padding: 1rem;
  margin: 1rem 0;
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
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const imgCss = css`
  width: 224px;
  height: 224px;
  border-radius: 300px;
`;

export const Overview = ({ customerState }: any) => {
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  return (
    <React.Fragment>
      <div css={overviewContainer}>
        <div css={leftContainer}>
          <div css={imageContainerCss}>
            {customerState.profilePicture && customerState.profilePicture.url ? (
              <img css={imgCss} src={customerState.profilePicture.url} />
            ) : (
              <ReactSVG src="assets/media/icons/customers/image_placeholder.svg" css={iconCss} />
            )}
          </div>
        </div>
        <div css={mainCon}>
          <div css={mainContainer}>
            {/* <Message type={"cta"}>
            <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
              Ben Ford have birthday on Mar 9 2021
              <CTAButton>boom</CTAButton>
            </div>
          </Message>
          <Message isClosable type={"note"}>
            The waiver is about to expire
          </Message>
          <Message type={"note"}>The waiver is about to expire</Message> */}
            <FrameContainer
              title={TranslationEn.customers.paymentsInvoices.customerDetails}
              button={
                <CTAButton onClick={() => ComingSoonToggle()}>
                  {TranslationEn.customers.customerHeader.editProfile}
                </CTAButton>
              }
            >
              <div css={detailsPartCss}>
                <FormPart
                  label={TranslationEn.customers.listColumns.firstName}
                  value={customerState.firstName || "-"}
                />
                <FormPart
                  label={TranslationEn.customers.listColumns.lastName}
                  value={customerState.lastName || customerState.name}
                />
                <FormPart
                  label={TranslationEn.customers.listColumns.phoneNumber}
                  value={customerState.phoneNumber || "-"}
                />
                <FormPart label={TranslationEn.customers.customerPage.email} value={customerState.email || "-"} />
              </div>
              <div css={detailsPartCss}>
                <FormPart
                  label={TranslationEn.customers.customerPage.gender}
                  value={customerState.gender ? TranslationEn.gender[customerState.gender] : "-"}
                />
                <FormPart
                  label={TranslationEn.customers.customerPage.dateOfBirth}
                  value={(customerState.birthDate && moment(customerState.birthDate).format("MMM DD, YYYY")) || "-"}
                />
                <FormPart
                  label={TranslationEn.customers.customerPage.age}
                  value={
                    (customerState.birthDate && moment().diff(moment(customerState.birthDate), "years", false)) || "-"
                  }
                />
                <FormPart
                  label={TranslationEn.customers.customerPage.address}
                  value={
                    customerState.address
                      ? `${customerState.address.street || ""}, ${customerState.address.streetNum || ""} `
                      : "-"
                  }
                />
                <FormPart
                  label={TranslationEn.customers.customerPage.city}
                  value={
                    customerState.address
                      ? `${customerState.address.city || ""}, ${customerState.address.state || ""} `
                      : "-"
                  }
                />
                <FormPart
                  label={TranslationEn.customers.customerPage.zip}
                  value={(customerState.address && customerState.address.zip) || "-"}
                />
              </div>
            </FrameContainer>
            {customerState.waiverSignedDate && (
              <FrameContainer title="Waiver">
                <div css={waiverDownloadCss}>
                  Waiver until {moment(customerState.waiverSignedDate).format("MMM DD, YYYY")}
                  <div onClick={() => ComingSoonToggle()}>
                    <ReactSVG src="assets/media/icons/customers/download.svg" css={downloadIconCss} />
                  </div>
                </div>
              </FrameContainer>
            )}
          </div>
        </div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
