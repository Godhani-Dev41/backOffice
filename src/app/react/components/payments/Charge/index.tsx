/** @jsx jsx */

import React, { useState, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { SelectMethod } from "./selectMethod";
import { CTAButton } from "../../shared/Button/CTAButton";
import { flex, flexCol, flexEndCss, ChargeButtonCss, setOpacity } from "../../../styles/utils";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "../../../lib/form";
import { colors } from "../../../styles/theme";
import { ButtonLoader } from "../../shared/Loader";

import { Cash } from "./Cash";
import { Credit } from "./Credit";
import { Completed } from "./Completed";
import { Bank } from "./Bank";
import { Error } from "../Error";
import { NewCard } from "./newCard";
import { Scheduled } from "./ScheduledPopup";
import { ReactSVG } from "react-svg";
import { SimpleButton } from "../utils";
import { paymentApi } from "../../../lib/api/paymentApi";

const topCss = css`
  ${flexCol};
  margin-top: 1rem;
  border-bottom: 1px solid ${colors.borderSeperator};
  padding: 1rem;
  h1 {
    margin: 0;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
    text-align: center;
    color: ${colors.brandPrimary};
  }
  h2 {
    margin: 0;
    font-size: 1.2rem;
    line-height: 1.5rem;
    text-align: center;
    color: ${colors.formInputBg};
  }
`;

const bottomCss = css`
  ${flexEndCss};
  margin-top: 1rem;
  border-top: 1px solid ${colors.borderSeperator};
  padding: 1rem;
`;

const backButtonCss = css`
  ${flex};
  position: absolute;
  align-items: center;
  font-size: 1.2rem;
  line-height: 1.5rem;
  // color: ${colors.formInputBg};
  top: 0.75rem;
  left: 0.75rem;
  // background: none;
  // border: none;
`;

const iconCss = css`
  margin-right: 5px;
  div {
    justify-content: center;
    display: flex;
    align-items: center;
  }
`;
interface Props {
  toggle: () => void;
  totalAmount: number;
  userId: number;
  organizationId: number;
  orderId?: number;
  isAmountEditable?: boolean;
  alternativeHandleCharge?: (value: unknown) => void;
  isScheduled?: boolean;
}

export const Charge = ({
  toggle,
  totalAmount,
  userId,
  orderId,
  organizationId,
  isAmountEditable = true,
  alternativeHandleCharge,
  isScheduled = false,
}: Props) => {
  const [amount, setAmount] = useState<number>(totalAmount);
  const [method, setMethod] = useState<string>("");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [step, setStep] = useState<string>("");
  const [mainTitle, setMainTitle] = useState(TranslationEn.payments.payment);
  const [loader, setLoader] = useState<boolean>(false);
  const [prevStep, setPrevStep] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [subTitle, setSubTitle] = useState(
    `${TranslationEn.customers.paymentsInvoices.total}: ${Pricify(totalAmount)}`,
  );
  const [triggerForNewCardSubmission, setNewCCTrigger] = useState(false);
  // const { Component, submit } = useNewCard();

  useEffect(() => {
    setStep(method);
  }, [method]);

  useEffect(() => {
    if (isScheduled) {
      setMethod("scheduled_charge");
    }
  }, [isScheduled]);

  const handleError = (message) => {
    setStep("error");
    setErrorMessage(message);
    setLoader(false);
  };

  const paymentAction = (token, type) => {
    if (alternativeHandleCharge) {
      alternativeHandleCharge({ token, type, isNewCard: selectedCard === "new-card", amount });
    } else {
      const data = {
        orderId: orderId,
        amountToPay: Number(amount),
        organizationId: organizationId,
        payingUserId: userId,
        paymentMethodData: {
          token,
          type,
        },
      };

      paymentApi.payPartialBalance(data).then((res) => {
        if (res.statusCode === 500) {
          handleError(res.message);
        } else {
          setStep("completed");
          setLoader(false);
        }
      });
    }
  };

  const handleChargeClick = () => {
    if (!loader) {
      setLoader(true);
      if (step === "newCard") {
        // should be the logic of checkout after confirmation
        setNewCCTrigger(true);
      } else {
        paymentAction(selectedCard, method);
      }
    }
  };

  const updateSubTitle = () => {
    setSubTitle(`${TranslationEn.payments.subTitle.chargingAmount} - ${Pricify(Number(amount))}`);
  };

  useEffect(() => {
    switch (step) {
      case "card":
        setMainTitle(TranslationEn.payments.methods.card);
        setPrevStep("");
        updateSubTitle();
        break;
      case "ach":
        setMainTitle(TranslationEn.payments.methods.ach);
        setPrevStep("");
        updateSubTitle();
        break;
      case "cash":
        setMainTitle(TranslationEn.payments.methods.cash);
        setPrevStep("");
        updateSubTitle();
        setMethod("cash");
        break;
      case "completed":
        setMainTitle(TranslationEn.payments.purchaseCompleted);
        setSubTitle("");

        break;
      case "error":
        break;
      case "newAch":
        setMainTitle(TranslationEn.payments.methods.newAch);
        setPrevStep("ach");
        updateSubTitle();
        break;
      case "newCard":
        setPrevStep("card");
        setSelectedCard("new-card");
        setMainTitle(TranslationEn.payments.methods.newCard);
        updateSubTitle();
        break;
      case "scheduled_charge":
        break;
      case "":
        setMainTitle(TranslationEn.payments.payment);
        setSubTitle(`${TranslationEn.customers.paymentsInvoices.total}: ${Pricify(totalAmount)}`);
        break;
    }
  }, [step]);

  const Stepper = () => {
    switch (step) {
      case "":
        return (
          <SelectMethod
            isAmountEditable={isAmountEditable}
            totalAmount={totalAmount}
            toggle={toggle}
            amount={amount}
            setAmount={setAmount}
            method={method}
            setMethod={setMethod}
          />
        );
      case "card":
        return (
          <Credit setMethod={setMethod} userId={userId} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />
        );
      case "newCard":
        return (
          <NewCard
            userId={userId}
            trigger={triggerForNewCardSubmission}
            paymentAction={paymentAction}
            handleError={handleError}
          />
        );
      case "ach":
        return <Bank userId={userId} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />;
      case "cash":
        return (
          <Cash
            setSelectedCard={setSelectedCard}
            selectedCard={selectedCard}
            totalAmount={totalAmount}
            setAmount={setAmount}
          />
        );
      case "completed":
        return <Completed amount={amount} />;
      case "error":
        return <Error toggle={toggle} message={errorMessage} />;
      case "scheduled_charge":
        return (
          <Scheduled
            totalAmount={totalAmount}
            toggle={toggle}
            userId={userId}
            setMethod={setMethod}
            orderId={orderId}
            organizationId={organizationId}
          />
        );
      default:
        return <div>oops</div>;
    }
  };

  const isCompleted = step === "completed";
  const isError = step === "error";

  console.log(method);
  console.log(selectedCard);
  return (
    <div css={flexCol}>
      {method !== "" && !isCompleted && !isError && !isScheduled && (
        <div css={backButtonCss}>
          <SimpleButton onClick={() => setMethod(prevStep)}>
            <ReactSVG src="assets/media/icons/arrow-left.svg" css={iconCss} />
            {TranslationEn.payments.back}
          </SimpleButton>
        </div>
      )}
      {!isError && !isScheduled && (
        <div css={topCss}>
          {isCompleted && <ReactSVG src="assets/media/icons/check.svg" css={iconCss} />}
          <h1>{mainTitle}</h1>
          <h2>{subTitle}</h2>
        </div>
      )}
      {Stepper()}

      {!isCompleted && !isError && !isScheduled && (
        <div css={bottomCss}>
          <CTAButton onClick={toggle}>{TranslationEn.memberships.selectPage.cancel}</CTAButton>
          <CTAButton
            onClick={handleChargeClick}
            css={ChargeButtonCss}
            disabled={!amount || method === "" || selectedCard === ""}
          >
            {loader ? (
              <ButtonLoader />
            ) : (
              <React.Fragment>
                {TranslationEn.customers.paymentsInvoices.charge} {Pricify(Number(amount))}
              </React.Fragment>
            )}
          </CTAButton>
        </div>
      )}
    </div>
  );
};
