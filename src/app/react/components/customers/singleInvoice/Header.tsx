/** @jsx jsx */
import React, { Fragment, useEffect } from "react";
import moment from "moment";
import { jsx, css } from "@emotion/react";
import { useLocation, useHistory } from "react-router-dom";
import { HeaderContainer, SideContainer, BackButton, MoreMenu, HeaderTitle, ClockLabel } from "../../shared/Header";
import { CTAButton } from "../../shared/Button/CTAButton";
import { colors } from "../../../styles/theme";
import { flex, ChargeButtonCss } from "../../../styles/utils";
import { Tag } from "../../shared/Tag";
import { EStatusColorMapper } from "../../../types/customers";
import { TranslationEn } from "../../../../../assets/i18n/en";
import { Pricify } from "../../../lib/form";
import { useComingSoonPopUp } from "../../shared/ComingSoon";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../shared/Modal";
import { usePayments } from "../../payments";
import { IPayment } from "../../../types/payment";

const linkToPaymentCss = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.5rem;
  text-decoration-line: underline;
  cursor: pointer;
  margin-top: 5px;
  margin-right: 2px;
  color: ${colors.formInputBg};
`;

interface Props {
  invoiceState: any;
  organizationId: number;
  ChargeToggle?: () => void;
  DiscountToggle?: () => void;
  fetchScheduledPayments?: () => void;
  isPrimaryButton?: boolean;
  scheduledPayments?: IPayment[];
}

export const Header = ({
  invoiceState,
  ChargeToggle,
  DiscountToggle,
  organizationId,
  fetchScheduledPayments,
  scheduledPayments = [],
  isPrimaryButton = true,
}: Props) => {
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const { isShowing: isScheduleShowing, toggle: ScheduleToggle } = useModal();
  const { SchedulePayment } = usePayments();
  const { pathname } = useLocation();
  const newLink = pathname.split("/");
  newLink.pop();
  const redirectTo = newLink.join("/");

  useEffect(() => {
    if (!isScheduleShowing) {
      fetchScheduledPayments();
    }
  }, [isScheduleShowing]);

  const moreMenuActionsPaid = [
    {
      label: TranslationEn.customers.paymentsInvoices.downloadInvoice,
      action: ComingSoonToggle,
    },
    {
      label: TranslationEn.customers.paymentsInvoices.sendInvoice,
      action: ComingSoonToggle,
    },
  ];

  const moreMenuActionsUnpaid = [
    {
      label: TranslationEn.customers.paymentsInvoices.schedulePayments,
      action: ScheduleToggle,
    },
    {
      label: TranslationEn.customers.paymentsInvoices.paymentRequest,
      action: ComingSoonToggle,
    },
    {
      label: TranslationEn.customers.paymentsInvoices.addDiscount,
      action: DiscountToggle,
    },
    {
      label: TranslationEn.customers.paymentsInvoices.downloadAsPDF,
      action: ComingSoonToggle,
    },
  ];

  const status =
    invoiceState.isScheduled && invoiceState.paymentStatus !== "paid" ? "scheduled" : invoiceState.paymentStatus;
  return (
    <React.Fragment>
      <HeaderContainer>
        <SideContainer>
          <BackButton to={redirectTo} />
          <div>
            <div css={flex}>
              <HeaderTitle>
                {TranslationEn.customers.paymentsInvoices.invoiceNum} {invoiceState.id}
              </HeaderTitle>
              <Tag title={TranslationEn.customers.tags[status]} color={EStatusColorMapper[status]} />
            </div>
            <ClockLabel>
              {TranslationEn.customers.customerHeader.lastActivity}{" "}
              {moment(invoiceState.updatedAt).format("MM/DD/YYYY")}
            </ClockLabel>
          </div>
        </SideContainer>
        <SideContainer>
          <Fragment>
            {invoiceState.paymentStatus === "paid" ? (
              <Fragment>
                <CTAButton onClick={() => ComingSoonToggle()}>
                  {TranslationEn.customers.paymentsInvoices.issueRefund}
                </CTAButton>
                <CTAButton onClick={() => ComingSoonToggle()}>
                  {TranslationEn.customers.paymentsInvoices.printInvoice}
                </CTAButton>
              </Fragment>
            ) : isPrimaryButton ? (
              <CTAButton css={ChargeButtonCss} onClick={ChargeToggle}>
                {`${TranslationEn.customers.paymentsInvoices.charge} `}

                {Pricify(invoiceState.paidAmount ? invoiceState.price - invoiceState.paidAmount : invoiceState.price)}
              </CTAButton>
            ) : (
              <CTAButton onClick={ChargeToggle}>
                {TranslationEn.customers.paymentsInvoices.chargeBalance}{" "}
                {Pricify(invoiceState.paidAmount ? invoiceState.price - invoiceState.paidAmount : invoiceState.price)}
              </CTAButton>
            )}
            <MoreMenu actions={invoiceState.paymentStatus === "paid" ? moreMenuActionsPaid : moreMenuActionsUnpaid} />
          </Fragment>
        </SideContainer>
      </HeaderContainer>
      <ComingSoonModal />
      <Modal isShowing={isScheduleShowing} toggle={ScheduleToggle} padding={0}>
        <SchedulePayment
          userId={invoiceState.payingUserId}
          organizationId={organizationId}
          orderId={invoiceState.id}
          toggle={ScheduleToggle}
          scheduledPayments={scheduledPayments}
          reschedule={isPrimaryButton}
          totalAmount={invoiceState.paidAmount ? invoiceState.price - invoiceState.paidAmount : invoiceState.price}
        />
      </Modal>
    </React.Fragment>
  );
};
