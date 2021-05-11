/** @jsx jsx */

import React, { Fragment, useEffect, useState } from "react";
import { jsx, css } from "@emotion/react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { Header } from "./Header";
import { MiddleWhiteContainer, SectionContainer } from "../../shared/Containers";
import { Info } from "../utils/BillingInfo";
import { Table } from "../../shared/Table";
import { TranslationEn } from "assets/i18n/en";
import { Pricify } from "../../../lib/form";
import { CTAButton } from "../../shared/Button/CTAButton";
import {
  ChargeButtonCss,
  flex,
  flexEndCss,
  flexCol,
  SecondaryButtonCss,
  setOpacity,
  TableContainer,
} from "../../../styles/utils";
import { CustomItemColumn } from "./CustomItemColumn";
import { colors } from "../../../styles/theme";
import { SummaryLine } from "./SummaryLine";
import { useModal } from "../../../hooks/useModal";
import { Modal } from "../../shared/Modal";
import { ICustomer } from "../../../types/customers";
import { usePayments } from "../../payments";
import { useComingSoonPopUp } from "../../shared/ComingSoon";
import { useErrorModal } from "../../shared/Error";
import { membershipApi } from "../../../lib/api/membershipApi";
import { paymentApi } from "../../../lib/api/paymentApi";
import { customersApi } from "../../../lib/api/customersApi";
import { ProductPrice } from "../../../types/product";

const containerCss = css`
  ${flexCol};
  height: 100%;
`;

const detailsTableContainer = css`
  ${TableContainer};
  .total {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100%;
  }
  .total-head {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px !important;
  }
`;

const scheduledPaymentsContainer = css`
  ${TableContainer};
  .status {
    display: flex;
    justify-content: flex-end;
  }
  .status-head {
    display: flex;
    justify-content: flex-end;
    padding-right: 20px !important;
  }
`;

interface Props {
  customersService: CustomersService;
  organization: RCOrganization;
}

interface OrderToInvoice {}

interface LineItems {
  id: number;
}

type TPaymentStatus = "not_paid" | "paid" | "partial";

export enum PaymentMethodTypeEnum {
  cash = "Cash",
  ach = "Bank Account",
  card = "Credit Card",
}

interface IInvoice {
  id: number; // <<<<<<<<<<<<<<<<<<<<<<<
  createdAt: Date; // <<<<<<<<<<<<<<<<<<<<<<<
  price: number; // that's the 'total' <<<<<<<<<<<<<<<<<<
  payingUserId?: number;
  orderToInvoices: OrderToInvoice[];
  lineItems: ProductPrice[]; // the lineItems.length is your 'num of items' <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  paymentStatus: TPaymentStatus; // 'status' <<<<<<<<<<<<<<<<<<<<<<<<<<<
  paymentMethodId?: string; // stripe payment method / source ID
  paymentType?: PaymentMethodTypeEnum; // 'payment method' <<<<<<<<<<<<<<<<<<<<<<<<<<<
  paidAmount: number;
  isScheduled?: boolean;
}

