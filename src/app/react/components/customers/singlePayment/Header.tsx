/** @jsx jsx */
import React from "react";
import { jsx, css } from "@emotion/react";
import { useLocation, useHistory } from "react-router-dom";
import { HeaderContainer, SideContainer, BackButton, MoreMenu, HeaderTitle } from "../../shared/Header";
import { CTAButton } from "../../shared/Button/CTAButton";
import { flex } from "../../../styles/utils";
import { colors } from "../../../styles/theme";
import { useComingSoonPopUp } from "../../shared/ComingSoon";
import { TranslationEn } from "assets/i18n/en";

const linkToInvoiceCss = css`
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
  paymentState: any;
}

export const Header = ({ paymentState }: Props) => {
  const { pathname } = useLocation();
  const history = useHistory();
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const newLink = pathname.split("/");
  newLink.pop();
  const redirectTo = newLink.join("/");

  const moreMenuActions = [
    {
      label: "Download Receipt",
      action: ComingSoonToggle,
    },
    {
      label: "Send Receipt",
      action: ComingSoonToggle,
    },
    {
      label: "Print Receipt",
      action: ComingSoonToggle,
    },
  ];

  const handleInvoiceRedirection = (id: number) => {
    const link = pathname.split("/");
    link.pop();
    link.pop();
    const InvoiceUrl = link.join("/");
    history.push(`${InvoiceUrl}/invoices/${id}`);
  };
  return (
    <React.Fragment>
      <HeaderContainer>
        <SideContainer>
          <BackButton to={redirectTo} />
          <div>
            <HeaderTitle>
              {TranslationEn.customers.paymentsInvoices.receiptNum} {paymentState.id}
            </HeaderTitle>
            <div css={flex}>
              {paymentState.orderToInvoices.map((invoice, index) => {
                const id = invoice.order.id;
                return (
                  <div
                    onClick={() => {
                      handleInvoiceRedirection(id);
                    }}
                    css={linkToInvoiceCss}
                    key={index}
                  >
                    {TranslationEn.customers.paymentsInvoices.invoiceNum}
                    {id},
                  </div>
                );
              })}
            </div>
          </div>
        </SideContainer>
        <SideContainer>
          <CTAButton onClick={() => ComingSoonToggle()}>issue refund</CTAButton>
          <MoreMenu actions={moreMenuActions} />
        </SideContainer>
      </HeaderContainer>
      <ComingSoonModal />
    </React.Fragment>
  );
};
