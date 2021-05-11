/** @jsx jsx */

import React, { useState, Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { CTAButton } from "../../shared/Button/CTAButton";
import { flex, flexCol, flexEndCss, ChargeButtonCss, setOpacity } from "../../../styles/utils";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../../../styles/theme";
import { paymentApi } from "../../../lib/api/paymentApi";
import { ReactSVG } from "react-svg";
// import { CustomSelect } from "../../customers/customSelect";
import { Toggle } from "../../shared/Toggle";
import SelectTextInput from "../../shared/FormControls/SelectTextInput";
import { Form } from "react-final-form";
import { InputLabel } from "../../shared/Input/InputLabel";
import { ButtonLoader } from "../../shared/Loader";
import { useErrorModal } from "../../shared/Error";
import { Error } from "../Error";

const topCss = css`
  ${flexCol};
  margin-top: 1rem;
  border-bottom: 1px solid ${colors.borderSeperator};
  padding: 1rem 2rem;
  font-family: Montserrat;
  h1 {
    margin: 0;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
    text-align: left;
    color: ${colors.brandPrimary};
    text-transform: capitalize;
  }
`;

const labelCss = css`
  font-family: Montserrat;
  font-size: 1.2rem;
  line-height: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${colors.formInputBg};
`;

const pressableCss = (isActive: boolean) => css`
  ${labelCss};
  display: flex;
  margin-bottom: 0;
  cursor: ${isActive ? "default" : "pointer"};
  color: ${isActive ? colors.brandPrimary : colors.formInputBg};
  path {
    fill: ${isActive ? colors.brandPrimary : colors.formInputBg};
  }
  &:hover {
    color: ${colors.brandPrimary};
    path {
      fill: ${colors.brandPrimary};
    }
  }
`;

const sectionCss = css`
  ${flexCol};
  font-family: Montserrat;
  padding: 2rem;
`;

const inputContainerCss = css`
  ${flex};
  background: ${setOpacity(colors.brandPrimary, 0.04)};
  border: 1px solid ${colors.borderPrimary};
  color: ${colors.brandPrimary};
  box-sizing: border-box;
  width: 100%;
  padding: 5px;
  font-size: 1.4rem;
  font-family: "Montserrat";
  line-height: 130%;
  align-items: center;
  border-radius: 2px;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input {
    border: none;
    background: transparent;
    width: 100%;
    color: ${colors.brandPrimary};
  }
`;

const bottomCss = css`
  ${flexEndCss};
  margin-top: 1rem;
  padding: 2rem;
  padding-top: 1rem;
`;

const textAreaContainerCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-family: Montserrat;
  .remove {
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.5rem;
    text-decoration-line: underline;
    color: ${colors.brandPrimary};
    background: transparent;
    border: none;
  }
`;

const lineContainerCss = css`
  display: flex;
  align-items: center;
`;

const iconCss = css`
  margin-right: 5px;
  svg {
    height: 16px;
    width: 16px;
  }
  div {
    display: flex;
    align-items: center;
  }
`;

const counterCss = css`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  margin-top: 4px;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
`;

const marginTopCss = css`
  margin-top: 2rem;
`;

const halfWidthCss = css`
  width: 50%;
`;

interface Props {
  toggle: () => void;
  totalAmount: number;
  customerId: number;
  lineItemId: number;
}

export const Discount = ({ toggle, totalAmount, lineItemId }: Props) => {
  const [amount, setAmount] = useState<number | string>(totalAmount);
  const [format, setFormat] = useState<string>("$");
  const { ErrorModal, ErrorToggle } = useErrorModal();
  const [reason, setReason] = useState<string>("");
  const [displayReason, setDisplayReason] = useState<boolean>(true);
  const [isDisabled, setDisabled] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const [mainTitle, setMainTitle] = useState(TranslationEn.customers.paymentsInvoices.addDiscount);

  let submit;
  const onSubmit = (values) => {
    setLoading(true);
    let discountAmount = 0;
    if (values.typeOfDiscount === "USD") {
      discountAmount = values.amount;
    } else {
      discountAmount = (values.amount / 100) * totalAmount;
    }
    fetchDiscount(totalAmount - discountAmount);
  };

  const fetchDiscount = (price) => {
    let data = {
      lineItemId: lineItemId,
      price: price, // total new price of item, not the amount to reduce
      entitlementGroupId: -1,
      description: displayReason ? reason : "",
    };
    paymentApi
      .setDiscount(data)
      .then((res) => {
        if (res.statusCode) {
          setError(res.message);
        } else {
          setLoading(false);
          toggle();
        }
      })
      .catch(() => {
        ErrorToggle();
      });
  };

  return (
    <Fragment>
      {error ? (
        <Error message={error} toggle={toggle} />
      ) : (
        <div css={flexCol}>
          <div css={topCss}>
            <h1>{mainTitle}</h1>
            {/* <h2>{subTitle}</h2> */}
          </div>
          {/* <div style={{ marginTop: "2rem" }}>
        <DiscountPlan title={"Memership discount"} />
        <DiscountPlan title={"VIP discount"} />
        <DiscountPlan title={"Tennis equipment discount"} />
      </div> */}
          <div css={sectionCss}>
            <label css={labelCss}>{TranslationEn.payments.manualDiscount}</label>
            <Form
              onSubmit={onSubmit}
              validate={(val) => {
                if (val.amount) {
                  if (val.typeOfDiscount) {
                    setDisabled(false);
                  }
                }
                return {};
              }}
              render={({ handleSubmit }) => {
                submit = handleSubmit;
                return (
                  <form>
                    <div css={lineContainerCss}>
                      <InputLabel name="amount" type="number" placeholder="" />
                      <div css={halfWidthCss}>
                        <SelectTextInput
                          require={false}
                          controlName="typeOfDiscount"
                          menuOptions={[
                            { value: "USD", text: "$" },
                            { value: "percentage", text: "%" },
                          ]}
                        />
                      </div>
                    </div>
                  </form>
                );
              }}
            />
            <div css={marginTopCss}>
              <div css={textAreaContainerCss}>
                <div css={pressableCss(displayReason)} onClick={() => setDisplayReason(true)}>
                  <ReactSVG css={iconCss} src="assets/media/icons/customers/header/subtract.svg" />
                  {TranslationEn.customers.paymentsInvoices.addReasonForDiscount}
                </div>
                {displayReason && (
                  <button onClick={() => setDisplayReason(false)} className="remove">
                    {TranslationEn.customers.paymentsInvoices.remove}
                  </button>
                )}
              </div>
              {displayReason && (
                <React.Fragment>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    css={inputContainerCss}
                    maxLength={120}
                  />
                  <div css={counterCss}>{reason.length}/120</div>
                </React.Fragment>
              )}
            </div>
          </div>
          <div css={bottomCss}>
            <CTAButton onClick={() => toggle()}>{TranslationEn.memberships.selectPage.cancel}</CTAButton>
            <CTAButton disabled={isDisabled} onClick={() => submit()} css={ChargeButtonCss}>
              {isLoading ? <ButtonLoader /> : TranslationEn.customers.paymentsInvoices.apply}
            </CTAButton>
          </div>
        </div>
      )}
      <ErrorModal />
    </Fragment>
  );
};

const discountPlanContainer = css`
  ${flex};
  justify-content: space-between;
  padding: 0.5rem 2rem;
  padding-bottom: 0;
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: normal;
    font-size: 1.4rem;
    line-height: 130%;
    color: ${colors.brandPrimary};
  }
  div {
    margin-right: 0;
  }
`;
const DiscountPlan = ({ title }) => {
  const [isPressed, setPressed] = useState<boolean>(false);
  return (
    <div css={discountPlanContainer}>
      <label>{title}</label>
      <Toggle isPressed={isPressed} setPressed={setPressed} />
    </div>
  );
};