export const SingleInvoice = ({ organization, customersService }: Props) => {
  const { customerId, invoiceId } = useParams();
  const [invoiceState, setInvoiceState] = useState<IInvoice>();
  const [customerState, setCustomerState] = useState<ICustomer>();
  const [itemsRows, setItemsRows] = useState([]);
  const [paymentsRows, setPaymentsRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const { ErrorModal, ErrorToggle } = useErrorModal();
  const { toggle, isShowing } = useModal();
  const { toggle: toggleDiscount, isShowing: isShowingDiscount } = useModal();
  const history = useHistory();
  const location = useLocation();
  const { Charge, Discount } = usePayments();
  const [discounts, setDiscounts] = useState([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [scheduledPayments, setScheduledPayments] = useState([]);

  const fetchData = () => {
    customersApi
      .getInvoiceById(customerId || 1, invoiceId)
      .then((data) => {
        if (data.statusCode) {
          // alert("Oops, looks like something went wrong");
        } else {
          customersApi
            .getCustomerByUserId(organization.id, data.payingUserId)
            .then((res) => {
              if (res.data) {
                setCustomerState(res.data);
                setLoading(false);
              } else {
                ErrorToggle();
              }
            })
            .catch((e) => {
              ErrorToggle();
            });
          setInvoiceState(data);
          // setLoading(false);
          // handle items rows
          let entitlementGroups = "";
          let entitlementObj = {};
          let totalDiscountAmount = 0;
          const discounts = [];
          let items = data.lineItems.map((item) => {
            const entitlementId = item.entitlementGroupId;
            if (entitlementId && entitlementId !== -1) {
              if (entitlementObj[entitlementId]) {
                entitlementObj[entitlementId].amount =
                  entitlementObj[entitlementId].amount - (item.price - item.originalPrice);
              } else {
                if (entitlementGroups === "") {
                  entitlementGroups = `${entitlementId}`;
                } else {
                  entitlementGroups += `,${entitlementId}`;
                }
                entitlementObj[entitlementId] = {
                  amount: item.price - item.originalPrice,
                  percentage: +(100 - (item.price / item.originalPrice) * 100).toFixed(2),
                };
              }
              totalDiscountAmount += item.price - item.originalPrice;
            }
            if (entitlementId === -1) {
              // entitlementObj[`${item.id}-1`] = {
              //   amount: item.price - item.originalPrice,
              //   percentage: +(100 - (item.price / item.originalPrice) * 100).toFixed(2),
              // };
              totalDiscountAmount += item.price - item.originalPrice;
              let DiscountObj = {
                createdAt: "",
                id: `${item.id}-1`,
                name: item.discountDescription,
                organizationId: organization.id,
                updatedAt: "",
                amount: item.price - item.originalPrice,
                percentage: +(100 - (item.price / item.originalPrice) * 100).toFixed(2),
              };
              discounts.push(DiscountObj);
            }

            membershipApi.getEntitlementGroupsByOrganiztionId(organization.id, entitlementGroups).then((response) => {
              const relevantEntitlement = entitlementGroups.split(",");
              response.map((entitlement) => {
                if (relevantEntitlement.includes(String(entitlement.id))) {
                  discounts.push({ ...entitlement, ...entitlementObj[entitlement.id] });
                }
              });
              setDiscounts(discounts);
              setTotalDiscount(totalDiscountAmount);
            });

            const obj = {
              item: {
                name: item.product.name,
                description: item.product.description,
                img: item.img || null,
              },
              quantity: item.product.quantity,
              price: item.originalPrice || 0,
              tax: null,
              total: item.price || 0,
            };
            return obj;
          });
          setItemsRows(items);
          // handle payments rows
          let payments = data.orderToInvoices.map((payment) => {
            const paymentObj = {
              date: payment.updatedAt,
              id: payment.invoice.id,
              method: payment.invoice.paymentType,
              amount: payment.invoice.price,
            };
            return paymentObj;
          });
          setPaymentsRows(payments);
        }
      })
      .catch((e) => {
        ErrorToggle();
      });
  };

  useEffect(() => {
    if (!isShowing || !isShowingDiscount) {
      fetchData();
    }
  }, [isShowing, isShowingDiscount]);

  // columns for DETAILS part
  const ItemsColumns = [
    {
      id: "item",
      label: ` ${TranslationEn.customers.paymentsInvoices.purchasedItems} (${itemsRows.length})`,
      type: "custom",
      component: (state) => {
        return <CustomItemColumn {...state} />;
      },
    },
    {
      id: "quantity",
      label: TranslationEn.customers.paymentsInvoices.quantity,
      type: "string",
    },
    {
      id: "price",
      label: TranslationEn.memberships.dashboard.price,
      type: "currency",
    },
    {
      id: "tax",
      label: TranslationEn.customers.paymentsInvoices.tax,
      type: "string",
    },
    {
      id: "total",
      label: TranslationEn.customers.paymentsInvoices.total,
      type: "currency",
    },
  ];

  const paymentRowRedirection = (row) => {
    let array = location.pathname.split("/");
    array.pop();
    array.pop();
    history.push(`${array.join("/")}/payments/${row.id}`);
  };

  // columns for PAYMENTS part
  const PaymentsColumns = [
    {
      id: "date",
      label: `${TranslationEn.customers.paymentsInvoices.date}`,
      type: "date",
      action: paymentRowRedirection,
    },
    {
      id: "id",
      label: ` ${TranslationEn.customers.paymentsInvoices.recieptId}`,
      type: "string",
      action: paymentRowRedirection,
    },
    {
      id: "method",
      label: ` ${TranslationEn.customers.paymentsInvoices.method}`,
      type: "string",
      action: paymentRowRedirection,
    },
    {
      id: "amount",
      label: ` ${TranslationEn.customers.paymentsInvoices.amount}`,
      type: "currency",
      action: paymentRowRedirection,
    },
    {
      id: "view",
      label: ``,
      type: "icon",
      action: ComingSoonToggle,
    },
    {
      id: "download",
      label: ``,
      type: "icon",
      action: ComingSoonToggle,
    },
  ];

  // columns for SCHEDULED PAYMENTS part
  const scheduledPaymentsColumns = [
    {
      id: "plannedDate",
      label: `${TranslationEn.customers.paymentsInvoices.date}`,
      type: "date",
    },
    {
      id: "price",
      label: `${TranslationEn.customers.paymentsInvoices.amount}`,
      type: "currency",
    },
    {
      id: "status",
      label: `${TranslationEn.customers.listColumns.status}`,
      type: "status",
    },
  ];

  if (loading) {
    return (
      <Fragment>
        <ErrorModal />
        <div>{TranslationEn.isLoading}</div>
      </Fragment>
    );
  }

  const fetchScheduledPayments = () => {
    paymentApi.getScheduledPayments(organization.id, invoiceState.id, invoiceState.payingUserId).then((res) => {
      setScheduledPayments(res);
    });
  };

  const refetch = () => {
    fetchData();
    fetchScheduledPayments();
  };

  const chargeAmount = invoiceState.paidAmount ? invoiceState.price - invoiceState.paidAmount : invoiceState.price;

  return (
    <Fragment>
      <div css={containerCss}>
        <Header
          invoiceState={invoiceState}
          ChargeToggle={toggle}
          DiscountToggle={toggleDiscount}
          scheduledPayments={scheduledPayments}
          fetchScheduledPayments={refetch}
          organizationId={organization.id}
          isPrimaryButton={!invoiceState.isScheduled}
        />
        <MiddleWhiteContainer>
          <SectionContainer label={TranslationEn.customers.paymentsInvoices.billingInfo}>
            <Info
              label={TranslationEn.customers.paymentsInvoices.purchaseDate}
              paymentState={invoiceState}
              customerState={customerState}
            />
          </SectionContainer>
          <SectionContainer label={TranslationEn.memberships.dashboard.details}>
            <div css={detailsTableContainer}>
              <Table rows={itemsRows} columns={ItemsColumns} pagination={false} isHoverRow={false} />
            </div>

            <div css={flexCol} style={{ padding: "1rem", background: "#FAFCFD", borderRadius: "3px" }}>
              <SummaryLine label={TranslationEn.payments.items.subTotal} value={Pricify(invoiceState.price)} />
              <SummaryLine label={TranslationEn.payments.items.taxRate} value={Pricify()} />
              {discounts.length > 0 && (
                <React.Fragment>
                  <SummaryLine
                    label={TranslationEn.customers.paymentsInvoices.discount}
                    value={Pricify(totalDiscount)}
                  />
                  {discounts.map((discount, index) => {
                    return (
                      <SummaryLine
                        sub
                        label={`${discount.name} (${discount.percentage}%)`}
                        value={Pricify(discount.amount)}
                        key={index}
                      />
                    );
                  })}
                </React.Fragment>
              )}
              <SummaryLine
                label={TranslationEn.customers.paymentsInvoices.total}
                weight={500}
                value={Pricify(invoiceState.price)}
              />
            </div>
          </SectionContainer>
          {scheduledPayments.length !== 0 && (
            <SectionContainer label={TranslationEn.customers.paymentsInvoices.paymentsSchedule}>
              <div css={scheduledPaymentsContainer}>
                <Table
                  rows={scheduledPayments}
                  columns={scheduledPaymentsColumns}
                  pagination={false}
                  isHoverRow={false}
                />
              </div>
            </SectionContainer>
          )}
          {invoiceState.paymentStatus !== "not_paid" && (
            <SectionContainer label={TranslationEn.customers.tabs.payments}>
              <div css={TableContainer}>
                <Table rows={paymentsRows} columns={PaymentsColumns} pagination={false} isHoverRow={false} />
              </div>
              {invoiceState.paymentStatus === "partial" && (
                <div css={flexCol} style={{ padding: "1rem", background: "#F3F7FA", borderRadius: "3px" }}>
                  <SummaryLine
                    fontSize={1.4}
                    weight={500}
                    label={TranslationEn.payments.totalPaid}
                    value={Pricify(invoiceState.paidAmount)}
                  />
                  <SummaryLine
                    fontSize={1.6}
                    weight={600}
                    label={TranslationEn.payments.totalDue}
                    value={Pricify(invoiceState.price - invoiceState.paidAmount)}
                  />
                </div>
              )}
            </SectionContainer>
          )}
          {!invoiceState.isScheduled ? (
            invoiceState.paymentStatus !== "paid" ? (
              <div css={flexEndCss}>
                <CTAButton css={ChargeButtonCss} onClick={toggle}>
                  {TranslationEn.customers.paymentsInvoices.charge} {Pricify(chargeAmount)}
                </CTAButton>
              </div>
            ) : (
              <NotesPart />
            )
          ) : (
            <div css={flexEndCss}>
              <CTAButton onClick={toggle}>
                {TranslationEn.customers.paymentsInvoices.chargeBalance} {Pricify(chargeAmount)}
              </CTAButton>
            </div>
          )}
        </MiddleWhiteContainer>
      </div>
      <Modal isShowing={isShowing} padding={0} toggle={toggle}>
        <Charge
          organizationId={organization.id}
          orderId={invoiceState.id}
          toggle={toggle}
          userId={customerState.entityId}
          totalAmount={chargeAmount}
          // isScheduled={false}
          isScheduled={invoiceState.isScheduled}
          // isAmountEditable={false}
          // alternativeHandleCharge={(val) => console.log(val)}
        />
      </Modal>
      <Modal isShowing={isShowingDiscount} padding={0} toggle={toggleDiscount}>
        <Discount
          lineItemId={invoiceState.lineItems[0].id}
          toggle={toggleDiscount}
          customerId={customerState.entityId || 2}
          totalAmount={invoiceState.price}
        />
      </Modal>
      <ComingSoonModal />
    </Fragment>
  );
};

const notesContainerCss = css`
  ${flexCol};
  font-family: Montserrat;
  font-style: normal;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.5rem;
  color: ${colors.formInputBg};
  label {
    b {
      font-weight: 500;
    }
  }
  textarea {
    background: ${setOpacity(colors.brandPrimary, 0.04)};
    font-size: 1.4rem;
    padding: 1rem;
    color: ${colors.brandPrimary};
    border: none;
  }
  div {
    margin-top: 5px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const NotesPart = () => {
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const [value, setValue] = useState<string>("");
  // still in progress
  return (
    <React.Fragment>
      <div css={notesContainerCss}>
        <label>
          <b>Notes</b> (Optional)
        </label>
        <textarea
          onFocus={() => ComingSoonToggle()}
          rows={3}
          maxLength={120}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        ></textarea>
        <div>{`${value.length}/120`}</div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
// background: ${setOpacity(colors.brandPrimary, 0.04)};
//
