/** @jsx jsx */

import React, { useState } from "react";
import { jsx, css } from "@emotion/react";
import { flexCol, flex, SecondaryButtonCss, ChargeButtonCss } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { Pricify } from "../../../lib/form";
import { CTAButton } from "../../shared/Button/CTAButton";
import { Input } from "../../shared/Input";
import Radio from "../../shared/Radio/Radio";
import { FormControlLabel, RadioGroup } from "@material-ui/core";
import { useComingSoonPopUp } from "../../shared/ComingSoon";

const ContainerCss = css`
  ${flexCol};

  justify-content: center;
  align-items: center;
`;

const topPartCss = css`
  ${flexCol};
  margin: 0;
  padding: 1rem 10rem;
`;

const middleCss = css`
  color: ${colors.ligntText};
  font-size: 1.6rem;
  line-height: 2rem;
  font-weight: 600;
  margin-top: 1rem;
`;

const mainPartCss = css`
  border-top: 1px solid ${colors.borderSeperator};
  padding: 2rem 10rem;
`;

const wrapper = css`
  ${flexCol};
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 2rem;
  align-items: center;
  .twoButtonsContainer {
    margin: 1rem 0;
  }
`;

const price = css`
  margin-top: 0.5rem;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2rem;
  text-align: center;
  color: ${colors.brandPrimary};
`;

const labelCss = css`
  font-family: Montserrat;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
  margin-right: 1rem;
`;

const RadioButtonCss = css`
  ${flex};
  .MuiFormControlLabel-root {
    margin: 0;
  }
  .MuiRadio-root {
    padding: 2px;
    margin-left: 5px;
  }
  .MuiSvgIcon-root {
    width: 14px;
    height: 14px;
  }
  .MuiTypography-root {
    font-family: Montserrat;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: ${colors.brandPrimary};
  }
`;

const checkboxContainer = css`
  ${flex};
  margin-bottom: 1rem;
`;

export const Completed = ({ amount }) => {
  const [contactMethod, setContactMethod] = useState("");
  const { ComingSoonModal, ComingSoonToggle } = useComingSoonPopUp();
  // still in progress
  return (
    <React.Fragment>
      <div css={ContainerCss}>
        <div css={topPartCss}>
          <div css={middleCss}>Total paid</div>
          <div css={price}>{Pricify(Number(amount))}</div>
        </div>
        <div css={mainPartCss}>
          <div css={checkboxContainer}>
            <div css={labelCss}>send receipt to</div>
            <RadioGroup
              row
              aria-label="gender"
              value={contactMethod}
              css={RadioButtonCss}
              onChange={(e) => {
                setContactMethod(e.target.value);
              }}
            >
              <FormControlLabel name={"contactMethod"} value="email" control={<Radio />} label="email" />
              <FormControlLabel name={"contactMethod"} value="phone" control={<Radio />} label="phone" />
            </RadioGroup>
          </div>
          <Input
            type={contactMethod === "email" ? "text" : "number"}
            placeholder={contactMethod === "email" ? "your@mail.com" : "your phone"}
          />
        </div>
        <div css={wrapper}>
          <div className="twoButtonsContainer" css={flex}>
            <CTAButton onClick={() => ComingSoonToggle()}>Print receipt</CTAButton>
            <CTAButton css={ChargeButtonCss} onClick={() => ComingSoonToggle()}>
              Send
            </CTAButton>
          </div>
          <CTAButton css={SecondaryButtonCss} onClick={() => ComingSoonToggle()}>
            Skip
          </CTAButton>
        </div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
