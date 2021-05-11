// tslint:disable-next-line:max-line-length
import { TournamentsViewComponent } from './tournaments-view/tournaments-view.component';
import { TournamentEventEditComponent } from './tournament-event-edit/tournament-event-edit.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { TournamentPageComponent } from './tournament-page/tournament-page.component';
import {
  TournamentPageDetailsComponent
} from './tournament-page/tournament-page-details/tournament-page-details.component';
import {
  TournamentItemPageComponent
} from './tournament-page/tournament-item-page/tournament-item-page.component';
import { LeaveGuard } from '@app/client/pages/leagues/leave-guard.guard';
import {
  SeasonDashboardComponent
} from '@app/client/pages/leagues/league-page/league-page-season/season-dashboard/season-dashboard.component';
import {
  SeasonTeamsPageComponent
} from '@app/client/pages/leagues/league-page/league-page-season/season-teams-page/season-teams-page.component';
import {
  TournamentBracketsPageComponent
} from '@app/client/pages/tournaments/tournament-page/tournament-item-page/tournament-brackets-page/tournament-brackets-page.component';
import {
  TournamentScheduleGenerateComponent
// tslint:disable-next-line:max-line-length
} from '@app/client/pages/tournaments/tournament-page/tournament-item-page/tournament-schedule-generate/tournament-schedule-generate.component';
import { SeasonMatchesPageComponent } from '@app/client/pages/leagues/league-page/league-page-season/season-matches-page/season-matches-page.component';

export const routes = [
  { path: '', children: [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: TournamentsViewComponent },
    { path: 'edit', component: TournamentEditComponent },
    { path: 'view/:tournamentId', component: TournamentPageComponent, canDeactivate: [LeaveGuard], children: [
      { path: 'item-edit', component: TournamentEventEditComponent },
      { path: 'item-edit/:tournamentEventId', component: TournamentEventEditComponent },
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: TournamentPageDetailsComponent },
      { path: 'item/:itemId', component: TournamentItemPageComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: SeasonDashboardComponent },
        { path: 'teams', component: SeasonTeamsPageComponent },
        { path: 'matches', component: SeasonMatchesPageComponent },
        { path: 'brackets', component: TournamentBracketsPageComponent },
        { path: 'generate-schedule', component: TournamentScheduleGenerateComponent }
      ]},
    ]}
  ]},
];
