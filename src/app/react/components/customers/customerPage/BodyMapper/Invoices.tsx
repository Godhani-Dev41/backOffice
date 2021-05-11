/** @jsx jsx */
import React, { useState, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { jsx, css } from "@emotion/react";
import { CustomSelect } from "../../customSelect";
import { Table, ItemsPerPageCalculator } from "../../../shared/Table";
import { Input } from "../../../shared/Input";
import { flex, checkboxCss, CheckedIconCss, iconCss, filterContainer } from "../../../../styles/utils";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import * as queryString from "querystring";
import { CustomCheckbox } from "../../../shared/Checkbox";
import { EPaymentStatus, EPaymentMethod } from "../../../../types/payment";
import { TranslationEn } from "assets/i18n/en";
import { useComingSoonPopUp } from "../../../shared/ComingSoon";

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
export const Invoices = ({ customerState, customersService }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [methodFilter, setMethodFilter] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [tablePage, setPage] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [meta, setMeta] = useState({});
  const tableContainerRef = useRef(null);
  const history = useHistory();
  const location = useLocation();
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();

  const { itemsPerPage } = ItemsPerPageCalculator(tableContainerRef);
  const [skipFirstFetch, setSkipFirstFetch] = useState<boolean>(true);

  const handleRedirection = (id: number) => {
    history.push(`${location.pathname}/${id}`);
  };

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
        .getInvoicesByCustomer(
          Number(customerState.id),
          tablePage + 1,
          itemsPerPage,
          statusFilter,
          methodFilter,
          searchFilter,
        )
        .toPromise()
        .then((data) => {
          let newInvoices = data.data.map((invoice, index) => {
            invoice.itemsCount = `${invoice.lineItems.length} ${invoice.lineItems.length === 1 ? "Item" : "Items"}`;
            invoice.paymentType = TranslationEn.payments.methods[invoice.paymentType];
            invoice.paymentStatus =
              invoice.isScheduled && invoice.paymentStatus !== "paid" ? "scheduled" : invoice.paymentStatus;

            return invoice;
          });
          setInvoices(newInvoices);
          setMeta(data.meta);
        });
    }
    setSkipFirstFetch(false);
  }, [statusFilter, methodFilter, searchFilter, tablePage, itemsPerPage]);

  const columns = [
    {
      id: "createdAt",
      label: "Created On",
      type: "datetime",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "id",
      label: "Invoice No.",
      type: "number",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "itemsCount",
      label: "Items",
      type: "string",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "price",
      label: "Total",
      type: "currency",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "paymentType",
      label: "Payment Method",
      type: "string",
      action: (row) => handleRedirection(row.id),
    },
    {
      id: "paymentStatus",
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

  const InvoiceFilters = () => {
    // still in progress
    return (
      <div css={filterContainer}>
        <label>Status</label>
        {Object.keys(EPaymentStatus).map((key, index) => {
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
              <div>{TranslationEn.customers.tags[key]}</div>
            </div>
          );
        })}
        <label>Payment Methods</label>
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
          <CustomSelect title="Filter" content={<InvoiceFilters />} />
          <Input
            search
            placeholder="Search by invoice no."
            // onFocus={() => ComingSoonToggle()}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
        <div ref={tableContainerRef} css={tableContainerCss}>
          <Table page={tablePage} ssr meta={meta} rows={invoices} columns={columns} isLoading={isLoading} />
        </div>
      </div>
      <ComingSoonModal />
    </React.Fragment>
  );
};
