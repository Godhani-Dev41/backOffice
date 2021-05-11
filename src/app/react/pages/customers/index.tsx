import React from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilDebugObserver from "app/react/components/shared/RecoilDebugObserver/RecoilDebugObserver";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { CustomersList } from "./CustomerList";
import { CustomerPage } from "./CustomerPage";
import { FamilyPage } from "./FamilyPage";
import { SinglePayment } from "../../components/customers/singlePayment";
import { SingleInvoice } from "../../components/customers/singleInvoice";

import { Global } from "@emotion/react";
import { CssBaseline, MuiThemeProvider, StylesProvider } from "@material-ui/core";
import { globalCss } from "../../styles/global";
import muiTheme from "../../styles/muiTheme";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { RCOrganization } from "@rcenter/core";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { BnProvider } from "bondsports-utils";
import { environment } from "environments/environment";

interface Props {
  organization: RCOrganization;
  customersService: CustomersService;
  organizationService: OrganizationsService;
  sportsService: SportsService;
}

export const Customers = (props: Props) => {
  return (
    <BnProvider>
      <StylesProvider injectFirst>
        <Global styles={globalCss} />
        <MuiThemeProvider theme={muiTheme}>
          <CssBaseline />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <RecoilRoot>
              <RecoilDebugObserver />
              <Router>
                {/* <Route exact path="/" render={() => <CustomersList {...props} />} /> */}
                {/* <Route exact path="/:page" render={() => <CustomersList {...props} />} /> */}
                <Route exact path="/" render={() => <CustomersList {...props} />} />
                <Route
                  exact
                  path="/customer/:id/:tab?"
                  render={() => (
                    <CustomerPage organization={props.organization} customersService={props.customersService} />
                  )}
                />

                <Route
                  exact
                  path="/family/:familyId/customer/:id/:tab?"
                  render={() => (
                    <CustomerPage organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/family/:id/:tab?"
                  render={() => (
                    <FamilyPage organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/family/:familyId/customer/:customerId/payments/:paymentId"
                  render={() => (
                    <SinglePayment organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/family/:familyId/payments/:paymentId"
                  render={() => (
                    <SinglePayment organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/customer/:customerId/payments/:paymentId"
                  render={() => (
                    <SinglePayment organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/family/:familyId/customer/:customerId/invoices/:invoiceId"
                  render={() => (
                    <SingleInvoice organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/family/:familyId/invoices/:invoiceId"
                  render={() => (
                    <SingleInvoice organization={props.organization} customersService={props.customersService} />
                  )}
                />
                <Route
                  exact
                  path="/customer/:customerId/invoices/:invoiceId"
                  render={() => (
                    <SingleInvoice organization={props.organization} customersService={props.customersService} />
                  )}
                />
              </Router>
            </RecoilRoot>
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      </StylesProvider>
    </BnProvider>
  );
};
