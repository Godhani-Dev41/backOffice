/** @jsx jsx */

import React, { useState, useEffect, Fragment } from "react";
import { jsx, css } from "@emotion/react";
import { Table } from "../../shared/Table";
import { TranslationEn } from "assets/i18n/en";
import { colors } from "../../../styles/theme";
import { Footer } from "../utils/footer";

const containerCss = css`
  margin: 3rem 4rem;
  border: 1px solid ${colors.borderPrimary};
  border-radius: 5px;
  .MuiPaper-elevation1,
  .MuiTableContainer-root {
    border-radius: 5px;
  }
  th,
  td {
    padding: 6px 14px !important;
  }
  .MuiTableContainer-root {
    max-height: 350px !important;
  }
`;

const customItemCss = css`
  width: 5rem;
`;

export const ConfirmScheduled = ({ payments, onSubmit }) => {
  const columns = [
    {
      id: "plannedDate",
      label: TranslationEn.customers.paymentsInvoices.date,
      type: "date",
    },
    {
      id: "",
      label: "",
      type: "custom",
      component: (state) => {
        return <CustomItemColumn {...state} />;
      },
    },
    {
      id: "price",
      label: TranslationEn.customers.paymentsInvoices.amount,
      type: "currency",
    },
  ];
  return (
    <Fragment>
      <div css={containerCss}>
        <Table rows={payments} columns={columns} isHoverRow={false} pagination={false} />
      </div>
      <Footer
        toggle={() => {}}
        disabled={false}
        loader={false}
        submitButtonText={TranslationEn.customers.paymentsInvoices.apply}
        onSubmit={onSubmit}
      />
    </Fragment>
  );
};

const CustomItemColumn = () => {
  return <div css={customItemCss}></div>;
};
