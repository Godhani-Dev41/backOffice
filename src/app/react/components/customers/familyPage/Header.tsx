/** @jsx jsx */

import React, { useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { Link } from "react-router-dom";
import { colors } from "../../../styles/theme";
import { CTAButton } from "../../shared/Button/CTAButton";
import { ReactSVG } from "react-svg";
import moment from "moment";
import { INote } from "../../../types/notes";
import { Notes } from "./Notes";
import { Tag } from "../../shared/Tag";
import { PopoverComp } from "../../shared/Popover";
import { HeaderContainer, SideContainer, BackButton, MoreMenu, HeaderTitle, ClockLabel } from "../../shared/Header";
import { TranslationEn } from "assets/i18n/en";
import { useComingSoonPopUp } from "../../shared/ComingSoon";

const customerHeaderContainer = css`
  display: flex;
  justify-content: space-between;
  background: white;
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  padding: 1rem;
`;

const flex = css`
  display: flex;
  align-items: center;
`;

const leftPartContainer = css`
  display: flex;
  flex-direction: column;
`;

const iconBackCss = css`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
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

const CustomerNameTitle = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 2.4rem;
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
  color: ${colors.formInputBg};
`;

const dateCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.ligntText};
  display: flex;
  align-items: center;
`;
const clockIconCss = css`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
  cursor: pointer;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
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
    line-height: 130%;
    flex-grow: 1;
    &:hover {
      background: ${colors.formControlBg};
    }
  }
`;

const InitialNotes = [
  {
    content: "example example example",
    datetime: "2020-10-20T09:59:18.224Z",
  },
];

export const FamilyHeader = ({ customerState }: any) => {
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<Array<INote>>([]);
  const toggle = () => setNotesOpen(!isNotesOpen);
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();

  const moreMenuActions = [
    {
      label: TranslationEn.customers.paymentsInvoices.downloadAsPDF,
      action: ComingSoonToggle,
    },
  ];

  return (
    <React.Fragment>
      <HeaderContainer>
        <SideContainer>
          <BackButton to="/" />
          <div css={leftPartContainer}>
            <div css={flex}>
              <h1 css={CustomerNameTitle}>{customerState.name}</h1>
              <Tag
                title={customerState.entityType === "user" ? "Individual" : customerState.entityType}
                color={"purple"}
              />
              <Tag title={customerState.status} color={"blue"} />
            </div>
            <div css={flex}>
              <div css={reservationNumCss}>#{customerState.id}</div>
            </div>
          </div>
        </SideContainer>
        <SideContainer>
          <div css={balanceContainer}>
            {TranslationEn.customers.familyPage.familyBalance}: <span>{customerState.balance || "-"}</span>
          </div>
          <CTAButton onClick={() => ComingSoonToggle()}>{TranslationEn.customers.familyPage.addFamilyMember}</CTAButton>
          <PopoverComp
            background
            content={
              <Notes notes={notes} toggle={() => setNotesOpen(false)} handleAdd={(val) => setNotes([...notes, val])} />
            }
            open={isNotesOpen}
            placement="bottom"
            onClose={() => setNotesOpen(false)}
            marginTop="3rem"
          >
            <button
              style={{ margin: "0 3px 0 10px", background: "transparent", border: "none" }}
              onClick={() => ComingSoonToggle()}
            >
              <ReactSVG
                css={iconMoreCss}
                src={`assets/media/icons/customers/header/${notes.length === 0 ? "subtract" : "active_substract"}.svg`}
              />
            </button>
          </PopoverComp>
          <MoreMenu actions={moreMenuActions} />
        </SideContainer>
      </HeaderContainer>
      <ComingSoonModal />
    </React.Fragment>
  );
};
