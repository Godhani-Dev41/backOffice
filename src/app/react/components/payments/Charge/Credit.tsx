/** @jsx jsx */

import React, { FC, useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { CheckboxButton, SimpleButton } from "../utils";
import { flexCol, flex } from "../../../styles/utils";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { TranslationEn } from "assets/i18n/en";
import { paymentApi } from "../../../lib/api/paymentApi";
import { PaymentMethod } from "../../../types/payment";

const ContainerCss = css`
  ${flexCol};
  padding: 2rem 10rem;
  justify-content: center;
  align-items: center;
`;

const wrapContainerCss = css`
  ${flex};
  max-width: 300px;
  flex-wrap: wrap;
  justify-content: center;
`;

const topPartCss = css`
  ${flexCol};
  margin: 0;
`;

const iconCss = css`
  margin-right: 0.5rem;
  div {
    display: flex;
    justify-content: center;
    aling-items: center;
  }
`;

const middleCss = css`
  color: ${colors.ligntText};
  font-size: 1.2rem;
  line-height: 1.5rem;
  margin-top: 1rem;
`;

const primeryTitle = css`
  font-size: 1.4rem;
  line-height: 130%;
  text-align: center;
  color: ${colors.brandPrimary};
`;

const cardPlaceholder = css`
  width: 90px;
  height: 45px;
  margin: 5px;
`;

interface Props {
  userId: number;
  selectedCard: string;
  setSelectedCard: (val: string) => void;
  setMethod: (val: string) => void;
  setFullSelectedCard?: (val) => void;
}

export const Credit = ({ userId, selectedCard, setSelectedCard, setMethod, setFullSelectedCard }: Props) => {
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loader, setLoader] = useState<boolean>(true);
  useEffect(() => {
    paymentApi.paymentMethods(userId).then((res) => {
      setCards(
        res.filter((paymentMethod) => {
          if (paymentMethod.type === "card") {
            return paymentMethod;
          }
        }),
      );
      setLoader(false);
    });
  }, []);
  return (
    <div css={ContainerCss}>
      <div css={topPartCss}>
        {loader ? (
          <div css={wrapContainerCss}>
            <div css={cardPlaceholder} className="skeleton" />
            <div css={cardPlaceholder} className="skeleton" />
            <div css={cardPlaceholder} className="skeleton" />
            <div css={cardPlaceholder} className="skeleton" />
            <div css={cardPlaceholder} className="skeleton" />
            <div css={cardPlaceholder} className="skeleton" />
          </div>
        ) : (
          cards.length !== 0 && (
            <React.Fragment>
              <div css={primeryTitle}>{TranslationEn.payments.useExisiting}</div>
              <div css={wrapContainerCss}>
                {cards.map((card, index) => {
                  return (
                    <CheckboxButton
                      key={index}
                      onClick={() => {
                        setSelectedCard(card.id);
                        if (setFullSelectedCard) {
                          setFullSelectedCard(card);
                        }
                      }}
                      active={selectedCard === card.id}
                    >
                      <ReactSVG
                        css={iconCss}
                        src={`assets/media/icons/payments/payment_method/${card.card.brand}.svg`}
                      />
                      {card.card.last4}
                    </CheckboxButton>
                  );
                })}
              </div>
            </React.Fragment>
          )
        )}
      </div>
      {cards.length !== 0 && <div css={middleCss}>{TranslationEn.payments.or}</div>}
      <div css={topPartCss}>
        {/* <SimpleButton>
          <ReactSVG src={`assets/media/icons/payments/card.svg`} css={iconCss} />
          {TranslationEn.payments.swipeCard}
        </SimpleButton> */}
        <SimpleButton onClick={() => setMethod("newCard")}>
          <ReactSVG src={`assets/media/icons/edit.svg`} css={iconCss} />
          {TranslationEn.payments.enterManually}
        </SimpleButton>
      </div>
    </div>
  );
};
