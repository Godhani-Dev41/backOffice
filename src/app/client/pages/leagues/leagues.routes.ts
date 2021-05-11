// tslint:disable-next-line:max-line-length
import { LeaguePageSeasonCreatorComponent } from './league-page/league-page-season-creator/league-page-season-creator.component';
import { LeaveGuard, SeasonLeaveGuard } from '@app/client/pages/leagues/leave-guard.guard';
import { LeaguePageDetailsComponent } from './league-page/league-page-details/league-page-details.component';
import { LeaguePageSeasonComponent } from './league-page/league-page-season/league-page-season.component';
import { SeasonDashboardComponent } from './league-page/league-page-season/season-dashboard/season-dashboard.component';
import { SeasonTeamsPageComponent } from './league-page/league-page-season/season-teams-page/season-teams-page.component';
import { LeaguePageComponent } from './league-page/league-page.component';
import { LeaguesViewComponent } from './leagues-view/leagues-view.component';
import { LeagueCreatorPageComponent } from './league-creator-page/league-creator-page.component';
import { SeasonMatchesPageComponent } from './league-page/league-page-season/season-matches-page/season-matches-page.component';
import { PlayoffCreatorComponent } from './league-page/playoff-creator/playoff-creator.component';
import { PlayoffTeamsAssignPageComponent } from './league-page/playoff-teams-assign-page/playoff-teams-assign-page.component';
import { SchedulerGeneratorPageComponent } from './league-page/scheduler-generator-page/scheduler-generator-page.component';
import { SchedulerListPageComponent } from './league-page/scheduler-list-page/scheduler-list-page.component';
import { SeasonReportsPageComponent } from './league-page/league-page-season/season-reports-page/season-reports-page.component';

export const routes = [
  { path: '', children: [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: LeaguesViewComponent },
    { path: 'league-creator', component: LeagueCreatorPageComponent },
    { path: 'league-creator/:leagueId', component: LeagueCreatorPageComponent },
    { path: 'view/:id', component: LeaguePageComponent, canDeactivate: [LeaveGuard], children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: LeaguePageDetailsComponent },
      { path: 'playoff-creator', component: PlayoffCreatorComponent },
      { path: 'playoff-team-assign/:seasonId', component: PlayoffTeamsAssignPageComponent },
      { path: 'schedule-creator/:seasonId', component: SchedulerGeneratorPageComponent },
      { path: 'schedule-list/:seasonId', component: SchedulerListPageComponent },
      { path: 'season-creator', component: LeaguePageSeasonCreatorComponent },
      { path: 'season-creator/:seasonId', component: LeaguePageSeasonCreatorComponent },
      { path: 'season/:seasonId', component: LeaguePageSeasonComponent, canDeactivate: [SeasonLeaveGuard], children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: SeasonDashboardComponent },
        { path: 'teams', component: SeasonTeamsPageComponent },
        { path: 'matches', component: SeasonMatchesPageComponent },
        { path: 'reports', component: SeasonReportsPageComponent }

      ]},
    ]},
  ]},
];
