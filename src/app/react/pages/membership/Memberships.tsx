import React from "react";
import { HashRouter as Router, Route, Redirect } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilDebugObserver from "app/react/components/shared/RecoilDebugObserver/RecoilDebugObserver";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { Select } from "app/react/pages/membership/Select";
import { Details } from "app/react/pages/membership/Details";
import { Settings } from "app/react/pages/membership/Settings";
import { AdminDashboard } from "app/react/pages/membership/AdminDashboard";
import { Dashboard } from "app/react/pages/membership/Dashboard";
import { Type } from "app/react/pages/membership/Type";
import { Pricing } from "app/react/pages/membership/Pricing";

import { Global } from "@emotion/react";
import { CssBaseline, MuiThemeProvider, StylesProvider } from "@material-ui/core";
import { globalCss } from "../../styles/global";
import muiTheme from "../../styles/muiTheme";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCOrganization } from "@rcenter/core";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { SportsService } from "@app/shared/services/utils/sports.service";

interface Props {
  organization: RCOrganization;
  venuesService: VenuesService;
  organizationService: OrganizationsService;
  sportsService: SportsService;
}

export const Memberships = (props: Props) => {
  return (
    <StylesProvider injectFirst>
      <Global styles={globalCss} />
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <RecoilRoot>
            <RecoilDebugObserver />
            <Router>
              <Route exact path="/select" render={() => <Select organizationId={props.organization.id} />} />
              <Route path="/details/:membershipId?" render={() => <Details {...props} />} />
              <Route path="/settings/:membershipId?" render={() => <Settings />} />
              <Route path="/type/:membershipId?" render={() => <Type />} />
              <Route path="/pricing/:membershipId?" render={() => <Pricing />} />
              <Route
                exact
                path="/dashboard/:membershipId"
                render={() => <Dashboard organizationName={props.organization.name} />}
              />
              <Route exact path="/adminDashboard" render={() => <AdminDashboard />} />
              <Route exact path="/">
                <Redirect to="/select" />
              </Route>
            </Router>
          </RecoilRoot>
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </StylesProvider>
  );
};
