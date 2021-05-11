import { AdminAuthService } from "@app/shared/services/auth/admin-auth.service";
import { CustomersService } from "@app/shared/services/customers/customers.service";
import { OrdersService } from "@app/shared/services/orders/orders.service.ts";
import { TeamsService } from "@app/shared/services/teams/teams.service";
import { FileUploaderService } from "@app/shared/services/utils/file-uploader.service";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { InvitationService } from "@app/shared/services/utils/invitation.service";
import { LocationService } from "@app/shared/services/utils/location.service";
import { AuthenticationService } from "./auth/authentication.service";
import { LeaguesService } from "./leagues/leagues.service";
import { OrganizationsService } from "./organization/organizations.service";
import { RCServerErrorCodes } from "./rc.server.errors";
import { EventsService } from "@app/shared/services/events/events.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { TinymceService } from "@app/shared/services/tinymce/tinymce.service";
import { FeedService } from "@app/shared/services/feed/feed.service";
import { PortalService } from "@app/shared/services/portal/portal.service";
import { PaymentsService } from "@app/shared/services/payments/payments.service";
import { TournamentService } from "@app/shared/services/tournament/tournament.service";
import { TimeService } from "@app/shared/services/utils/time.service";
import { AnalyticsService } from "@app/shared/services/utils/analytics.service";
import { LeaguesFormService } from "@app/shared/services/leagues/leagues-form.service";
import { SeasonSchedulerService } from "@app/shared/services/leagues/season-scheduler.service";
import { QuestionsFormService } from "@app/shared/services/organization/quastionnaire.service";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { ProgramsService } from "@app/shared/services/programs/programs.service";

export interface RCServiceResourceQuery {
  limit?: number;
  sort?: string;
  skip?: number;
  sports?: number[];
  cflag?: boolean;
  lat?: number;
  lon?: number;
  distance?: number;
}

export interface RCServerResponse<T> {
  data: T;
}

export interface RCServerErrorResponse {
  code: RCServerErrorCodes;
  error: string;
}

export type RCEntities = "event" | "team" | "league" | "venue" | "feed" | "user" | "organization";

export const APP_PROVIDERS = [
  OrdersService,
  CustomersService,
  AdminAuthService,
  AuthenticationService,
  OrganizationsService,
  LeaguesService,
  InvitationService,
  LocationService,
  TeamsService,
  ImagesService,
  EventsService,
  VenuesService,
  TinymceService,
  FeedService,
  PortalService,
  PaymentsService,
  TournamentService,
  TimeService,
  AnalyticsService,
  LeaguesFormService,
  ProgramsService,
  ProgramsFormService,
  SeasonSchedulerService,
  QuestionsFormService,
  FileUploaderService,
  SportsService,
];
