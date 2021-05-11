/** @jsx jsx */

import React, { Fragment, useEffect, useRef, useState } from "react";
import { jsx, css } from "@emotion/react";
import { HashRouter as Router, Route, useParams } from "react-router-dom";
import { TranslationEn } from "../../../../assets/i18n/en";
import { customersApi } from "../../lib/api/customersApi";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { useHistory, useLocation } from "react-router-dom";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { Table, ItemsPerPageCalculator } from "../../components/shared/Table/index";
import { colors } from "../../styles/theme";
import { ReactSVG } from "react-svg";
import { CustomSelect } from "../../components/customers/customSelect";
import { CTAButton } from "../../components/shared/Button/CTAButton";
import { ICustomer, CustomerTypeEnum } from "../../types/customers";
import * as queryString from "querystring";
import { flex, filterContainer, checkboxCss, CheckedIconCss, iconCss } from "../../styles/utils";
import { CustomCheckbox } from "../../components/shared/Checkbox";
import { useComingSoonPopUp } from "../../components/shared/ComingSoon";
import { Input } from "../../components/shared/Input";

interface Props {
  organization: RCOrganization;
  customersService: CustomersService;
  organizationService: OrganizationsService;
  sportsService: SportsService;
}

const container = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const mainContainer = css`
  ${container}
  padding: 1rem 2rem;
`;

const headerTitle = css`
  font-family: Montserrat;
  font-style: normal;
  font-weight: bold;
  font-size: 2rem;
  line-height: 2.4rem;
  color: ${colors.brandPrimary};
`;

const addIconCss = css`
  height: 12px;
  width: 10px;
  margin-right: 10px;
`;

const expandButtonCss = css`
  background: transparent;
  border: none;
  margin-right: 1rem;
  div {
    align-items: center;
    justify-content: center;
  }
`;
const filterSection = css`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  div {
    display: flex;
  }
`;

const expandableArrow = css`
  height: 12px;
  width: 12px;
  margin: 0;
`;

interface IMeta {
  totalItems?: number;
  itemsPerPage?: number;
  totalPages?: number;
  currentPage?: number;
}

