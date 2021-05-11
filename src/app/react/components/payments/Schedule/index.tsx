/** @jsx jsx */

import React, { useState, useEffect, Fragment } from "react";
import { jsx, css } from "@emotion/react";

import { flex, flexCol, flexEndCss, ChargeButtonCss, setOpacity } from "../../../styles/utils";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "../../../lib/form";
import { colors } from "../../../styles/theme";
import { PaymentMethod, IPayment } from "../../../types/payment";

// import { SelectMethod } from "./selectMethod";
// import { Cash } from "./Cash";
// import { Completed } from "./Completed";
// import { Bank } from "./Bank";
import { Credit } from "../Charge/Credit";
import { NewCard } from "../Charge/newCard";
import { AddSchedulePayment } from "./addSchedulePayment";
import { ConfirmScheduled } from "./confirmScheduled";
import { Reschedule } from "./Reschedule";

import { Footer } from "../utils/footer";

import { Error } from "../Error";
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

const justifyCenterCss = css`
  ${flex};
  justify-content: center;
`;

interface Props {
  toggle: () => void;
  totalAmount?: number;
  userId?: number;
  organizationId?: number;
  orderId?: number;
  reschedule?: boolean;
  isAmountEditable?: boolean;
  scheduledPayments?: IPayment[];
  alternativeHandleCharge?: (value: unknown) => void;
}

export const SchedulePayment = ({
  toggle,
  totalAmount,
  userId,
  orderId,
  organizationId,
  reschedule = false,
  scheduledPayments = [],
  isAmountEditable = true,
  alternativeHandleCharge,
}: Props) => {
  const [payments, setPayments] = useState<IPayment[]>(scheduledPayments);
  const [addScheduleState, setScheduleState] = useState({});
  const [fullselectedCard, setFullSelectedCard] = useState<PaymentMethod>();

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
    setPayments(scheduledPayments);
  }, [scheduledPayments]);

  useEffect(() => {
    setStep(method);
  }, [method]);

  useEffect(() => {
    if (!reschedule) {
      setMethod("reschedule");
    }
  }, [reschedule]);

  const handleError = (message) => {
    setStep("error");
    setErrorMessage(message);
    setLoader(false);
  };

  const paymentAction = (fullCard, type) => {
    setMethod(type);
    setSelectedCard(fullCard.payment_method);
    setFullSelectedCard(fullCard);
    setStep("scheduled");
  };

  const SchedulePayments = () => {
    paymentApi
      .schedulePayments({
        userId: userId,
        invoiceId: orderId,
        organizationId: organizationId,
        payments,
        paymentMethodType: method === "newCard" ? "card" : method,
        payemntMethodId: selectedCard,
      })
      .then((res) => {
        toggle();
      });
  };

  const updateSubTitle = () => {
    setSubTitle(`${TranslationEn.payments.subTitle.pricePerPayment} - ${Pricify(Number(payments[0].price || 0))}`);
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
      case "scheduled":
        setMainTitle("Schedule Payment");
        setPrevStep("card");
        break;
      case "reschedule":
        setMainTitle("");
        setSubTitle("");
        setPrevStep("");
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
          <AddSchedulePayment
            state={addScheduleState}
            setState={setScheduleState}
            method={method}
            setMethod={setMethod}
            toggle={toggle}
            totalAmount={totalAmount}
            setPayments={setPayments}
          />
        );
      case "card":
        return (
          <Fragment>
            <Credit
              setMethod={setMethod}
              userId={userId}
              setSelectedCard={setSelectedCard}
              selectedCard={selectedCard}
              setFullSelectedCard={setFullSelectedCard}
            />
            <Footer
              toggle={toggle}
              disabled={selectedCard === ""}
              loader={false}
              submitButtonText={TranslationEn.memberships.footer.defaultNext}
              onSubmit={() => setStep("scheduled")}
            />
          </Fragment>
        );
      case "newCard":
        return (
          <Fragment>
            <NewCard
              userId={userId}
              trigger={triggerForNewCardSubmission}
              paymentAction={paymentAction}
              handleError={handleError}
            />
            <Footer
              toggle={toggle}
              disabled={false}
              loader={false}
              submitButtonText={TranslationEn.memberships.footer.defaultNext}
              onSubmit={() => setNewCCTrigger(true)}
            />
          </Fragment>
        );
      case "ach":
        return <div></div>;
      // return <Bank userId={userId} setSelectedCard={setSelectedCard} selectedCard={selectedCard} />;
      case "cash":
        return <div>Cash</div>;
      // return <Cash setSelectedCard={setSelectedCard} selectedCard={selectedCard} />;
      case "scheduled":
        return <ConfirmScheduled payments={payments} onSubmit={SchedulePayments} />;
      case "reschedule":
        return <Reschedule toggle={toggle} payments={payments} setMethod={setMethod} />;
      case "error":
        return <Error toggle={toggle} message={errorMessage} />;
      default:
        return <div>oops</div>;
    }
  };

  const isCompleted = step === "completed";
  const isError = step === "error";
  const isRescheduled = step === "reschedule";
  return (
    <div css={flexCol}>
      {step !== "" && !isCompleted && !isError && !isRescheduled && (
        <div css={backButtonCss}>
          <SimpleButton
            onClick={() => {
              setMethod(prevStep);
              setStep(prevStep);
            }}
          >
            <ReactSVG src="assets/media/icons/arrow-left.svg" css={iconCss} />
            {TranslationEn.payments.back}
          </SimpleButton>
        </div>
      )}

      {!isError && !isRescheduled && (
        <div css={topCss}>
          {isCompleted && <ReactSVG src="assets/media/icons/check.svg" css={iconCss} />}
          <h1>{mainTitle}</h1>
          <h2>
            {step === "scheduled" ? (
              <div css={justifyCenterCss}>
                {fullselectedCard.card && (
                  <Fragment>
                    <ReactSVG
                      css={iconCss}
                      src={`assets/media/icons/payments/payment_method/${fullselectedCard.card.brand}.svg`}
                    />
                    {fullselectedCard.card.last4}
                  </Fragment>
                )}
              </div>
            ) : (
              subTitle
            )}
          </h2>
        </div>
      )}
      {Stepper()}
    </div>
  );
};
