/** @jsx jsx */

import { Entitlements } from "app/shared/components/discount-v2/discount-v2";
import React, { useState, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { CTAButton } from "../../shared/Button/CTAButton";
import { SecondaryButtonCss, ChargeButtonCss } from "../../../styles/utils";
import { Toggle } from "../../shared/Toggle";
import { colors } from "../../../styles/theme";
import { Input } from "../../shared/Input";
import { membershipApi } from "../../../lib/api/membershipApi";
import { Error } from "../Error";
import { TranslationEn } from "assets/i18n/en";

const modalContainer = css`
  margin: 1rem;
  h1 {
    margin: 0 0 2rem 0;
    text-align: left;
    padding-bottom: 1rem;
    font-family: Montserrat;
    font-style: normal;
    font-weight: bold;
    font-size: 2rem;
    line-height: 2.4rem;
    color: ${colors.brandPrimary};
    border-bottom: 1px solid ${colors.borderPrimary};
  }
`;

const container = css`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  .productName {
    width: 200px;
    color: ${colors.brandPrimary};
    font-family: Montserrat;
    font-size: 1.4rem;
    line-height: 130%;
  }
  .percentage {
    margin-left: 1rem;
    color: ${colors.brandPrimary};
    font-family: Montserrat;
    font-size: 1.4rem;
    line-height: 130%;
  }
`;

const buttonContainer = css`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const textContainer = css`
  padding: 2rem;
  color: ${colors.brandPrimary};
  font-family: Montserrat;
  font-size: 1.4rem;
  line-height: 130%;
  text-align: center;
`;

interface IProduct {
  name: string;
  createdAt: string;
  id: number;
  organizationId: number;
  updatedAt: string;
  price?: number;
}

interface Props {
  organizationId: number;
  totalAmount: number;
  toggle: () => void;
  onCancel?: () => void;
  onSave?: (arr: Entitlements[]) => void;
}

export const ManageDiscounts = ({ organizationId, totalAmount, onCancel, onSave, toggle }: Props) => {
  const [productsArr, setProductsArr] = useState<IProduct[]>([]);
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    membershipApi
      .getEntitlementGroupsByOrganiztionId(organizationId)
      .then((res) => {
        setProductsArr(
          res.map((product) => {
            product.price = totalAmount;
            return product;
          }),
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const handlePriceUpdate = (index, value) => {
    let newProducts = [...productsArr];
    newProducts[index].price = value;
    setProductsArr(newProducts);
  };

  const onSaveButton = (results: IProduct[]) => {
    const convertedResults: Entitlements[] = [];
    for (const r of results) {
      convertedResults.push({ groupId: r.id, price: r.price });
    }
    onSave(convertedResults);
  };

  return (
    <React.Fragment>
      {isError ? (
        <Error toggle={toggle} />
      ) : (
        <div css={modalContainer}>
          <h1>{TranslationEn.payments.items.membershipDiscount}</h1>
          {isLoading ? (
            <div css={textContainer}>{TranslationEn.isLoading}</div>
          ) : (
            <div>
              {productsArr.length !== 0 ? (
                productsArr.map((product, index) => {
                  return (
                    <Product
                      product={product}
                      index={index}
                      setPrice={handlePriceUpdate}
                      key={index}
                      totalAmount={totalAmount}
                    />
                  );
                })
              ) : (
                <div css={textContainer}>It seems that there is no products yet...</div>
              )}
            </div>
          )}
          <div css={buttonContainer}>
            <CTAButton onClick={onCancel} css={SecondaryButtonCss}>
              {TranslationEn.memberships.selectPage.cancel}
            </CTAButton>
            <CTAButton
              onClick={() => {
                onSaveButton(productsArr);
              }}
              css={ChargeButtonCss}
            >
              {TranslationEn.memberships.selectPage.save}
            </CTAButton>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

interface IProductProps {
  product: IProduct;
  setPrice: (index: number, value: number) => void;
  totalAmount: number;
  index: number;
}
export const Product = ({ product, index, totalAmount, setPrice }: IProductProps) => {
  const [calculatedPercentage, setPercentage] = useState(0);
  const [isPressed, setPressed] = useState(false);
  const [value, setValue] = useState(totalAmount);

  useEffect(() => {
    setPercentage(Math.floor(100 - (value * 100) / totalAmount));
    setPrice(index, value);
  }, [value]);

  return (
    <div css={container}>
      <Toggle setPressed={setPressed} isPressed={isPressed} />
      <div className="productName">{product.name}</div>
      <Input
        onChange={(e) => setValue(Number(e.target.value))}
        width={100}
        type="number"
        disabled={!isPressed}
        value={value}
      />
      <div className="percentage">{calculatedPercentage}%</div>
    </div>
  );
};
