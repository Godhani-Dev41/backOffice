/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";
import moment from "moment";
import { Tag } from "../../shared/Tag";
import { TranslationEn } from "../../../../../assets/i18n/en";
import { flex } from "../../../styles/utils";
import { EStatusColorMapper } from "../../../types/customers";
import { HeaderContainer, SideContainer, BackButton, MoreMenu, HeaderTitle, ClockLabel } from "../../shared/Header";
import { useComingSoonPopUp } from "../../shared/ComingSoon";
import { Pricify } from "../../../lib/form";

const leftPartContainer = css`
  display: flex;
  flex-direction: column;
`;

const CustomerNameTitle = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 24px;
  margin: 0;
  margin-right: 1rem;
  color: ${colors.brandPrimary};
`;

const reservationNumCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  margin-right: 10px;
  color: ${colors.formInputBg};
`;

const balanceContainer = css`
  background: white;
  padding: 1rem;
  margin-right: 1rem;
  text-align: left;
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

export const CustomerHeader = ({ customerState }: any) => {
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const moreMenuActions = [
    {
      label: "Download as PDF",
      action: ComingSoonToggle,
    },
    {
      label: "change account type",
      action: ComingSoonToggle,
    },
  ];

  const hashArr = location.hash.split("/");
  const backUrl = location.hash.includes("family") ? `/${hashArr[1]}/${hashArr[2]}` : "/";

  return (
    <React.Fragment>
      <HeaderContainer>
        <SideContainer>
          <BackButton to={backUrl} />
          <div css={leftPartContainer}>
            <div css={flex}>
              <HeaderTitle>
                {customerState.firstName} {customerState.lastName}
              </HeaderTitle>
              <Tag
                title={customerState.entityType === "user" ? "Individual" : customerState.entityType}
                color={EStatusColorMapper[customerState.entityType]}
              />
              <Tag title={customerState.status} color={EStatusColorMapper[customerState.status]} />
            </div>
            <div css={flex}>
              <div css={reservationNumCss}>#{customerState.id}</div>
              <ClockLabel>
                {TranslationEn.customers.customerHeader.lastActivity}{" "}
                {moment(customerState.updatedAt).format("MMM DD, YYYY")}
              </ClockLabel>
            </div>
          </div>
        </SideContainer>
        <SideContainer>
          <div css={flex}>
            <div css={balanceContainer}>
              {TranslationEn.customers.listColumns.balance}: <span>{Pricify(Number(customerState.balance))}</span>
            </div>
            <MoreMenu actions={moreMenuActions} />
          </div>
        </SideContainer>
      </HeaderContainer>
      <ComingSoonModal />
    </React.Fragment>
  );
};

// const NoteModal = () => (
//   <div style={{ padding: "1rem" }}>
//     <div>
//       <div>Add Note</div>
//       <textarea />
//     </div>
//     <div>
//       <button>CANCEL</button>
//       <button>ADD</button>
//     </div>
//   </div>
// );
