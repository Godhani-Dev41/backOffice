/** @jsx jsx */

import React, { FC, useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { Form, Field, useFormState } from "react-final-form";
import { InputLabel, withLabelContainer } from "../../shared/Input/InputLabel";
import {
  Elements,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, StripeCardElement } from "@stripe/stripe-js";
import { flex, flexCol } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { paymentApi } from "../../../lib/api/paymentApi";
import { environment } from "../../../../../environments/environment";

const container = css`
  ${flexCol};
  padding: 2rem;
  max-width: 400px;
`;

const stripePromise = loadStripe(environment.STRIPE_KEY || "missing-stripe.key");

const contentBetween = css`
  ${flex};
  justify-content: space-between;
`;

export const NewCard = ({ userId, trigger, paymentAction, handleError }) => {
  let submit;
  const [newSubmit, setSubmit] = useState<() => void>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState({
    city: null,
    country: null,
    line1: null,
    line2: null,
    postal_code: null,
    state: null,
  });
  const [stripe, setStripe] = useState<{
    stripe: unknown;
    // eslint-disable-next-line camelcase
    client_secret?: string;
    stripeCartElement: StripeCardElement;
  } | null>(null);

  useEffect(() => {
    if (trigger) {
      submit();
    }
  }, [trigger]);

  const onClose = (obj, str) => {};

  // call stripe to confirm the entered
  async function confirmCardStripe(
    stripe: unknown,
    // eslint-disable-next-line camelcase
    client_secret: unknown,
    stripeCartElement: unknown,
    onSuccess: (setupIntent: unknown) => void,
    onError: (message: string) => void,
    name?: string,
  ) {
    if (!stripe || !stripeCartElement) {
      return;
    }
    if (!stripeCartElement) {
      throw new Error("should never happen - stripe failed to create the card element");
    }

    // @ts-ignore
    const result = await stripe.confirmCardSetup(client_secret, {
      payment_method: {
        card: stripeCartElement,
        billing_details: { name, address },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      onError(result.error.message);
    } else {
      // The payment has been processed!
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (result.setupIntent.status === "succeeded") {
        onSuccess({ result: result.setupIntent });
        console.log(result);
        paymentAction(result.setupIntent, "card");
      } else {
        onError("unknown error happened on stripe");
      }
    }
  }

  const checkCreditCard = async () => {
    paymentApi
      .getPaymentSecret(userId)
      .then((clientSecret) => {
        confirmCardStripe(
          stripe.stripe,
          clientSecret,
          stripe.stripeCartElement,
          (intent) => {
            if (onClose) {
              onClose({ intent }, "backdropClick");
            }
          },
          (err) => {
            handleError(err);
          },
          name,
        );
      })
      .catch((err) => {
        handleError(err.message ? err.message : err);
      });
  };

  return (
    <div css={container}>
      <Elements stripe={stripePromise}>
        <Form
          onSubmit={() => {
            checkCreditCard();
          }}
          render={({ handleSubmit }) => {
            submit = handleSubmit;
            return (
              <form autoComplete="off" onSubmit={handleSubmit}>
                <StripeFormContent setAddress={setAddress} setName={setName} setStripe={setStripe} />
              </form>
            );
          }}
        />
      </Elements>
    </div>
  );
};

const withLabelContainerStripe = css`
  ${withLabelContainer};
  .StripeElement {
    background: rgba(13, 71, 116, 0.04);
    position: relative;
    border: 1px solid transparent;
  }
  #cardNumber {
    &:before {
      display: block;
      content: " ";
      background-image: url("assets/media/icons/payments/card.svg");
      background-size: 28px 28px;
      height: 28px;
      width: 28px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .__PrivateStripeElement {
      left: 40px;
      width: 80%;
    }
  }
  .StripeElement--focus {
    border: 1px solid ${colors.borderPrimary};
  }
`;

const withLabelContainerHalf = css`
  ${withLabelContainerStripe};
  width: 50%;
`;

const StripeFormContent = ({ setName, setStripe, setAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [val, setVal] = useState("");
  const { values } = useFormState();

  useEffect(() => {
    setName(values.name);
    let newValues = { ...values };
    delete newValues.name;
    setAddress(newValues);
  }, [values]);
  useEffect(() => {
    setName(val);
  }, [val]);

  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement: unknown = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      throw new Error("should never happen - stripe failed to create the card element");
    }

    const stripeCartElement = cardNumberElement as StripeCardElement;

    setStripe({ stripe, stripeCartElement });
  }, [stripe, elements, setStripe]);

  return (
    <React.Fragment>
      <InputLabel label="Name on Card" name="name" />
      <div css={withLabelContainerStripe}>
        <label>Card Number</label>
        <CardNumberElement id="cardNumber" />
      </div>
      <div css={contentBetween}>
        <div css={withLabelContainerHalf}>
          <label>Expiration Date</label>
          <CardExpiryElement id="expirationDate" />
        </div>
        <div css={withLabelContainerHalf}>
          <label>Security Code</label>
          <CardCvcElement id="securityCode" />
        </div>
      </div>
      <InputLabel location label="Billing Address" name="line1" />
      <div css={contentBetween}>
        <InputLabel label="City" name="city" />
        <InputLabel label="State" name="state" />
        <InputLabel label="Zip Code" name="postal_code" />
      </div>
    </React.Fragment>
  );
};
