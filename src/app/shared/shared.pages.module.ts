import { DiscountV2Component } from "./components/discount-v2/discount-v2";
import { EventsViewComponent } from "./../client/pages/events/events-view/events-view.component";
import { AgePipe } from "./pipes/age.pipe";
/* tslint:disable:max-line-length */
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ScheduleXlsUploadModalComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-matches-page/schedule-xls-upload-modal/schedule-xls-upload-modal.component";
import { RosterXlsUploadModalComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-teams-page/roster-xls-upload-modal/roster-xls-upload-modal.component";
import { CalendarComponent } from "@app/shared/components/fullcalendar/calendar";
import { ContextmenuModule } from "@app/shared/directives/context-menu/contextmenu.module";
import { OwlCarouselModule } from "@app/shared/vendor/owl-carousel/owl-carousel.module";
import { AgmCoreModule } from "@agm/core";
import { DatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { FileUploadModule } from "ng2-file-upload";
import { environment } from "../../environments/environment";
import { SharedModule } from "../shared.module";
import { BackBtnComponent } from "./components/back-btn/back-btn.component";
import { DatepickerComponent } from "./components/datepicker/datepicker.component";
import { EntityRoundImageComponent } from "./components/entity-round-image/entity-round-image.component";
import { LeagueBoxComponent } from "./components/leagues/league-box/league-box.component";
import { LeagueDateGamesComponent } from "./components/leagues/league-date-games/league-date-games.component";
import { LeagueDetailStatsComponent } from "./components/leagues/league-detail-stats/league-detail-stats.component";
import { LeagueDetailsComponent } from "./components/leagues/league-details/league-details.component";
import { LeagueFiltersComponent } from "./components/leagues/league-filters/league-filters.component";
import { LeagueSeasonsComponent } from "./components/leagues/league-seasons/league-seasons.component";
import { LeagueTeamsSliderComponent } from "./components/leagues/league-teams-slider/league-teams-slider.component";
import { LeaguesViewerComponent } from "./components/leagues/leagues-viewer/leagues-viewer.component";
import { MatchEditModalComponent } from "./components/leagues/match-edit-modal/match-edit-modal.component";
import { SeasonCreatorBasicComponent } from "./components/leagues/season-creator/season-creator-basic/season-creator-basic.component";
import { SeasonCreatorScheduleComponent } from "./components/leagues/season-creator/season-creator-schedule/season-creator-schedule.component";
import { SeasonRoundMatchesSliderComponent } from "./components/leagues/season-round-matches-slider/season-round-matches-slider.component";
import { SeasonRowComponent } from "./components/leagues/season-row/season-row.component";
import { SeasonScheduleTimelineComponent } from "./components/leagues/season-schedule-timeline/season-schedule-timeline.component";
import { TeamEditModalComponent } from "./components/leagues/team-edit-modal/team-edit-modal.component";
import { TeamMemberTransferModalComponent } from "./components/leagues/team-member-transfer-modal/team-member-transfer-modal.component";
import { TeamPlayerInviteModalComponent } from "./components/leagues/team-player-invite-modal/team-player-invite-modal.component";
import { LoadingBtnComponent } from "./components/loading-btn/loading-btn.component";
import { LocationSearchInputComponent } from "./components/location-search-input/location-search-input.component";
import { PlayerCardComponent } from "./components/player-card/player-card.component";
import { TimepickerComponent } from "./components/timepicker/timepicker.component";
import { FileUploaderDirective } from "./directives/file-uploader/file-uploader.directive";
import { ImageUploadPreviewDirective } from "./directives/image-upload-preview/image-upload-preview.directive";
import { AdminLoginPageComponent } from "./pages/admin-login-page/admin-login-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { MediaUrlPipe } from "./pipes/media-url.pipe";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { RoundEditModalComponent } from "./components/leagues/round-edit-modal/round-edit-modal.component";
import { MatchResultsModalComponent } from "./components/leagues/match-results-modal/match-results-modal.component";
import { SeasonRegistrationFormWidgetComponent } from "./components/leagues/season-creator/season-creator-schedule/season-registration-form-widget/season-registration-form-widget.component";
import { VenueSearchInputComponent } from "./components/venue-search-input/venue-search-input.component";
import { SeasonPostModalComponent } from "./components/leagues/season-post-modal/season-post-modal.component";
import { RoundResultsWidgetComponent } from "./components/leagues/round-results-widget/round-results-widget.component";
import { TeamLogoAvatarComponent } from "./components/team-logo-avatar/team-logo-avatar.component";
import { StandingsTableSmallComponent } from "./components/leagues/standings-table-small/standings-table-small.component";
import { SeasonStandingsWidgetComponent } from "./components/leagues/season-standings-widget/season-standings-widget.component";
import { MatchResultWidgetComponent } from "./components/leagues/match-result-widget/match-result-widget.component";
import { ImageUploaderComponent } from "./components/image-uploader/image-uploader.component";
import { ColorPickerModule } from "ngx-color-picker";
import { QuickSportPickerComponent } from "./components/sport-picker/quick-sport-picker/quick-sport-picker.component";
import { SportPickerModalComponent } from "./components/sport-picker/sport-picker-modal/sport-picker-modal.component";
import { StandingsGeneratorComponent } from "./pages/standings-generator/standings-generator.component";
import { MatchResultsGeneratorComponent } from "./pages/round-results-generator/match-results-generator.component";
import { EventMatchResultsGeneratorComponent } from "@app/shared/pages/event-match-results-generator/event-match-results-generator.component";
import { SeasonInvitedTableComponent } from "./components/leagues/season-invited-table/season-invited-table.component";
import { PoolTeamCardComponent } from "./components/leagues/pool-team-card/pool-team-card.component";
import { SeasonCreatorTimingComponent } from "./components/leagues/season-creator/season-creator-timing/season-creator-timing.component";
import { SeasonCreatorFormActivityRowComponent } from "./components/leagues/season-creator/season-creator-timing/season-creator-form-activity-row/season-creator-form-activity-row.component";
import { TeamLookingForPlayersGeneratorComponent } from "./pages/feed-generators/team-looking-for-players-generator/team-looking-for-players-generator.component";
import { PlayerLookingForTeamComponent } from "./pages/feed-generators/player-looking-for-team/player-looking-for-team.component";
import { TeamLookingForMatchGeneratorComponent } from "./pages/feed-generators/team-looking-for-match-generator/team-looking-for-match-generator.component";
import { TournamentEditPageComponent } from "./components/tournament/tournament-editor/tournament-edit-page/tournament-edit-page.component";
import { GenderPickerComponent } from "./components/gender-picker/gender-picker.component";
import { LevelOfPlaySelectorComponent } from "./components/level-of-play-selector/level-of-play-selector.component";
import { IonRangeSliderModule } from "./vendor/ion-2-range/ion-range-slider.module";
import { RangeAgePickerComponent } from "./components/range-age-picker/range-age-picker.component";
import { RangePickerComponent } from "./components/range-picker/range-picker.component";
import { TournamentEventEditPageComponent } from "./components/tournament/tournament-editor/tournament-event-edit-page/tournament-event-edit-page.component";
import { ActionSuccessModalComponent } from "./components/action-success-modal/action-success-modal.component";
import { ActivityTimeBoxWidgetComponent } from "./components/activity-time-box-widget/activity-time-box-widget.component";
import { SeasonDashboardComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-dashboard/season-dashboard.component";
import { SeasonTeamsPageComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-teams-page/season-teams-page.component";
import { DragulaModule } from "ng2-dragula";
import { TournamentBracketsComponent } from "./components/tournament/tournament-brackets/tournament-brackets.component";
import { TournamentScheduleGeneratorComponent } from "./components/tournament/tournament-editor/tournament-schedule-generator/tournament-schedule-generator.component";
import { MomentDatePipe } from "./pipes/moment-date.pipe";
import { LeagueCreatorBasicComponent } from "./components/leagues/league-creator/league-creator-basic/league-creator-basic.component";
import { LeagueCreatorDescriptionComponent } from "./components/leagues/league-creator/league-creator-description/league-creator-description.component";
import { LeagueCreatorFormatComponent } from "./components/leagues/league-creator/league-creator-format/league-creator-format.component";
import { ConfirmationModalComponent } from "./components/confirmation-modal/confirmation-modal.component";
import { BulkChangeTimeModalComponent } from "./components/time-select-modal/time-select-modal.component";
import { VenueSelectModalComponent } from "./components/venue-select-modal/venue-select-modal.component";
import { ParticipantsModalComponent } from "./components/event-participants-modal/event-participants-modal.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TeamsConstraintsModalComponent } from "./components/teams/teams-constraints-modal/teams-constraints-modal.component";
import { BreadcrumbsComponent } from "./components/breadcrumbs/breadcrumbs.component";
import { CreateDivisionModalComponent } from "./components/create-division-modal/create-division-modal.component";
import { PresetColorPickerComponent } from "./components/preset-color-picker/preset-color-picker.component";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PlayerSeasonInfoModalComponent } from "./components/leagues/player-season-info-modal/player-season-info-modal.component";
import { SqDatetimepickerModule } from "ngx-eonasdan-datetimepicker";
import { SeasonMatchesPageComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-matches-page/season-matches-page.component";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { LevelUpShareGeneratorComponent } from "./pages/level-up-share-generator/level-up-share-generator.component";
import { ScoreBoardShareGeneratorComponent } from "./pages/score-board-share-generator/score-board-share-generator.component";
import { SchedularCalendarViewComponent } from "@app/client/pages/leagues/league-page/scheduler-list-page/schedular-calendar-view/schedular-calendar-view.component";
import { ScheduleStatisticsSidebarComponent } from "@app/shared/components/schedule-statistics-sidebar/schedule-statistics-sidebar.component";
import { ImageGeneratorComponent } from "./pages/image-generator/image-generator.component";
import { EventBetPlacedGeneratorComponent } from "./pages/image-generator/event-bet-placed-generator/event-bet-placed-generator.component";
import { BetWinnerGeneratorComponent } from "./pages/image-generator/bet-winner-generator/bet-winner-generator.component";
import { TournamentBetPlacedGeneratorComponent } from "./pages/image-generator/tournament-bet-placed-generator/tournament-bet-placed-generator.component";
import { TopScorerModalPostComponent } from "./components/leagues/top-scorer-modal-post/top-scorer-modal-post.component";
import { TopScorerGeneratorComponent } from "./pages/image-generator/top-scorer-generator/top-scorer-generator.component";
import { MatchReportGeneratorComponent } from "./pages/match-report-generator/match-report-generator.component";
import { OrgQuestionsEditFormComponent } from "@app/client/pages/organization-settings/settings-pages/org-questions-edit-page/org-questions-edit-form/org-questions-edit-form.component";
import { DailyAgendaComponent } from "@app/shared/components/daily-agenda/daily-agenda.component";
import { DateRangeDropdownComponent } from "./components/date-range-dropdown/date-range-dropdown.component";
import { NumberInputAndSwitchComponent } from "./components/number-input-and-switch/number-input-and-switch.component";
import { WeekDaysHoursSelectComponent } from "./components/week-days-hours-select/week-days-hours-select.component";
import { ScheduleConstraintsComponent } from "./components/schedule-constraints/schedule-constraints.component";
import { SeasonSegmentsComponent } from "./components/season-segments/season-segments.component";
import { PriceInputRowComponent } from "./components/price-input-row/price-input-row.component";
import { MembershipPricesComponent } from "./components/membership-prices/membership-prices.component";
import { ProgramPackagesComponent } from "./components/program-packages/program-packages.component";
import { ProgramBasicInfoComponent } from "./components/program-basic-info/program-basic-info.component";
import { DashboardHighlightsComponent } from "./components/dashboard-highlights/dashboard-highlights.component";
import { AddOnsManagementComponent } from "./components/add-ons-management/add-ons-management.component";
import { SpaceAllocationManagementComponent } from "./components/space-allocation-management/space-allocation-management.component";
import { SeasonReportsPageComponent } from "@app/client/pages/leagues/league-page/league-page-season/season-reports-page/season-reports-page.component";
import { DangerousEditWarningComponent } from "./components/dangerous-edit-warning/dangerous-edit-warning.component";
import { GetPaymentV2Component } from "./components/get-payment-v2/get-payment-v2";
import { RichTextWrapperComponent } from "./components/rich-text-wrapper/rich-text-wrapper.component";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzGridModule } from "ng-zorro-antd/grid";
import { NzCardModule } from "ng-zorro-antd/card";
import { NzAvatarModule } from "ng-zorro-antd/avatar";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzTypographyModule } from "ng-zorro-antd/typography";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";

@NgModule({
  imports: [
    NgxDatatableModule,
    SqDatetimepickerModule,
    IonRangeSliderModule,
    ColorPickerModule,
    FileUploadModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY,
      libraries: ["places"],
    }),
    SharedModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    DatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    OwlCarouselModule,
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ContextmenuModule,
    DragulaModule,
    NzLayoutModule,
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzInputNumberModule,
    NzTypographyModule,
    NzIconModule,
    NzDatePickerModule
  ],
  providers: [MediaUrlPipe],
  declarations: [
    ScheduleStatisticsSidebarComponent,
    CalendarComponent,
    SchedularCalendarViewComponent,
    LoginPageComponent,
    LeaguesViewerComponent,
    LeagueBoxComponent,
    LeagueFiltersComponent,
    BackBtnComponent,
    LeagueDetailsComponent,
    EntityRoundImageComponent,
    LeagueSeasonsComponent,
    SeasonRowComponent,
    PlayerCardComponent,
    LeagueDetailStatsComponent,
    LeagueDateGamesComponent,
    SeasonScheduleTimelineComponent,
    LeagueTeamsSliderComponent,
    MediaUrlPipe,
    AgePipe,
    SeasonRoundMatchesSliderComponent,
    TruncatePipe,
    MomentDatePipe,
    SeasonCreatorBasicComponent,
    SeasonCreatorScheduleComponent,
    DatepickerComponent,
    MatchEditModalComponent,
    TimepickerComponent,
    LocationSearchInputComponent,
    TeamPlayerInviteModalComponent,
    LoadingBtnComponent,
    TeamEditModalComponent,
    ImageUploadPreviewDirective,
    FileUploaderDirective,
    TeamMemberTransferModalComponent,
    AdminLoginPageComponent,
    RoundEditModalComponent,
    MatchResultsModalComponent,
    SeasonRegistrationFormWidgetComponent,
    VenueSearchInputComponent,
    SeasonPostModalComponent,
    RoundResultsWidgetComponent,
    TeamLogoAvatarComponent,
    StandingsTableSmallComponent,
    SeasonStandingsWidgetComponent,
    MatchResultWidgetComponent,
    ImageUploaderComponent,
    QuickSportPickerComponent,
    SportPickerModalComponent,
    StandingsGeneratorComponent,
    MatchResultsGeneratorComponent,
    EventMatchResultsGeneratorComponent,
    SeasonInvitedTableComponent,
    PoolTeamCardComponent,
    SeasonCreatorTimingComponent,
    SeasonCreatorFormActivityRowComponent,
    TeamLookingForPlayersGeneratorComponent,
    PlayerLookingForTeamComponent,
    TeamLookingForMatchGeneratorComponent,
    TournamentEditPageComponent,
    GenderPickerComponent,
    LevelOfPlaySelectorComponent,
    RangePickerComponent,
    RangeAgePickerComponent,
    TournamentEventEditPageComponent,
    ActionSuccessModalComponent,
    ActivityTimeBoxWidgetComponent,
    SeasonDashboardComponent,
    SeasonMatchesPageComponent,
    SeasonTeamsPageComponent,
    TournamentBracketsComponent,
    TournamentScheduleGeneratorComponent,
    MomentDatePipe,
    LeagueCreatorBasicComponent,
    LeagueCreatorDescriptionComponent,
    LeagueCreatorFormatComponent,
    ConfirmationModalComponent,
    BulkChangeTimeModalComponent,
    VenueSelectModalComponent,
    ParticipantsModalComponent,
    TeamsConstraintsModalComponent,
    BreadcrumbsComponent,
    CreateDivisionModalComponent,
    PresetColorPickerComponent,
    PlayerSeasonInfoModalComponent,
    LevelUpShareGeneratorComponent,
    ScoreBoardShareGeneratorComponent,
    ImageGeneratorComponent,
    EventBetPlacedGeneratorComponent,
    BetWinnerGeneratorComponent,
    TournamentBetPlacedGeneratorComponent,
    TopScorerModalPostComponent,
    TopScorerGeneratorComponent,
    MatchReportGeneratorComponent,
    RosterXlsUploadModalComponent,
    ScheduleXlsUploadModalComponent,
    OrgQuestionsEditFormComponent,
    DailyAgendaComponent,
    DateRangeDropdownComponent,
    NumberInputAndSwitchComponent,
    WeekDaysHoursSelectComponent,
    ScheduleConstraintsComponent,
    SeasonSegmentsComponent,
    PriceInputRowComponent,
    MembershipPricesComponent,
    ProgramPackagesComponent,
    ProgramBasicInfoComponent,
    DashboardHighlightsComponent,
    EventsViewComponent,
    AddOnsManagementComponent,
    SpaceAllocationManagementComponent,
    SeasonReportsPageComponent,
    DangerousEditWarningComponent,

    // react components
    GetPaymentV2Component,
    DiscountV2Component,
    RichTextWrapperComponent,
  ],
  exports: [
    ScheduleXlsUploadModalComponent,
    CalendarComponent,
    ScheduleStatisticsSidebarComponent,
    SchedularCalendarViewComponent,
    MediaUrlPipe,
    AgePipe,
    TruncatePipe,
    MomentDatePipe,
    LeaguesViewerComponent,
    BackBtnComponent,
    LeagueDetailsComponent,
    EntityRoundImageComponent,
    LeagueSeasonsComponent,
    SeasonRowComponent,
    PlayerCardComponent,
    LeagueDetailStatsComponent,
    LeagueDateGamesComponent,
    SeasonScheduleTimelineComponent,
    OwlCarouselModule,
    LeagueTeamsSliderComponent,
    SeasonRoundMatchesSliderComponent,
    SeasonCreatorBasicComponent,
    SeasonCreatorScheduleComponent,
    DatepickerComponent,
    MatchEditModalComponent,
    TimepickerComponent,
    TeamPlayerInviteModalComponent,
    LoadingBtnComponent,
    TeamEditModalComponent,
    TeamMemberTransferModalComponent,
    RoundEditModalComponent,
    MatchResultsModalComponent,
    SeasonPostModalComponent,
    TeamLogoAvatarComponent,
    StandingsTableSmallComponent,
    LocationSearchInputComponent,
    ImageUploaderComponent,
    QuickSportPickerComponent,
    SeasonInvitedTableComponent,
    PoolTeamCardComponent,
    SeasonCreatorTimingComponent,
    SeasonCreatorFormActivityRowComponent,
    ActivityTimeBoxWidgetComponent,
    TournamentEditPageComponent,
    GenderPickerComponent,
    LevelOfPlaySelectorComponent,
    RangePickerComponent,
    RangeAgePickerComponent,
    TournamentEventEditPageComponent,
    ActionSuccessModalComponent,
    SeasonDashboardComponent,
    SeasonMatchesPageComponent,
    SeasonTeamsPageComponent,
    TournamentBracketsComponent,
    TournamentScheduleGeneratorComponent,
    LeagueCreatorBasicComponent,
    LeagueCreatorDescriptionComponent,
    LeagueCreatorFormatComponent,
    ConfirmationModalComponent,
    BulkChangeTimeModalComponent,
    VenueSelectModalComponent,
    ParticipantsModalComponent,
    TeamsConstraintsModalComponent,
    CreateDivisionModalComponent,
    PresetColorPickerComponent,
    PlayerSeasonInfoModalComponent,
    TopScorerModalPostComponent,
    VenueSearchInputComponent,
    RosterXlsUploadModalComponent,
    OrgQuestionsEditFormComponent,
    DailyAgendaComponent,
    DateRangeDropdownComponent,
    NumberInputAndSwitchComponent,
    WeekDaysHoursSelectComponent,
    ScheduleConstraintsComponent,
    SeasonSegmentsComponent,
    PriceInputRowComponent,
    MembershipPricesComponent,
    ProgramPackagesComponent,
    ProgramBasicInfoComponent,
    DashboardHighlightsComponent,
    EventsViewComponent,
    AddOnsManagementComponent,
    SpaceAllocationManagementComponent,

    // react components
    GetPaymentV2Component,
    DiscountV2Component,
    RichTextWrapperComponent,
  ],
})
export class SharedPagesModule {}
