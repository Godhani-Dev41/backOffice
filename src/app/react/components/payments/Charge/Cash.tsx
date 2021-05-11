/** @jsx jsx */

import React, { FC, useState, useEffect } from "react";
import { jsx, css } from "@emotion/react";
import { CheckboxButton, SimpleButton } from "../utils";
import { flexCol, flex } from "../../../styles/utils";
import { ReactSVG } from "react-svg";
import { colors } from "../../../styles/theme";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "@app/react/lib/form";
import { Input } from "bondsports-utils";

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
  justify-content: flex-start;
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
  color: ${colors.formInputBg};
  font-size: 1.2rem;
  line-height: 1.5rem;
  text-align: center;
  margin-top: 1rem;
`;

const primeryTitle = css`
  font-size: 1.4rem;
  line-height: 130%;
  text-align: center;
  color: ${colors.brandPrimary};
`;

// In Progress
export const Cash = ({ selectedCard, setSelectedCard, totalAmount, setAmount }) => {
  const [optionalAmounts, setOptionalAmounts] = useState<string[]>([]);
  const [amount, updateAmount] = useState<string | number>(totalAmount);

  const [chosen, setChosen] = useState<number | string>(0);

  useEffect(() => {
    const newOptions = [];

    //exact price
    newOptions.push(totalAmount);
    // round up to 1
    if (totalAmount % 1 !== 0) {
      newOptions.push(Math.ceil(totalAmount));
    }
    // round up to 5
    if (totalAmount % 5 !== 0) {
      newOptions.push(Math.ceil(totalAmount / 5) * 5);
    }
    // round up to 10
    if (totalAmount % 10 !== 0) {
      let newValue = Math.ceil(totalAmount / 10) * 10;
      if (!newOptions.includes(newValue)) {
        newOptions.push(newValue);
      }
    }

    // round up to 50
    if (totalAmount % 50 !== 0) {
      let newValue = Math.ceil(totalAmount / 50) * 50;
      if (!newOptions.includes(newValue)) {
        newOptions.push(newValue);
      }
    }
    // round up to 100
    if (totalAmount % 100 !== 0) {
      let newValue = Math.ceil(totalAmount / 100) * 100;
      if (!newOptions.includes(newValue)) {
        newOptions.push(newValue);
      }
    }

    setOptionalAmounts(newOptions);
  }, [totalAmount]);

  return (
    <div css={ContainerCss}>
      <div css={topPartCss}>
        <div css={middleCss}>Choose the amount of cash received</div>
        <div css={wrapContainerCss}>
          {optionalAmounts.map((option, index) => {
            return (
              <CheckboxButton
                key={index}
                onClick={() => {
                  setChosen(option);
                  setAmount(option);
                }}
                active={chosen === option}
              >
                <ReactSVG src="assets/media/icons/dollar.svg" css={iconCss} />
                {option}
              </CheckboxButton>
            );
          })}

          <CheckboxButton
            onClick={() => {
              setChosen("custom");
            }}
            active={chosen === "custom"}
          >
            <ReactSVG src="assets/media/icons/edit.svg" css={iconCss} />
            Custom
          </CheckboxButton>
        </div>
      </div>
      {chosen === "custom" && (
        <div>
          <Input
            type="number"
            value={amount || ""}
            leftIcon="dollar"
            onChange={(e) => {
              updateAmount(e.target.value);
              setAmount(e.target.value);
            }}
            clear={() => {
              updateAmount(0);
              setAmount(0);
            }}
            placeholder={String(totalAmount)}
            sizer="S"
            label="Custom"
          />

          <div>{Number(amount) > totalAmount && `Change due ${Pricify(Number(amount) - totalAmount)}`}</div>
        </div>
      )}
    </div>
  );
};
