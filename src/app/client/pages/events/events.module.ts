import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { routes } from "@app/client/pages/events/events.routes";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared.module";
import { SharedPagesModule } from "@app/shared/shared.pages.module";
import { ContextmenuModule } from "@app/shared/directives/context-menu/contextmenu.module";
import { EventCreatorComponent } from "./event-creator/event-creator.component";
import { EventInviterPageComponent } from "./event-inviter-page/event-inviter-page.component";
// import { SelectModule } from "ng2-select";

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    NgxDatatableModule,
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    SharedPagesModule,
    ContextmenuModule,
    RouterModule.forChild(routes),
    // SelectModule,
  ],
  declarations: [EventCreatorComponent, EventInviterPageComponent],
})
export class EventsModule {}
