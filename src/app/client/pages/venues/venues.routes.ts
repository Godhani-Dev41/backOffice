import { CourtEditorComponent } from '@app/client/pages/venues/court-editor/court-editor.component';
import { LeaveVenueGuard } from '@app/client/pages/venues/leave.guard';
import { VenueCreatorComponent } from '@app/client/pages/venues/venue-creator/venue-creator.component';
import { VenuePageDetailsComponent } from '@app/client/pages/venues/venue-page/venue-page-details/venue-page-details.component';
import {
  VenuePageScheduleAllComponent
} from '@app/client/pages/venues/venue-page/venue-page-schedule/venue-page-schedule-all/venue-page-schedule-all.component';
import {
  VenuePageScheduleItemComponent
} from '@app/client/pages/venues/venue-page/venue-page-schedule/venue-page-schedule-item/venue-page-schedule-item.component';
import { VenuePageScheduleComponent } from '@app/client/pages/venues/venue-page/venue-page-schedule/venue-page-schedule.component';
import { VenuePagePackagesComponent } from '@app/client/pages/venues/venue-page/venue-page-packages/venue-page-packages.component';
import { VenuePageComponent } from '@app/client/pages/venues/venue-page/venue-page.component';
import { VenuesPageComponent } from '@app/client/pages/venues/venues-page/venues-page.component';
import {
  VenuePageQuestionnaireComponent
} from '@app/client/pages/venues/venue-page/venue-page-questionnaire/venue-page-questionnaire.component';
import { VenuePageAddonsComponent } from '@app/client/pages/venues/venue-page/venue-page-addons/venue-page-addons.component';
import {
  VenuePageReservationsComponent
} from '@app/client/pages/venues/venue-page/venue-page-reservations/venue-page-reservations.component';

export const routes = [
  {
    path: '', children: [
      { path: '', component: VenuesPageComponent },
      { path: 'venue-creator', component: VenueCreatorComponent },
      { path: 'venue-creator/:venueId', component: VenueCreatorComponent },
      { path: 'venue-creator/:venueId/court', component: CourtEditorComponent },
      { path: 'venue-creator/:venueId/court/:courtId', component: CourtEditorComponent },
      { path: 'venue-creator/:venueId/court/:courtId/:isCopy', component: CourtEditorComponent },

      {
        path: 'venue/:venueId', component: VenuePageComponent, canDeactivate: [LeaveVenueGuard], children: [
          { path: '', redirectTo: 'schedule/all', pathMatch: 'full' },
          { path: 'details', component: VenuePageDetailsComponent },
          { path: 'questionnaire', component: VenuePageQuestionnaireComponent },
          { path: 'addons', component: VenuePageAddonsComponent },
          { path: 'reservations', component: VenuePageReservationsComponent },
          {
            path: 'schedule', component: VenuePageScheduleComponent, children: [
              { path: 'all', component: VenuePageScheduleAllComponent },
              { path: 'space/:spaceId', component: VenuePageScheduleItemComponent }
            ]
          },
          // { path: 'schedule', component: VenuePageScheduleComponent },
          { path: 'packages', component: VenuePagePackagesComponent }
        ]
      },
    ]
  },
];
