/** @jsx jsx */

import { Entitlements } from "app/shared/components/discount-v2/discount-v2";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePayments } from "../components/payments";
import { useModal } from "../hooks/useModal";
import { Modal } from "../components/shared/Modal";
import { jsx } from "@emotion/react";

interface Props {
  totalAmount?: number;
  onCancel?: () => void;
  organizationId?: number;
  onSave?: (arr: Entitlements[]) => void;
}

export const EntitlementDiscounts = ({ onCancel, onSave, totalAmount, organizationId }: Props) => {
  const { DiscountTemp } = usePayments();
  const { isShowing, toggle } = useModal();

  const localToggle = () => {
    if (!toggle()) onCancel();
  };

  useEffect(() => {
    toggle();
  }, []);

  return (
    <Modal isShowing={isShowing} toggle={toggle}>
      <DiscountTemp
        onCancel={() => {
          onCancel();
          toggle();
        }}
        toggle={localToggle}
        onSave={onSave}
        organizationId={organizationId}
        totalAmount={totalAmount}
      />
    </Modal>
  );
};
