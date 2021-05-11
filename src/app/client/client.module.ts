import { MembershipPageComponent } from "./pages/memberships/memberships-page.component";
import { CustomersNewPageComponent } from "./pages/customers_new/customers_new-page.component";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedPagesModule } from "@app/shared/shared.pages.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { SharedModule } from "../shared.module";
import { ClientResolve } from "./client.resolve";
import { routes } from "./client.routes";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { LayoutComponent } from "./pages/layout/layout.component";
import { SidemenuComponent } from "./pages/layout/sidemenu/sidemenu.component";
import { TopMenuComponent } from "./pages/layout/top-menu/top-menu.component";
import { OrganizationEditComponent } from "./pages/organization-edit/organization-edit.component";
import { ReactiveFormsModule } from "@angular/forms";
import { TooltipModule } from "ngx-bootstrap";
import { ColorPickerModule } from "ngx-color-picker";
import { DragulaModule } from "ng2-dragula";
import { OrganizationSettingsComponent } from "./pages/organization-settings/organization-settings.component";
import { OrganizationSettingsRegistrationPageComponent } from "./pages/organization-settings/organization-settings-registration-page/organization-settings-registration-page.component";
import { BsDropdownModule, ModalModule } from "ngx-bootstrap";
import { OrganizationSettingsBillingComponent } from "./pages/organization-settings/organization-settings-billing/organization-settings-billing.component";
import { VenuesComingSoonComponent } from "./pages/venues/venues-coming-soon/venues-coming-soon.component";
import { WidgetsComingSoonComponent } from "./pages/widgets-coming-soon/widgets-coming-soon.component";
import { CustomersPageComponent } from "./pages/customers/customers-page/customers-page.component";
import { CustomerEditModalComponent } from "./pages/customers/customers-page/customer-edit-modal/customer-edit-modal.component";
import { CustomerPageComponent } from "./pages/customers/customer-page/customer-page.component";
import { CustomerDetailsPageComponent } from "./pages/customers/customer-page/customer-details-page/customer-details-page.component";
import { CustomerReservationsPageComponent } from "./pages/customers/customer-page/customer-reservations-page/customer-reservations-page.component";
import { LeaveCustomerPageGuard } from "@app/client/pages/customers/customer-page/leave-customer-page.guard";

import { LeaveOrderPageGuard } from "@app/client/pages/orders/order-page/leave-customer-page.guard";
import { OrderPageComponent } from "@app/client/pages/orders/order-page/order-page.component";
import { OrganizationSettingsNotificationsComponent } from "./pages/organization-settings/organization-settings-notifications/organization-settings-notifications.component";
import { OrderDetailsComponent } from "@app/client/pages/orders/components/order-details/order-details.component";
import { OrderAnswersComponent } from "@app/client/pages/orders/components/order-answers/order-answers.component";
import { OrganizationSettingsFacilitiesComponent } from "./pages/organization-settings/organization-settings-facilities/organization-settings-facilities.component";
import { OrganizationSettingsFormsComponent } from "./pages/organization-settings/organization-settings-forms/organization-settings-forms.component";
import { QuestionnaireEditComponent } from "./pages/organization-settings/settings-pages/questionnaire-edit-page/questionnaire-edit-page.component";
import { ActivitiesViewComponent } from "./pages/activities/activities-view/activities-view.component";
import { ProgramCreateModalComponent } from "./pages/activities/program-create-modal/program-create-modal.component";
import { NgZorroAntdModule } from "ng-zorro-antd";

@NgModule({
  imports: [
    NgxDatatableModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DragulaModule,
    TooltipModule.forRoot(),
    ColorPickerModule,
    SharedPagesModule,
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  providers: [ClientResolve, LeaveCustomerPageGuard, LeaveOrderPageGuard],
  declarations: [
    ActivitiesViewComponent,
    QuestionnaireEditComponent,
    DashboardComponent,
    LayoutComponent,
    SidemenuComponent,
    TopMenuComponent,
    OrganizationEditComponent,
    OrganizationSettingsComponent,
    OrganizationSettingsRegistrationPageComponent,
//    OrganizationSettingsMembershipPageComponent,
    OrganizationSettingsBillingComponent,
    OrganizationSettingsFacilitiesComponent,
    OrganizationSettingsFormsComponent,
    VenuesComingSoonComponent,
    WidgetsComingSoonComponent,
    CustomersPageComponent,
    CustomerEditModalComponent,
    CustomerPageComponent,
    CustomerDetailsPageComponent,
    CustomerReservationsPageComponent,
    OrderPageComponent,
    OrganizationSettingsNotificationsComponent,
    OrderDetailsComponent,
    OrderAnswersComponent,
    ProgramCreateModalComponent,
    MembershipPageComponent,
    CustomersNewPageComponent,
  ],
  exports: [CustomerEditModalComponent],
})
export class ClientModule {
  constructor() {}
}
