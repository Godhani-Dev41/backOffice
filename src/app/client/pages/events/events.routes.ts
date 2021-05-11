// tslint:disable-next-line:max-line-length

import { EventsViewComponent } from './events-view/events-view.component';
import { EventCreatorComponent } from './event-creator/event-creator.component';
import { EventInviterPageComponent } from './event-inviter-page/event-inviter-page.component';

export const routes = [
  { path: '', children: [
    { path: '', redirectTo: 'view', pathMatch: 'full' },
    { path: 'view', component: EventsViewComponent },
    { path: 'view/:eventId/invite', component: EventInviterPageComponent },
    { path: 'event-creator', component: EventCreatorComponent },
    { path: 'event-creator/:eventId', component: EventCreatorComponent },
    { path: 'event-creator/:eventId/:isBasicEdit', component: EventCreatorComponent },
  ]}
];
