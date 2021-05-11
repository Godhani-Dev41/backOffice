import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LeaveGuard, SeasonLeaveGuard } from "@app/client/pages/leagues/leave-guard.guard";
import { ContextmenuModule } from "@app/shared/directives/context-menu/contextmenu.module";
import { NzGridModule, NzLayoutModule, NzSpinModule } from "ng-zorro-antd";
import { SharedModule } from "../../../shared.module";
import { SharedPagesModule } from "../../../shared/shared.pages.module";
import { LeaguePageDetailsComponent } from "./league-page/league-page-details/league-page-details.component";
import { LeaguePageSeasonCreatorComponent } from "./league-page/league-page-season-creator/league-page-season-creator.component";
import { LeaguePageSeasonComponent } from "./league-page/league-page-season/league-page-season.component";
import { LeaguePageComponent } from "./league-page/league-page.component";
import { LeaguesViewComponent } from "./leagues-view/leagues-view.component";
import { routes } from "./leagues.routes";
import { ReactiveFormsModule } from "@angular/forms";
import { LeagueCreatorPageComponent } from "./league-creator-page/league-creator-page.component";
import { BsDropdownModule, TooltipModule } from "ngx-bootstrap";
import { PlayoffCreatorComponent } from "./league-page/playoff-creator/playoff-creator.component";
import { PlayoffCreatorFormComponent } from "./league-page/playoff-creator/playoff-creator-form/playoff-creator-form.component";
import { PlayoffTeamsAssignPageComponent } from "./league-page/playoff-teams-assign-page/playoff-teams-assign-page.component";
import { SchedulerGeneratorPageComponent } from "./league-page/scheduler-generator-page/scheduler-generator-page.component";
import { SchedulerGeneratorSettingsComponent } from "./league-page/scheduler-generator-page/scheduler-generator-settings/scheduler-generator-settings.component";
import { SchedulerGeneratorConstraintsComponent } from "./league-page/scheduler-generator-page/scheduler-generator-constraints/scheduler-generator-constraints.component";
import { SchedulerListPageComponent } from "./league-page/scheduler-list-page/scheduler-list-page.component";
import { PopoverModule } from "ngx-bootstrap/popover";

@NgModule({
  providers: [LeaveGuard, SeasonLeaveGuard],
  imports: [
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    SharedPagesModule,
    ContextmenuModule,
    RouterModule.forChild(routes),
    PopoverModule.forRoot(),
    NzLayoutModule,
    NzGridModule,
    NzSpinModule,
  ],
  declarations: [
    LeaguesViewComponent,
    LeaguePageComponent,
    LeaguePageDetailsComponent,
    LeaguePageSeasonComponent,
    LeaguePageSeasonCreatorComponent,
    LeagueCreatorPageComponent,
    PlayoffCreatorComponent,
    PlayoffCreatorFormComponent,
    PlayoffTeamsAssignPageComponent,
    SchedulerGeneratorPageComponent,
    SchedulerGeneratorSettingsComponent,
    SchedulerGeneratorConstraintsComponent,
    SchedulerListPageComponent,
  ],
})
export class LeaguesModule {
  constructor() {}
}
