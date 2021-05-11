import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentsViewComponent } from './tournaments-view/tournaments-view.component';
import { RouterModule } from '@angular/router';
import { routes } from '@app/client/pages/tournaments/tournaments.routes';
import { TournamentEventEditComponent } from './tournament-event-edit/tournament-event-edit.component';
import { TournamentEditComponent } from './tournament-edit/tournament-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';
import { SharedPagesModule } from '@app/shared/shared.pages.module';
import { TournamentPageComponent } from './tournament-page/tournament-page.component';
import { TournamentPageDetailsComponent } from './tournament-page/tournament-page-details/tournament-page-details.component';
import { TournamentItemPageComponent } from './tournament-page/tournament-item-page/tournament-item-page.component';
import { SharedModule } from '@app/shared.module';
import {
  TournamentBracketsPageComponent
} from './tournament-page/tournament-item-page/tournament-brackets-page/tournament-brackets-page.component';
import {
  TournamentScheduleGenerateComponent
} from './tournament-page/tournament-item-page/tournament-schedule-generate/tournament-schedule-generate.component';
import { LeaveGuard } from '@app/client/pages/leagues/leave-guard.guard';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  providers: [LeaveGuard],
  imports: [
    TooltipModule.forRoot(),
    ReactiveFormsModule,
    DragulaModule,
    SharedPagesModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TournamentsViewComponent,
    TournamentEventEditComponent,
    TournamentEditComponent,
    TournamentPageComponent,
    TournamentPageDetailsComponent,
    TournamentItemPageComponent,
    TournamentBracketsPageComponent,
    TournamentScheduleGenerateComponent
  ]
})
export class TournamentsModule { }
