/** @jsx jsx */
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { Table, ItemsPerPageCalculator } from "../../../shared/Table";
import { CustomSelect } from "../../customSelect";
import { Input } from "../../../shared/Input";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import * as queryString from "querystring";
import { flexCol, flex, filterContainer, checkboxCss, CheckedIconCss, iconCss } from "../../../../styles/utils";
import { CustomCheckbox } from "../../../shared/Checkbox";
import { PaymentChargeStatusEnum, EPaymentMethod } from "../../../../types/payment";
import { TranslationEn } from "assets/i18n/en";
import { useComingSoonPopUp } from "../../../shared/ComingSoon";
import { capitalize } from "../../../../lib/form";

const containerCss = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
`;
const filterContainerCss = css`
  display: flex;
  align-items: center;
  margin: 5px 2rem;
`;

const tableContainerCss = css`
  height: 500px;
  flex-grow: 1;
  margin: 1rem 2rem 2rem 2rem;
`;

interface Props {
  customerState: any;
  customersService: CustomersService;
}

export const Payments = ({ customerState, customersService }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [tablePage, setPage] = useState(0);
  const [payments, setPayments] = useState([]);
  const [meta, setMeta] = useState({});
  const [statusFilter, setStatusFilter] = useState([]);
  const [methodFilter, setMethodFilter] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const history = useHistory();
  const location = useLocation();
  const tableContainerRef = useRef(null);
  const { itemsPerPage } = ItemsPerPageCalculator(tableContainerRef);
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();
  const [skipFirstFetch, setSkipFirstFetch] = useState<boolean>(true);

  useEffect(() => {
    const parsed = queryString.parse(location.search.replace("?", ""));
    if (parsed.page) {
      setPage(Number(parsed.page) - 1);
    }
  }, [location]);

  useEffect(() => {
    history.push(`${location.pathname}?page=1`);
  }, [methodFilter, searchFilter, statusFilter]);

  useEffect(() => {
    if (!skipFirstFetch) {
      customersService
        .getPaymentsByCustomer(
          Number(customerState.id),
          tablePage + 1,
          itemsPerPage,
          statusFilter,
          methodFilter,
          searchFilter,
        )
        .toPromise()
        .then((data) => {
          let newPayments = data.data.map((pay, index) => {
            let desc = "";
            pay.invoices.map((invoice, index) => {
              if (index === 0) {
                desc = `Invoice ${invoice}`;
              } else {
                desc += `, ${invoice}`;
              }
            });
            pay.description = desc;
            pay.paymentMethod = capitalize(pay.paymentMethod);
            pay.status = pay.status === "paid" ? "charged" : pay.status;
            return pay;
          });

          setPayments(newPayments);
          setMeta(data.meta);
        });
    }
    setSkipFirstFetch(false);
  }, [statusFilter, methodFilter, searchFilter, tablePage, itemsPerPage]);

  const handleRedirection = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };
  const columns = [
    {
      id: "createdAt",
      label: TranslationEn.customers.paymentsInvoices.createdOn,
      type: "datetime",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "id",
      label: TranslationEn.customers.paymentsInvoices.receiptNum,
      type: "number",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "description",
      label: TranslationEn.memberships.dashboard.details,
      type: "string",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "total",
      label: TranslationEn.customers.paymentsInvoices.total,
      type: "currency",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "paymentMethod",
      label: TranslationEn.customers.paymentsInvoices.paymentMethod,
      type: "string",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "status",
      label: "",
      type: "status",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "forward",
      label: "",
      type: "icon",
      action: (row) => handleRedirection(row.id),
    },
  ];

  const PaymenteFilters = () => {
    // still in progress
    return (
      <div css={filterContainer}>
        <label>{TranslationEn.customers.listColumns.status}</label>
        {Object.keys(PaymentChargeStatusEnum).map((key, index) => {
          return (
            <div css={flex} key={index}>
              <CustomCheckbox
                css={checkboxCss}
                checkedIcon={<span id="checked" css={CheckedIconCss} />}
                icon={<span css={iconCss} />}
                checked={statusFilter.includes(key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setStatusFilter([...statusFilter, e.target.name]);
                  } else {
                    setStatusFilter(statusFilter.filter((status) => status != e.target.name));
                  }
                }}
                name={key}
              />
              <div>{TranslationEn.customers.alternativeTags[key]}</div>
            </div>
          );
        })}
        <label>{TranslationEn.customers.paymentsInvoices.paymentMethod}</label>
        {Object.keys(EPaymentMethod).map((key, index) => {
          return (
            <div css={flex} key={index}>
              <CustomCheckbox
                css={checkboxCss}
                checkedIcon={<span id="checked" css={CheckedIconCss} />}
                icon={<span css={iconCss} />}
                checked={methodFilter.includes(key)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setMethodFilter([...methodFilter, e.target.name]);
                  } else {
                    setMethodFilter(methodFilter.filter((method) => method != e.target.name));
                  }
                }}
                name={key}
              />
              <div>{TranslationEn.payments.methods[key]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div css={containerCss}>
        <div css={filterContainerCss}>
          {/* <CustomSelect title="for checked" /> */}
          <CustomSelect title={TranslationEn.filter} content={<PaymenteFilters />} />
          <Input
            search
            placeholder={TranslationEn.payments.searchByPayment}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            // onFocus={() => ComingSoonToggle()}
          />
        </div>
        <div ref={tableContainerRef} css={tableContainerCss}>
          <Table page={tablePage} ssr meta={meta} rows={payments} columns={columns} isLoading={isLoading} />
        </div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
