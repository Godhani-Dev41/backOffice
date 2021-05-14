import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { LeaveVenueGuard } from "@app/client/pages/venues/leave.guard";
import { SharedModule } from "@app/shared.module";
import { SharedPagesModule } from "@app/shared/shared.pages.module";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { StripeCheckoutModule } from "ng9-stripe-checkout";
import { routes } from "./venues.routes";
import { VenuesPageComponent } from "@app/client/pages/venues/venues-page/venues-page.component";
import { VenueCreatorComponent } from "./venue-creator/venue-creator.component";
import { VenueCardComponent } from "./venues-page/venue-card/venue-card.component";
import { VenuePageComponent } from "./venue-page/venue-page.component";
import { VenuePageScheduleComponent } from "./venue-page/venue-page-schedule/venue-page-schedule.component";
import { CourtEditorComponent } from "./court-editor/court-editor.component";
import { VenueSchedulerCalendarComponent } from "./components/venue-scheduler-calendar/venue-scheduler-calendar.component";
import { PackageCreatorModalComponent } from "./components/package-creator-modal/package-creator-modal.component";
import { NewBookingModalComponent } from "./components/new-booking-modal/new-booking-modal.component";
// import { SelectModule } from "ng2-select";
import { VenuePagePackagesComponent } from "./venue-page/venue-page-packages/venue-page-packages.component";
import { PackageItemCardComponent } from "./components/package-item-card/package-item-card.component";
import { VenuePageDetailsComponent } from "./venue-page/venue-page-details/venue-page-details.component";
import { BookingEditModalComponent } from "./components/booking-edit-modal/booking-edit-modal.component";
import { VenuePageScheduleItemComponent } from "./venue-page/venue-page-schedule/venue-page-schedule-item/venue-page-schedule-item.component";
import { VenuePageScheduleAllComponent } from "./venue-page/venue-page-schedule/venue-page-schedule-all/venue-page-schedule-all.component";
import { VenueCreateSuccessScreenModalComponent } from "./components/venue-create-success-screen-modal/venue-create-success-screen-modal.component";
import { VenuePageQuestionnaireComponent } from "@app/client/pages/venues/venue-page/venue-page-questionnaire/venue-page-questionnaire.component";
import { VenuePageAddonsComponent } from "./venue-page/venue-page-addons/venue-page-addons.component";
import { VenuePageReservationsComponent } from "./venue-page/venue-page-reservations/venue-page-reservations.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PopoverModule } from "ngx-bootstrap/popover";

@NgModule({
  providers: [LeaveVenueGuard],
  imports: [
    NgxDatatableModule,
    // SelectModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    SharedPagesModule,
    SharedModule,
    CommonModule,
    StripeCheckoutModule,
    PopoverModule.forRoot(),
  ],
  declarations: [
    VenuesPageComponent,
    VenueCreatorComponent,
    VenueCardComponent,
    VenuePageComponent,
    VenuePageScheduleComponent,
    CourtEditorComponent,
    VenueSchedulerCalendarComponent,
    PackageCreatorModalComponent,
    NewBookingModalComponent,
    VenuePagePackagesComponent,
    PackageItemCardComponent,
    VenuePageDetailsComponent,
    BookingEditModalComponent,
    VenuePageScheduleItemComponent,
    VenuePageScheduleAllComponent,
    VenueCreateSuccessScreenModalComponent,
    VenuePageQuestionnaireComponent,
    VenuePageAddonsComponent,
    VenuePageReservationsComponent,
  ],
})
export class VenuesModule {
  constructor() {}
}
