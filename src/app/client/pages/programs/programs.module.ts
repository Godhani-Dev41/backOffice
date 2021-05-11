import { ProgramSeasonEventsComponent } from "./program-season-events/program-season-events.component";
import { CommonModule } from "@angular/common";
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LeaveGuard, SeasonLeaveGuard } from "@app/client/pages/leagues/leave-guard.guard";
import { ContextmenuModule } from "@app/shared/directives/context-menu/contextmenu.module";
import { ProgramViewComponent } from "./program-view/program-view.component";
import { routes } from "./programs.routes";
import { ReactiveFormsModule } from "@angular/forms";
import { ProgramCreatorPageComponent } from "./program-creator-page/program-creator-page.component";
import { BsDropdownModule, TooltipModule } from "ngx-bootstrap";
import { PopoverModule } from "ngx-bootstrap/popover";
import { SharedPagesModule } from "@app/shared/shared.pages.module";
import { ProgramCreatorHighlights } from "@app/shared/components/programs/program-creator-highlights/program-creator-highlights.component";
import { DragulaModule } from "ng2-dragula";
import { SharedModule } from "@app/shared.module";
import { ProgramSeasonPageComponent } from "./program-season-page/program-season-page.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ProgramSeasonSchedulePageComponent } from "./program-season-schedule-page/program-season-schedule-page.component";
import { ProgramSeasonPricingPageComponent } from "./program-season-pricing-page/program-season-pricing-page.component";
import { ProgramDashboardPageComponent } from "./program-dashboard-page/program-dashboard-page.component";
import { ProgramSeasonDashboardPageComponent } from "./program-season-dashboard-page/program-season-dashboard-page.component";
import { ProgramParticipantListComponent } from "./program-participant-list/program-participant-list.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ClientModule } from "@app/client";
import { ProgramSeasonAddonsPageComponent } from "./program-season-addons-page/program-season-addons-page.component";
import { ProgramSeasonSpacesPageComponent } from "./program-season-spaces-page/program-season-spaces-page.component";
import { ProgramSeasonDashboardComponent } from "./program-season-dashboard/program-season-dashboard.component";
import { ProgramSeasonGroupsComponent } from "./program-season-groups/program-season-groups.component";
import { ProgramSeasonGroupsFreeagentsComponent } from "./program-season-groups/program-season-groups-freeagents/program-season-groups-freeagents.component";

@NgModule({
  providers: [LeaveGuard, SeasonLeaveGuard],
  imports: [
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ContextmenuModule,
    RouterModule.forChild(routes),
    PopoverModule.forRoot(),
    SharedPagesModule,
    DragulaModule,
    NgZorroAntdModule,
    NgxDatatableModule,
    ClientModule,
  ],
  declarations: [
    ProgramCreatorPageComponent,
    ProgramViewComponent,
    ProgramCreatorHighlights,
    ProgramSeasonPageComponent,
    ProgramSeasonSchedulePageComponent,
    ProgramSeasonPricingPageComponent,
    ProgramDashboardPageComponent,
    ProgramSeasonDashboardPageComponent,
    ProgramParticipantListComponent,
    ProgramSeasonAddonsPageComponent,
    ProgramSeasonSpacesPageComponent,
    ProgramSeasonDashboardComponent,
    ProgramSeasonGroupsComponent,
    ProgramSeasonGroupsFreeagentsComponent,
    ProgramSeasonEventsComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class ProgramsModule {
  constructor() {}
}
