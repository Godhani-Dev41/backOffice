import { SeasonReportsPageComponent } from "./../leagues/league-page/league-page-season/season-reports-page/season-reports-page.component";
import { ProgramSeasonEventsComponent } from "./program-season-events/program-season-events.component";
import { ProgramDashboardPageComponent } from "@app/client/pages/programs/program-dashboard-page/program-dashboard-page.component";
import { ProgramCreatorPageComponent } from "@app/client/pages/programs/program-creator-page/program-creator-page.component";
import { ProgramSeasonSchedulePageComponent } from "@app/client/pages/programs/program-season-schedule-page/program-season-schedule-page.component";
import { ProgramViewComponent } from "@app/client/pages/programs/program-view/program-view.component";
import { ProgramSeasonDashboardPageComponent } from "@app/client/pages/programs/program-season-dashboard-page/program-season-dashboard-page.component";
import { ProgramSeasonPricingPageComponent } from "@app/client/pages/programs/program-season-pricing-page/program-season-pricing-page.component";
import { ProgramSeasonPageComponent } from "@app/client/pages/programs/program-season-page/program-season-page.component";
import { ProgramParticipantListComponent } from "@app/client/pages/programs/program-participant-list/program-participant-list.component";
import { ProgramSeasonAddonsPageComponent } from "@app/client/pages/programs/program-season-addons-page/program-season-addons-page.component";
import { ProgramSeasonSpacesPageComponent } from "@app/client/pages/programs/program-season-spaces-page/program-season-spaces-page.component";
import { SeasonLeaveGuard } from "@app/client/pages/leagues/leave-guard.guard";
import { ProgramSeasonDashboardComponent } from "@app/client/pages/programs/program-season-dashboard/program-season-dashboard.component";
import { ProgramSeasonGroupsComponent } from "@app/client/pages/programs/program-season-groups/program-season-groups.component";
import { ProgramSeasonGroupsFreeagentsComponent } from "@app/client/pages/programs/program-season-groups/program-season-groups-freeagents/program-season-groups-freeagents.component";

export const routes = [
  {
    path: "",
    children: [
      { path: "", redirectTo: "view", pathMatch: "full" },
      {
        path: ":programType",
        component: ProgramViewComponent,
      },
      {
        path: ":programType/basic",
        component: ProgramCreatorPageComponent,
      },
      {
        path: ":programType/:programId/basic",
        component: ProgramCreatorPageComponent,
      },
      {
        path: ":programType/:programId",
        component: ProgramDashboardPageComponent,
      },
      {
        path: ":programType/:programId/season/basic",
        component: ProgramSeasonPageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/basic",
        component: ProgramSeasonPageComponent,
      },
      {
        path: ":programType/:programId/season/schedule",
        component: ProgramSeasonSchedulePageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/schedule",
        component: ProgramSeasonSchedulePageComponent,
      },
      {
        path: ":programType/:programId/season/pricing",
        component: ProgramSeasonPricingPageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/pricing",
        component: ProgramSeasonPricingPageComponent,
      },
      {
        path: ":programType/:programId/season/addons",
        component: ProgramSeasonAddonsPageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/addons",
        component: ProgramSeasonAddonsPageComponent,
      },
      {
        path: ":programType/:programId/season/spaces",
        component: ProgramSeasonSpacesPageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/spaces",
        component: ProgramSeasonSpacesPageComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId/attendees",
        component: ProgramParticipantListComponent,
      },
      {
        path: ":programType/:programId/season/:seasonId",
        component: ProgramSeasonDashboardPageComponent,
        canDeactivate: [SeasonLeaveGuard],
        children: [
          { path: "", redirectTo: "dashboard", pathMatch: "full" },
          {
            path: "dashboard",
            component: ProgramSeasonDashboardComponent,
          },
          {
            path: "groups",
            component: ProgramSeasonGroupsComponent,
            children: [
              { path: "", redirectTo: "freeagents", pathMatch: "full" },
              {
                path: "freeagents",
                component: ProgramSeasonGroupsFreeagentsComponent,
              },
              {
                path: "groups",
                component: ProgramSeasonDashboardComponent,
              },
              {
                path: "invited",
                component: ProgramSeasonDashboardComponent,
              },
              {
                path: "archive",
                component: ProgramSeasonDashboardComponent,
              },
            ],
          },
          {
            path: "events",
            component: ProgramSeasonEventsComponent,
          },
          {
            path: "reports",
            component: SeasonReportsPageComponent,
          },
        ],
      },
    ],
  },
];