export const CustomersList = ({ organization, customersService, organizationService, sportsService }: Props) => {
  const [isLoading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Array<ICustomer>>([]);
  const [tablePage, setPage] = useState(0);
  const [meta, setMeta] = useState<IMeta>({});
  const [expandAll, setExpandAll] = useState<boolean>(false);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState<string>("");
  const location = useLocation();
  const history = useHistory();
  const [skipFirstFetch, setSkipFirstFetch] = useState(true);

  const tableContainerRef = useRef(null);

  const { itemsPerPage, maxHeight } = ItemsPerPageCalculator(tableContainerRef);
  const { ComingSoonToggle, ComingSoonModal } = useComingSoonPopUp();

  useEffect(() => {
    history.push(`${location.pathname}?page=1`);
  }, [typeFilter, searchFilter]);

  useEffect(() => {
    if (!skipFirstFetch) {
      (async () => {
        const data = await customersService
          .getCustomers(Number(organization.id), tablePage + 1, itemsPerPage, typeFilter, searchFilter)
          .toPromise();
        setCustomers(data.data);
        if (data.meta) {
          setMeta(data.meta);
        } else {
          setMeta({
            totalItems: data.data.length,
            itemsPerPage: 10,
            totalPages: Math.ceil(data.data.length / 10),
            currentPage: tablePage,
          });
        }
        setLoading(false);
      })();
    }
    setSkipFirstFetch(false);
  }, [tablePage, itemsPerPage, typeFilter, searchFilter]);

  useEffect(() => {
    const parsed = queryString.parse(location.search.replace("?", ""));
    if (parsed.page) {
      setPage(Number(parsed.page) - 1);
    }
  }, [location]);

  const handleRedirection = (id: number, entityType: CustomerTypeEnum) => {
    history.push(`/${entityType ? (entityType === "user" ? "customer" : entityType) : "customer"}/${id}/overview`);
  };

  const rowRedirection = (row) => {
    handleRedirection(row.id, row.entityType);
  };

  const Columns = [
    {
      id: "id",
      label: TranslationEn.customers.listColumns["id"],
      type: "number",
      action: rowRedirection,
    },
    {
      id: "lastName",
      label: TranslationEn.customers.listColumns["lastName"],
      type: "string",
      action: rowRedirection,
    },
    {
      id: "firstName",
      label: TranslationEn.customers.listColumns["firstName"],
      type: "string",
      action: rowRedirection,
    },
    {
      id: "phoneNumber",
      label: TranslationEn.customers.listColumns["phoneNumber"],
      type: "number",
      action: rowRedirection,
    },
    {
      id: "waiverSignedDate",
      label: TranslationEn.customers.listColumns["waiver"],
      type: "boolean",
      action: rowRedirection,
    },
    {
      id: "birthDate",
      label: TranslationEn.customers.listColumns["birthDate"],
      type: "age",
      action: rowRedirection,
    },
    {
      id: "balance",
      label: TranslationEn.customers.listColumns["balance"],
      type: "balance",
      action: rowRedirection,
    },
    {
      id: "entityType",
      label: TranslationEn.customers.listColumns["entityType"],
      type: "status",
      action: rowRedirection,
    },
    // {
    //   id: "status",
    //   label: TranslationEn.customers.listColumns["status"],
    //   type: "status",
    //   action: (row) => handleRedirection(row.id, row.entityType),
    // },
    {
      id: "email",
      label: "",
      type: "icon",
      action: (row) => {
        let link = document.createElement("a");
        link.href = `mailto:${row.email}`;
        link.target = "_blank";
        link.click();
      },
    },
    {
      id: "more",
      label: "",
      type: "icon",
      action: ComingSoonToggle,
    },
  ];

  const Options = () => {
    return (
      <div css={filterContainer}>
        <label>Client Type</label>
        {Object.keys(CustomerTypeEnum).map((key, index) => {
          return (
            <div css={flex} key={index}>
              <CustomCheckbox
                css={checkboxCss}
                checkedIcon={<span id="checked" css={CheckedIconCss} />}
                icon={<span css={iconCss} />}
                checked={typeFilter.includes(CustomerTypeEnum[key])}
                onChange={(e) => {
                  if (e.target.checked) {
                    setTypeFilter([...typeFilter, e.target.name]);
                  } else {
                    setTypeFilter(typeFilter.filter((type) => type != e.target.name));
                  }
                }}
                name={CustomerTypeEnum[key]}
              />
              <div>{TranslationEn.customers.tags[CustomerTypeEnum[key]]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Fragment>
      <div css={mainContainer}>
        <h1 css={headerTitle}>{TranslationEn.customers.allCustomers}</h1>
        <div css={filterSection}>
          <div>
            {/* <CustomSelect title={"for checked"} content={<div> </div>} /> */}
            <CustomSelect title={"Filter"} content={<Options />} />

            <Input
              search
              placeholder="Search by name"
              // onFocus={() => ComingSoonToggle()}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <button css={expandButtonCss} onClick={() => setExpandAll(!expandAll)}>
              {expandAll ? (
                <Fragment>
                  <ReactSVG css={expandableArrow} src="assets/media/icons/arrow_expand.svg" />
                  <ReactSVG css={expandableArrow} src="assets/media/icons/arrow_expand_up.svg" />
                </Fragment>
              ) : (
                <Fragment>
                  <ReactSVG css={expandableArrow} src="assets/media/icons/arrow_expand_up.svg" />
                  <ReactSVG css={expandableArrow} src="assets/media/icons/arrow_expand.svg" />
                </Fragment>
              )}
            </button>
          </div>
          <CTAButton onClick={() => ComingSoonToggle()}>
            <ReactSVG css={addIconCss} src="assets/media/icons/customers/union.svg" />
            {TranslationEn.customers.addCustomer}
          </CTAButton>
        </div>
        <div ref={tableContainerRef} css={container}>
          <Table
            maxHeight={maxHeight}
            page={tablePage}
            rows={customers}
            columns={Columns}
            isLoading={isLoading}
            ssr
            isExpand={expandAll}
            expandable
            expandableKey={"members"}
            expandOn={"lastName"}
            meta={meta}
          />
        </div>
      </div>
      <ComingSoonModal />
    </Fragment>
  );
};
