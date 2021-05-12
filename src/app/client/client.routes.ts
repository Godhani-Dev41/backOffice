import { MembershipPageComponent } from "./pages/memberships/memberships-page.component";
import { CustomersNewPageComponent } from "./pages/customers_new/customers_new-page.component";
import { CustomersPageComponent } from "@app/client/pages/customers/customers-page/customers-page.component";
import { WidgetsComingSoonComponent } from "@app/client/pages/widgets-coming-soon/widgets-coming-soon.component";
import { ClientResolve } from "./client.resolve";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LayoutComponent } from "./pages/layout/layout.component";
import { OrganizationEditComponent } from "./pages/organization-edit/organization-edit.component";
import { OrganizationSettingsComponent } from "./pages/organization-settings/organization-settings.component";
import { OrganizationSettingsRegistrationPageComponent } from "./pages/organization-settings/organization-settings-registration-page/organization-settings-registration-page.component";
import { OrganizationSettingsBillingComponent } from "@app/client/pages/organization-settings/organization-settings-billing/organization-settings-billing.component";
import { CustomerPageComponent } from "@app/client/pages/customers/customer-page/customer-page.component";
import { CustomerDetailsPageComponent } from "@app/client/pages/customers/customer-page/customer-details-page/customer-details-page.component";
import { CustomerReservationsPageComponent } from "@app/client/pages/customers/customer-page/customer-reservations-page/customer-reservations-page.component";
import { LeaveCustomerPageGuard } from "@app/client/pages/customers/customer-page/leave-customer-page.guard";
import { LeaveOrderPageGuard } from "@app/client/pages/orders/order-page/leave-customer-page.guard";
import { OrderPageComponent } from "@app/client/pages/orders/order-page/order-page.component";
import { OrderDetailsComponent } from "@app/client/pages/orders/components/order-details/order-details.component";
import { OrderAnswersComponent } from "@app/client/pages/orders/components/order-answers/order-answers.component";
import { OrganizationSettingsNotificationsComponent } from "@app/client/pages/organization-settings/organization-settings-notifications/organization-settings-notifications.component";
import { OrganizationSettingsFacilitiesComponent } from "./pages/organization-settings/organization-settings-facilities/organization-settings-facilities.component";
import { OrganizationSettingsFormsComponent } from "./pages/organization-settings/organization-settings-forms/organization-settings-forms.component";
import { QuestionnaireEditComponent } from "./pages/organization-settings/settings-pages/questionnaire-edit-page/questionnaire-edit-page.component";
import { ActivitiesViewComponent } from "./pages/activities/activities-view/activities-view.component";

export const routes = [
  {
    path: "",
    component: LayoutComponent,
    resolve: { client: ClientResolve },
    children: [
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
      { path: "dashboard", component: DashboardComponent },
      { path: "organization/questionnaire/questions-edit", component: QuestionnaireEditComponent },

      {
        path: "organization/settings",
        component: OrganizationSettingsComponent,
        children: [
          { path: "", redirectTo: "about", pathMatch: "full" },
          { path: "about", component: OrganizationEditComponent },
          { path: "waiver", component: OrganizationSettingsRegistrationPageComponent },
          { path: "billing", component: OrganizationSettingsBillingComponent },
          { path: "facilities", component: OrganizationSettingsFacilitiesComponent },
          { path: "notifications", component: OrganizationSettingsNotificationsComponent },
          { path: "forms", component: OrganizationSettingsFormsComponent },
        ],
      },
      { path: "organization/edit", component: OrganizationEditComponent },
      { path: "leagues", loadChildren: () => import('./pages/leagues/leagues.module').then(m => m.LeaguesModule) },
      { path: "events", loadChildren: () => import('./pages/events/events.module').then(m => m.EventsModule) },
      { path: "programs", loadChildren: () => import('./pages/programs/programs.module').then(m => m.ProgramsModule) },
      /*
      { path: 'clinics', loadChildren: './pages/programs/clinics/camps.module#ProgramsModule' },
      { path: 'classes', loadChildren: './pages/programs/classes/camps.module#ProgramsModule' },
      { path: 'lessons', loadChildren: './pages/programs/lessons/camps.module#ProgramsModule' },
*/
      { path: "facilities", loadChildren: () => import('./pages/venues/venues.module').then(m => m.VenuesModule) },
      { path: "widgets", component: WidgetsComingSoonComponent },
      { path: "tournaments", loadChildren: () => import('./pages/tournaments/tournaments.module').then(m => m.TournamentsModule) },
      { path: "activities", component: ActivitiesViewComponent },
      { path: "memberships", component: MembershipPageComponent },
      { path: "customers", component: CustomersNewPageComponent },
      { path: "customers_old", component: CustomersPageComponent },

      {
        canDeactivate: [LeaveOrderPageGuard],
        path: "orders/:orderId",
        component: OrderPageComponent,
        children: [
          {
            path: "",
            redirectTo: "details",
            pathMatch: "full",
          },
          {
            path: "details",
            component: OrderDetailsComponent,
          },
          {
            path: "answers",
            component: OrderAnswersComponent,
          },
        ],
      },
      // {
      //   canDeactivate: [LeaveCustomerPageGuard],
      //   path: "customers/:customerId",
      //   component: CustomerPageComponent,
      //   children: [
      //     {
      //       path: "",
      //       redirectTo: "details",
      //       pathMatch: "full",
      //     },
      //     {
      //       path: "details",
      //       component: CustomerDetailsPageComponent,
      //     },
      //     {
      //       path: "reservations",
      //       component: CustomerReservationsPageComponent,
      //     },
      //   ],
      // },
    ],
  },
];
