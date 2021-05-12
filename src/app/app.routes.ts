import { Routes } from '@angular/router';
import { AdminGuard } from '@app/shared/guards/admin-guard.guard';
import { AdminLoginPageComponent } from '@app/shared/pages/admin-login-page/admin-login-page.component';
import { MatchReportGeneratorComponent } from '@app/shared/pages/match-report-generator/match-report-generator.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoginPageComponent } from './shared/pages/login-page/login-page.component';
import { StandingsGeneratorComponent } from './shared/pages/standings-generator/standings-generator.component';
import {
  MatchResultsGeneratorComponent
} from './shared/pages/round-results-generator/match-results-generator.component';
import {
  EventMatchResultsGeneratorComponent
} from './shared/pages/event-match-results-generator/event-match-results-generator.component';
import {
  TeamLookingForPlayersGeneratorComponent
} from '@app/shared/pages/feed-generators/team-looking-for-players-generator/team-looking-for-players-generator.component';
import {
  PlayerLookingForTeamComponent
} from '@app/shared/pages/feed-generators/player-looking-for-team/player-looking-for-team.component';
import {
  TeamLookingForMatchGeneratorComponent
} from '@app/shared/pages/feed-generators/team-looking-for-match-generator/team-looking-for-match-generator.component';
import { LevelUpShareGeneratorComponent } from '@app/shared/pages/level-up-share-generator/level-up-share-generator.component';
import { ScoreBoardShareGeneratorComponent } from '@app/shared/pages/score-board-share-generator/score-board-share-generator.component';
import { ImageGeneratorComponent } from '@app/shared/pages/image-generator/image-generator.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'client', loadChildren: () => import('./client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [AdminGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'standings-generator-route', component: StandingsGeneratorComponent },
  { path: 'match-results-generator-route', component: MatchResultsGeneratorComponent },
  { path: 'event-match-results-generator-route', component: EventMatchResultsGeneratorComponent },
  { path: 'level-up-share-generator', component: LevelUpShareGeneratorComponent },
  { path: 'score-board-share-generator', component: ScoreBoardShareGeneratorComponent },
  { path: 'team-looking-for-players-generator', component: TeamLookingForPlayersGeneratorComponent },
  { path: 'player-looking-for-team-generator', component: PlayerLookingForTeamComponent },
  { path: 'team-looking-for-match-generator', component: TeamLookingForMatchGeneratorComponent },
  { path: 'image-generator', component: ImageGeneratorComponent },
  { path: 'match-report-generator', component: MatchReportGeneratorComponent },
  { path: 'a-login', component: AdminLoginPageComponent }
];
