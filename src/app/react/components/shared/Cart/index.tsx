/** @jsx jsx */
import React, { useEffect, useState, useRef } from "react";
import { jsx, css, ClassNames } from "@emotion/react";
import { colors } from "../../../styles/theme";
import { ReactSVG } from "react-svg";
import { CTAButton } from "../Button/CTAButton";
import { ChargeButtonCss } from "@app/react/styles/utils";
import { flex } from "../../../styles/utils";
import { Pricify } from "@app/react/lib/form";
import { TranslationEn } from "assets/i18n/en";
import { Button } from "bondsports-utils";

const containerCss = (isExpand: boolean) => css`
  position: absolute;
  z-index: 100;
  top: 0;
  bottom: 0;
  right: ${isExpand ? "0" : "-320px"};
  min-width: 100px;
  background: ${colors.white};
  box-shadow: 0px 2px 22px rgba(21, 93, 148, 0.0749563);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 600ms;
`;

const collapseExpandCss = css`
  background: linear-gradient(270deg, ${colors.brandSecondaryLight} 0%, ${colors.brandSecondaryLight} 100%);
  height: 28px;
  width: 28px;
  box-shadow: 0px 2px 22px 8px rgba(21, 93, 148, 0.0749563);
  border-radius: 100px;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  border: none;
  color: ${colors.white};
  position: absolute;
`;

const cartHeaderTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 20px;
  h1 {
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
    text-align: center;
    color: ${colors.brandPrimary};
    margin: 0;
  }
`;

const headerCss = css`
  box-shadow: 0px 2px 22px 8px rgba(21, 93, 148, 0.0749563);
  border-radius: 0px 0px 5px 5px;
  padding: 16px;
`;

const iconCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const iconRotatedCss = css`
  ${iconCss};
  transform: rotate(180deg);
`;

const checkoutCss = css`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
`;

const chargeButton = css`
  width: 100%;
  text-align: center;
  justify-content: center;
  margin-left: 10px !important;
`;

const buttonContainer = css`
  ${flex};
  justify-content: space-between;
  button {
    margin-left: 0px;
    padding: 14px;
  }
`;

const totalContainer = css`
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 2rem;
    color: ${colors.brandPrimary};
  }
  padding: 8px 0;
  justify-content: space-between;
  ${flex};
`;

const subTotalContainer = css`
  label {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: ${colors.formInputBg};
  }
  padding-bottom: 8px;
  justify-content: space-between;
  ${flex};
`;

const borderBottomCss = css`
  border-bottom: 1px solid ${colors.borderSeperator};
`;

const userButton = css`
  background: ${colors.lightGray};
  border: 1px solid ${colors.borderPrimary};
  box-sizing: border-box;
  border-radius: 3px;
  padding: 6px 12px;
  ${flex};
  align-items: center;
  img {
    width: 36px;
    height: 36px;
    border-radius: 100px;
  }
  label {
    margin-left: 12px;
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 1.7rem;
    margin-bottom: 0;
    margin-right: 5px;
    color: ${colors.brandPrimary};
  }
  span {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 400;
    font-size: 1.2rem;
    line-height: 1.4rem;
    color: ${colors.brandPrimary};
  }
  button {
    border: none;
    background: none;
    ${flex};
    align-items: center;
    justify-content: center;
    &:hover {
      svg {
        path {
          fill: ${colors.brandPrimary};
        }
      }
    }
  }
`;

const trashButton = css`
  ${flex};
  align-items: center;
  border: none;
  background: none;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
  position: absolute;
  left: 0;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
  &:hover {
    color: ${colors.brandPrimary};
    svg {
      path {
        fill: ${colors.brandPrimary};
      }
    }
  }
`;

const addCustomerButtonCss = (width: number) => css`
  min-width: ${width}px;
  padding: 1.4rem;
  margin-left: 0;
  justify-content: center;
  svg {
    margin-right: 8px;
  }
`;

export const Cart = ({ items }) => {
  const [isExpand, setExpand] = useState<boolean>(true);
  const [customer, setCustomer] = useState<boolean>(true);
  const [buttonWidth, setButtonWidth] = useState<number>(315);
  const ref = useRef(null);
  useEffect(() => {
    //   @ts-ignore
    document.getElementsByTagName("BODY")[0].style.overflowX = "hidden";
  }, []);

  const removeCustomer = () => {
    if (ref.current) {
      setButtonWidth(ref.current.offsetWidth);
    }
    setCustomer(false);
  };
  return (
    <div css={containerCss(isExpand)}>
      <div css={headerCss}>
        <div css={cartHeaderTitle}>
          <button css={trashButton}>
            <ReactSVG src="assets/media/icons/trash.svg" css={iconCss} />
            {TranslationEn.payments.cart.clearCart}
          </button>
          <h1>
            {TranslationEn.payments.cart.cart} {items.length !== 0 && `(${items.length})`}
          </h1>
        </div>
        {customer ? (
          <div css={userButton} ref={ref}>
            <img src="https://thispersondoesnotexist.com/image" />
            <label>Customer Full Name</label>
            <span> (billed to)</span>
            <button onClick={() => removeCustomer()}>
              <ReactSVG src="assets/media/icons/remove.svg" css={iconCss} />
            </button>
          </div>
        ) : (
          <CTAButton css={addCustomerButtonCss(buttonWidth)} onClick={() => setCustomer(true)}>
            <ReactSVG src="assets/media/icons/profile-filed.svg" css={iconCss} />
            {TranslationEn.customers.addCustomer}
          </CTAButton>
        )}
      </div>
      <div>
        {items.map((item, index) => {
          return <Item state={item} key={index} />;
        })}
      </div>
      <div css={checkoutCss}>
        <div css={borderBottomCss}>
          <div css={subTotalContainer}>
            <label>{TranslationEn.payments.items.subTotal}</label>
            <label>{Pricify(680)}</label>
          </div>
          <div css={subTotalContainer}>
            <label>{TranslationEn.customers.paymentsInvoices.tax} (7%)</label>
            <label>{Pricify(10.9)}</label>
          </div>
        </div>
        <div css={totalContainer}>
          <label>{TranslationEn.customers.paymentsInvoices.total}</label>
          <label>{Pricify(690.9)}</label>
        </div>
        <div css={buttonContainer}>
          <Button sizer="L" theme="secondary">
            {TranslationEn.customers.paymentsInvoices.discount}
          </Button>
          <Button sizer="L" theme="primary" css={chargeButton}>
            {TranslationEn.customers.paymentsInvoices.charge}
          </Button>
        </div>
      </div>
      <button css={collapseExpandCss} onClick={() => setExpand(!isExpand)}>
        {isExpand ? (
          <ReactSVG src="assets/media/icons/forward.svg" css={iconCss}></ReactSVG>
        ) : (
          <ReactSVG src="assets/media/icons/forward.svg" css={iconRotatedCss}></ReactSVG>
        )}
      </button>
    </div>
  );
};

const Item = ({ state }) => {
  return <div></div>;
};
