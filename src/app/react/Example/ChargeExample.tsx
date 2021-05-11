/** @jsx jsx */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePayments } from "../components/payments";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/shared/Modal";
import { jsx } from "@emotion/react";

export interface ISelectedPaymentDetail {
  token: string;
  type: string;
  isNewCard: boolean;
  amount: number;
}

interface Props {
  totalAmount: number;
  userId: number;
  organizationId: number;
  orderId?: number;
  isAmountEditable?: boolean;
  handleCharge?: (value: ISelectedPaymentDetail) => void;
  onModalShowingChange?: (isVisible: boolean) => void;
}

// Example of Charge Modal - Yossi
export const ChargingModalExample = ({
  handleCharge,
  onModalShowingChange,
  totalAmount,
  userId,
  organizationId,
}: Props) => {
  const { Charge } = usePayments();
  const { isShowing, toggle } = useModal();
  const localToggle = () => {
    
  const isShowing = toggle();
    if (onModalShowingChange) onModalShowingChange(isShowing);
  };

  useEffect(() => {
    localToggle();
  }, [])

  return (
    <Modal isShowing={isShowing} toggle={localToggle}>
      <Charge
        toggle={localToggle}
        totalAmount={totalAmount}
        userId={userId}
        organizationId={organizationId}
        alternativeHandleCharge={(val: ISelectedPaymentDetail) => handleCharge ? handleCharge(val) : console.log(val)}
        isAmountEditable={false}
      />
    </Modal>
  );
};
