/** @jsx jsx */
import React from "react";
import { Stepper, Step, StepLabel } from "@material-ui/core";
import { jsx, css } from "@emotion/react";
import { colors } from "app/react/styles/theme";

const stepperCss = css`
  background-color: transparent;
  padding-left: 0;
  .MuiStepConnector-line {
    border-top: 1px dashed ${colors.brandPrimary};
  }
  .MuiStepLabel-root.Mui-disabled,
  .MuiStepConnector-root.Mui-disabled {
    opacity: 0.5;
  }
`;

const stepLabelCss = css`
  .MuiStepIcon-root {
    border: 1px solid ${colors.brandPrimary};
    border-radius: 50%;
    color: white;
  }
  .MuiStepIcon-root.MuiStepIcon-active {
    color: white;
  }
  .MuiStepIcon-text {
    fill: ${colors.brandPrimary};
    font-size: 1.6rem;
  }
  .MuiStepLabel-label,
  .MuiStepLabel-label.MuiStepLabel-active,
  .MuiStepLabel-label.MuiStepLabel-completed {
    color: ${colors.brandPrimary};
  }
  .MuiStepIcon-root.MuiStepIcon-completed {
    border: none;
    color: ${colors.brandPrimary};
  }
`;

interface CustomStepperProps {
  steps: string[];
  activeStep: number;
}

function CustomStepper(props: CustomStepperProps) {
  // Notice that activeStep starts from zero
  const { steps, activeStep } = props;

  return (
    <Stepper css={stepperCss} activeStep={activeStep}>
      {steps.map((step, index) => (
        <Step key={index}>
          <StepLabel css={stepLabelCss}>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default CustomStepper;
