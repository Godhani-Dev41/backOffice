/** @jsx jsx */

import React, { useState, Fragment } from "react";
import { Form } from "react-final-form";
import { jsx, css } from "@emotion/react";
import moment from "moment";
import DateInput from "../../shared/FormControls/DateInput";
import SelectTextInput from "../../shared/FormControls/SelectTextInput";
import { InputLabel } from "../../shared/Input/InputLabel";
import { flex } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { IPayment } from "../../../types/payment";

import { PaymentMethodBox } from "../utils";
import { Footer } from "../utils/footer";
import { TranslationEn } from "assets/i18n/en";

const container = css`
  margin: 2rem;
  min-width: 350px;
`;

const labelCss = css`
  font-family: Montserrat;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
`;

type TPaymentMethodTemporal = "ach" | "card";

interface Props {
  toggle: () => void;
  totalAmount: number;
  setPayments: (arr: IPayment[]) => void;
  method: string;
  setMethod: (str: string) => void;
  state: any;
  setState: (obj: any) => void;
}
export const AddSchedulePayment = ({ toggle, setPayments, setMethod, state, setState, method, totalAmount }: Props) => {
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethodTemporal | string>(state.paymentMethod || "");
  const [disabled, setDisabled] = useState<boolean>(true);

  const getNextPaymentDate = (firstPaymentDate, repeat, index) => {
    let format = repeat === "weekly" ? "weeks" : "months";
    return moment(firstPaymentDate).add(index, format).format("YYYY-MM-DD");
  };

  const onSubmit = (values) => {
    
    const firstPayment = values.startDate;

    const payPerPayment = totalAmount / values.count;
    const payments = [];
    for (let i = 0; i < values.count; i++) {
      payments.push({
        plannedDate: getNextPaymentDate(firstPayment, values.repeat, i),
        price: payPerPayment,
      });
    }
    

    setPayments(payments);
    setMethod(paymentMethod);
    setState({ ...values, paymentMethod: paymentMethod });
  };

  const checkKeys = (obj) => {
    if (!obj.startDate) {
      return false;
    }
    if (paymentMethod === "") {
      return false;
    }
    if (!obj.count) {
      return false;
    }
    if (!obj.repeat) {
      return false;
    }

    return true;
  };

  return (
    <Fragment>
      <Form
        initialValues={state}
        onSubmit={onSubmit}
        validate={(obj) => {
          if (checkKeys(obj)) {
            const now = moment().format("YYYY-MM-DD");
            const selected = moment(obj.startDate).format("YYYY-MM-DD");
            if (moment(selected) < moment(now)) {
              setDisabled(true);
              return {
                startDate: "start date must be at least today",
              };
            } else {
              setDisabled(false);
              if (obj.repeat === "never" && +obj.count !== 1) {
                return {
                  count: "count must be 1, if repeat set to 'never'",
                };
              } else {
                return {};
              }
            }
          }

          setDisabled(true);
          return {};
        }}
        render={({ handleSubmit }) => (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <div css={container}>
              <DateInput name="startDate" title="Start Date" variant="inline" />
              <div css={flex}>
                <InputLabel require label="Count" name="count" type="number" />
                <SelectTextInput
                  controlName="repeat"
                  require
                  text="Repeat"
                  menuOptions={[
                    { value: "weekly", text: "Weekly" },
                    { value: "monthly", text: "Monthly" },
                    { value: "never", text: "Never" },
                  ]}
                />
              </div>
              {/* <InputLabel require label="Amount" name="amount" type="number" /> */}
              <label css={labelCss}>{TranslationEn.payments.whichPaymentMethod}</label>
              <div css={flex}>
                {/* <PaymentMethodBox method="ach" active={paymentMethod === "ach"} handleClick={setPaymentMethod} /> */}
                <PaymentMethodBox method="card" active={paymentMethod === "card"} handleClick={setPaymentMethod} />
              </div>
            </div>

            <Footer
              toggle={toggle}
              disabled={disabled}
              loader={false}
              submitButtonText={TranslationEn.memberships.footer.defaultNext}
            />
          </form>
        )}
      />
    </Fragment>
  );
};
