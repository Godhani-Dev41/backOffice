import { SeasonPoolParticipantOrder } from "@app/client/pages/leagues/league-page/league-page-season/season-teams-page/season-teams-page.component";
import { SubSeason } from "@app/shared/services/programs/programs.service";
import { mergeMap, map } from "rxjs/operators";
import { Injectable } from "@angular/core";

import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { TimeService } from "@app/shared/services/utils/time.service";
import { EventStatus, RCActivityTime, RCEventMatchStatusEnum } from "@rcenter/core";
import * as _ from "lodash";
// tslint:disable-next-line:import-blacklist
import { Observable, ReplaySubject } from "rxjs";
import { environment } from "../../../../environments/environment";
import { RCEntities, RCServerResponse } from "../main";
import {
  RCAddress,
  RCOrganization,
  RCSeasonPoolParticipant,
  RCLeague,
  RCLeagueSeason,
  RCSeasonTeam,
  RCSeasonRound,
  RCSeasonRoundMatch,
  RCTeam,
  RCUser,
  RCTeamMember,
  RCLeagueDetailTypeEnum,
  RCGenderEnum,
  IRCLeagueDetail,
  RCTeamMemberRoleEnum,
  RCStanding,
  RCVenueActivityItem,
  RCSeasonTeamRequest,
  RCSeasonDivision,
} from "@rcenter/core";

import { FormBuilder } from "@angular/forms";
import { RCCreateLeagueData } from "@app/shared/services/tournament/tournament.service";
import { FileItem } from "ng2-file-upload";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { ResponseContentType } from "@angular/http";
import { RCQuestionObject } from "@rcenter/core/models/Questions";
import { RCPaymentStatus } from "@rcenter/core/models/Leagues";
import { SportsService } from "@app/shared/services/utils/sports.service";
import { HttpClient } from "@angular/common/http";
const moment: any = require("moment-timezone");

export interface RCLeagueDetailVM {
  title: string;
  icon: string;
  ordinal: number;
  items: Array<{
    value: string;
    title: string;
    type: "string" | "icon";
    noTitle?: boolean;
  }>;
}

export interface RCCreateMatchBody {
  participants: [
    {
      entityId: number;
      entityType: RCEntities;
      // @ts-ignore
    },
  ];
  title: string;
  address: RCAddress;
  venueName: string;
  description: string;
  venueId: number;
  excludeStandings?: boolean;
  startDate: Date;
  endDate: Date;
  status?: EventStatus;
}

export interface ReAssignTeamMemberBody {
  userId: number;
  oldTeamId: number;
  newTeamId: number;
  creatorId?: number;
  creatorType?: RCEntities;
}

export interface RCTournamentScheduleSuggestCreate {
  startDate: Date;
  endDate: Date;
  participantsCount?: number;
  timeSlots: RCVenueActivityItem[];
  matchLength?: number;
  participantsList?: {
    participantId?: number;
    participantType?: "user" | "team";
    name: string;
    isBye?: boolean;
  }[];
}

export interface RCSeriesBulkUpdateObject {
  id: number;
  seriesParticipants: {
    entityType: RCEntities;
    entityId: number;
    name: string;
  }[];
}

export interface RCStandingFetchResult {
  id: number;
  name: string;
  color: string;
  seasonTeams?: RCStanding[];
}

export enum SeasonPlayerPaymentMethod {
  BRAINTREE = 1,
  PAYPALEMAIL = 2,
  CASH = 3,
  STRIPE = 4,
}

export interface SeasonPlayerResponseObject {
  notRegistered?: boolean;
  canUnassign?: boolean;
  user: RCUser;
  paymentAmount?: number;
  paymentStatus: RCPaymentStatus;
  seasonPool: RCSeasonPoolParticipant;
  paymentMethod: SeasonPlayerPaymentMethod;
  registrationDate?: string;
  segments?: SubSeason[];
  answers: {
    answerValue: any;
    question: RCQuestionObject;
  }[];
}

interface RequiredProducts {
  requiredProductIds?: number[];
}

@Injectable()
export class LeaguesService {
  currentOrganization: RCOrganization;

  private currentLeague = new ReplaySubject<RCLeague & RequiredProducts>(1);
  private currentSeason = new ReplaySubject<RCLeagueSeason>(1);
  private currentTeams = new ReplaySubject<RCSeasonTeam[]>(1);
  currentLeague$ = this.currentLeague.asObservable();
  currentSeason$ = this.currentSeason.asObservable();
  currentTeams$ = this.currentTeams.asObservable();
  currentLeagueId: number;
  currentSeasonId: number;
  currentLeagueObject: RCLeague;
  constructor(
    private timeService: TimeService,
    private http: HttpClient,
    private authService: AuthenticationService,
    private sportsService: SportsService,
    private fb: FormBuilder,
    private imagesService: ImagesService,
  ) {
    this.authService.currentOrganization.subscribe((data) => {
      this.currentOrganization = data;
    });
  }

  createLeague(data: RCCreateLeagueData) {
    return this.http.post<any>(`${environment.CS_URLS.API_ROOT}/leagues`, data).pipe(map((response) => response));
  }

  publishLeague(leagueId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/publish`, {})
      .pipe(map((response) => response));
  }

  updateLeague(leagueId: number, data: RCCreateLeagueData) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}`, data)
      .pipe(map((response) => response));
  }

  getLeagues(options?: { tournamentsOnly: boolean }): Observable<RCServerResponse<RCLeague[]>> {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${
          this.currentOrganization.id
        }/leagues?orderBy=name&datascope=full&limit=100&${
          options && options.tournamentsOnly ? "leagueType=tournament" : ""
        }`,
      )
      .pipe(map((response) => response));
  }

  getLeagueById(id: number): Observable<RCServerResponse<RCLeague>> {
    return this.http.get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${id}`).pipe(
      map((response) => response),
      map((response) => {
        return response;
      }),
    );
  }

  setCurrentTeams(teams: RCSeasonTeam[]) {
    this.currentTeams.next(teams);
  }

  setCurrentSeason(season: RCLeagueSeason) {
    this.currentSeasonId = season ? season.id : null;
    this.currentSeason.next(season);
  }

  setCurrentLeague(league: RCLeague) {
    this.currentLeagueObject = league;
    this.currentLeagueId = league ? league.id : null;
    this.currentLeague.next(league);
  }

  getSeasonById(leagueId: number, seasonId: number): Observable<RCServerResponse<RCLeagueSeason>> {
    return this.http.get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}`).pipe(
      map((response) => response),
      map((response) => {
        return response;
      }),
    );
  }

  getSeasonStatistics(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches/statistics`)
      .pipe(map((response) => response));
  }

  getSeasonMatches(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches`)
      .pipe(map((response) => response));
  }

  getSeasonQuestionsReport(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/questionnaire/report`, {
        responseType: "blob",
      } as any)
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  getScheduleReport(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/download-spreadsheet-schedule`,
        {
          responseType: "blob",
        } as any,
      )
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  getSeasonParticipantsReport(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/participants/report`, {
        responseType: "blob",
      } as any)
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }

  bulkPublishSeasonMatches(leagueId: number, seasonId: number, ids: number[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches/publish`, {
        eventIds: ids,
      })
      .pipe(map((response) => response));
  }

  bulkCancelSeasonMatches(leagueId: number, seasonId: number, data: { eventId: number; roundId: number }[]) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches`, {
        params: {
          events: data as any,
        },
      })
      .pipe(map((response) => response));
  }

  bulkMatchesUpdate(leagueId: number, seasonId: number, data: any[]) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches`, {
        events: data,
      })
      .pipe(map((response) => response));
  }

  bulkScoreUpdate(
    leagueId: number,
    seasonId: number,
    data: { eventId: number; status: number; participants: any[] }[],
  ) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/matches/scores`, {
        events: data,
      })
      .pipe(map((response) => response));
  }

  getSeasonTeams(leagueId: number, seasonId: number, query?: object): Observable<RCServerResponse<RCSeasonTeam[]>> {
    const reqQuery = query || {};

    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams?${serialize(reqQuery)}`)
      .pipe(
        map((response) => response),
        map((response) => {
          response.data = response.data.map((i) => {
            i.captain = this.findTeamCaptain(i.team);

            return i;
          });

          return response;
        }),
      );
  }

  getSeasonRounds(leagueId: number, seasonId: number, roundId: number): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/rounds/${roundId}?datascope=full`,
      )
      .pipe(map((response) => response));
  }

  reAssignTeamMember(leagueId: number, seasonId: number, data: ReAssignTeamMemberBody): Observable<any> {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/reassign`, data)
      .pipe(map((response) => response));
  }

  createSeasonMatch(roundId: number, body: RCCreateMatchBody): Observable<RCServerResponse<RCSeasonRoundMatch>> {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/rounds/${roundId}/match`,
        body,
      )
      .pipe(map((response) => response));
  }

  updateSeasonMatch(
    leagueId: number,
    seasonId: number,
    roundId: number,
    matchId: number,
    body: {
      newRoundId?: number;
      startDate: Date;
      endDate: Date;
      address: RCAddress;
      excludeStandings: boolean;
      venueName: string;
      venueId: number;
      description: string;
    },
  ): Observable<RCServerResponse<RCSeasonRoundMatch>> {
    return this.http
      .patch<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/rounds/${roundId}/match/${matchId}`,
        body,
      )
      .pipe(map((response) => response));
  }

  removeTeamAssignment(leagueId: number, seasonId: number, teamId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/${teamId}`, {
        params: {
          unassignMembers: "true",
        },
      })
      .pipe(map((response) => response));
  }

  restorePoolEntity(leagueId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/participants/${poolId}/restore`,
        {},
      )
      .pipe(map((response) => response));
  }

  removePoolEntity(leagueId: number, seasonId: number, poolId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/participants/${poolId}`)
      .pipe(map((response) => response));
  }

  getSeasonPlayer(
    leagueId: number,
    seasonId: number,
    userId: number,
  ): Observable<RCServerResponse<SeasonPlayerResponseObject>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/players/${userId}`)
      .pipe(map((response) => response));
  }

  cancelSeasonMatch(roundId: number, matchId: number) {
    return (
      this.http
        // tslint:disable-next-line
        .delete(
          `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/rounds/${roundId}/match/${matchId}`,
        )
        .pipe(map((response) => response))
    );
  }

  createSeasonTeam(leagueId: number, seasonId: number, body: RCTeam): Observable<RCServerResponse<RCTeam>> {
    const createSubject = {
      createTeam: {
        create: true,
        data: body,
      },
    };

    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/`, createSubject)
      .pipe(map((response) => response));
  }

  uploadLeagueMedia(file: FileItem, leagueId: number, type: "main" | "logo" = "main") {
    return this.imagesService.uploadFileItemImage(file).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/uploadMedia?handleType=${type}`,
          {
            file: fileObject,
          },
        );
      }),
    );
  }

  assignTeamToSeason(teamId: number): Observable<RCServerResponse<RCTeam>> {
    const createSubject = {
      createTeam: {
        create: false,
      },
      teamId,
    };

    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/teams`,
        createSubject,
      )
      .pipe(map((response) => response));
  }

  createRound(body: {
    name: string;
    ordinal: number;
    divisionId: number;
  }): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/rounds`,
        body,
      )
      .pipe(map((response) => response));
  }

  updateRound(roundId: number, body: { name: string; ordinal: number }): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/rounds/${roundId}`,
        body,
      )
      .pipe(map((response) => response));
  }

  removeRound(roundId: number) {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/rounds/${roundId}`,
      )
      .pipe(map((response) => response));
  }

  getSeasonStandings(leagueId: number, seasonId: number): Observable<RCServerResponse<RCStandingFetchResult[]>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/standings`)
      .pipe(map((response) => response));
  }

  getSeasonPool(): Observable<RCServerResponse<SeasonPoolParticipantOrder[]>> {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/participants`,
      )
      .pipe(map((response) => response));
  }

  assignPlayerFromPool(teamId: number, userId: number): any {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/teams/${teamId}/members/${userId}`,
        {},
      )
      .pipe(map((response) => response));
  }

  removePlayerFromTeam(teamId: number, userId: number): any {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentLeagueId}/season/${this.currentSeasonId}/teams/${teamId}/members/${userId}`,
      )
      .pipe(map((response) => response));
  }

  createSeason(leagueId: number, season: RCLeagueSeason) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season`, season)
      .pipe(map((response) => response));
  }

  updateSeason(leagueId: number, seasonId: number, season: RCLeagueSeason) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}`, season)
      .pipe(map((response) => response));
  }

  publishSeason(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/publish`, {})
      .pipe(map((response) => response));
  }

  publishSeasonRoster(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/publish-roster`, {})
      .pipe(map((response) => response));
  }

  publishSeasonSchedule(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/publish-schedule`, {})
      .pipe(map((response) => response));
  }

  sendInvites(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/invite-schedule`, {})
      .pipe(map((response) => response));
  }

  createTournamentSuggest(
    tournamentId: number,
    data: RCTournamentScheduleSuggestCreate,
    seasonId?: number,
    leagueId?: number,
  ) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId || this.currentLeagueId}/season/${
          seasonId || this.currentSeasonId
        }/tournament-events/${tournamentId}/suggest`,
        data,
      )
      .pipe(map((response) => response));
  }

  bulkSeasonTeamAssign(leagueId: number, seasonId: number, teamIds: number[]) {
    const data = teamIds.map((i) => {
      return {
        teamId: i,
        createTeam: {
          create: false,
        },
      };
    });

    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/bulk`, { teams: data })
      .pipe(map((response) => response));
  }

  bulkBracketsAssignment(leagueId: number, seasonId: number, data: RCSeriesBulkUpdateObject[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/series/bulk-update`, {
        series: data,
        handleWithSeasonTeams: true,
      })
      .pipe(map((response) => response));
  }

  updateSeasonTeamScheduleRequests(leagueId: number, seasonId: number, teamId: number, scheduleRequests) {
    return this.http
      .patch(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/${teamId}`, {
        scheduleRequests,
      })
      .pipe(map((response) => response));
  }

  updateSeasonTeamDivision(leagueId: number, seasonId: number, teamId: number, divisionId: number) {
    return this.http
      .patch(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/teams/${teamId}`, {
        divisionId,
      })
      .pipe(map((response) => response));
  }

  unpublishLeague(leagueId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/unpublish`, {})
      .pipe(map((response) => response));
  }

  deleteLeague(leagueId: number) {
    return this.http.delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}`).pipe(map((response) => response));
  }

  deleteSeason(leagueId: number, seasonId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}`)
      .pipe(map((response) => response));
  }

  unpublishSeason(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/unpublish`, {})
      .pipe(map((response) => response));
  }

  updateDivisions(leagueId: number, seasonId: number, divisions: RCSeasonDivision[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/divisions/bulk`, {
        divisions,
      })
      .pipe(map((response) => response));
  }

  /**
   * Retrieves the team captain from the team members list
   * The team captain is defined by the roles enum
   * @param team
   * @returns { RCUser }
   */
  findTeamCaptain(team: RCTeam): RCUser {
    if (!team || !team.teamMembers) return;
    const foundCaptain: RCTeamMember = _.find<RCTeamMember>(
      team.teamMembers,
      (i) => i.role === RCTeamMemberRoleEnum.ADMIN,
    );

    if (foundCaptain) return foundCaptain.user;
  }

  /**
   * Normalizes the league details to a application specific VM
   * @param leagueDetails
   * @returns { RCLeagueDetailVM }
   */
  parseLeagueDetails(leagueDetails: IRCLeagueDetail[]): RCLeagueDetailVM[] {
    if (!leagueDetails) return [];

    const newDetails = [];

    const minAge = _.find(leagueDetails, (i) => i.detailType === RCLeagueDetailTypeEnum.MINAGE);
    const maxAge = _.find(leagueDetails, (i) => i.detailType === RCLeagueDetailTypeEnum.MAXAGE);
    const gender: any = _.find(leagueDetails, (i) => i.detailType === RCLeagueDetailTypeEnum.GENDER);

    const oldDetails = _.cloneDeep<IRCLeagueDetail[]>(leagueDetails);

    oldDetails.forEach((detail) => {
      const newDetail = {
        ordinal: detail.ordinal,
      } as RCLeagueDetailVM;

      if (detail.detailType === RCLeagueDetailTypeEnum.GAMESSEASON && typeof detail.data === "string") {
        newDetail.title = "Games/Season";
        newDetail.icon = "icon-rc-games-per-season";
        newDetail.items = [
          {
            type: "string",
            title: "Games",
            value: detail.data,
          },
        ];

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.MINWEEK && typeof detail.data === "string") {
        newDetail.title = "Min/Week";
        newDetail.icon = "icon-rc-min-per-week";
        newDetail.items = [
          {
            type: "string",
            title: "Minutes",
            value: detail.data,
          },
        ];

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.LEVELOFPLAY && Array.isArray(detail.data)) {
        detail.data = detail.data || [];

        newDetail.title = "Level of Play";
        newDetail.icon = "icon-rc-star-icon";

        newDetail.items = detail.data.map((i, index) => {
          return {
            type: "icon",
            title: this.sportsService.getLevelOfPlayText(i),
            value: "icon-rc-star-icon",
            noTitle: index > 0,
          };
        }) as any;
        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.MATCHLENGTH) {
        newDetail.title = "Match Length";
        newDetail.icon = "icon-rc-min-per-week";
        newDetail.items = [
          {
            type: "string",
            title: "Minutes",
            value: detail.data,
          },
        ] as any;

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.GAMESSEASON) {
        newDetail.title = "Games/Season";
        newDetail.icon = "icon-rc-games-per-season";
        newDetail.items = [
          {
            type: "string",
            title: "Games",
            value: detail.data,
          },
        ] as any;

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.PLAYERSPERTEAM) {
        newDetail.title = "Players/Team";
        newDetail.icon = "icon-rc-payment-team";
        newDetail.items = [
          {
            type: "string",
            title: "Players",
            value: detail.data && detail.data.min + "-" + detail.data.max,
          },
        ] as any;

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.SURFACE) {
        newDetail.title = "Surface";
        newDetail.icon = "icon-rc-surface";

        if (detail.data === "fieldTurf") {
          detail.data = "Field Turf";
        } else if (detail.data === "astroTurf") {
          detail.data = "Astro Turf";
        } else if (detail.data === "sportCourt") {
          detail.data = "Sport Court";
        } else {
          detail.data = _.capitalize(detail.data);
        }

        newDetail.items = [
          {
            type: "string",
            title: "Surface",
            value: detail.data,
          },
        ] as any;

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.FORMAT) {
        newDetail.title = "Format";
        newDetail.icon = "icon-rc-whistle";
        newDetail.items = [
          {
            type: "string",
            title: "Format",
            value: detail.isCustom ? detail.data : detail.data + "vs" + detail.data,
          },
        ] as any;

        newDetails.push(newDetail);
      } else if (detail.detailType === RCLeagueDetailTypeEnum.OTHER && typeof detail.data === "string") {
        newDetail.title = detail.title;
        newDetail.icon = "icon-rc-star-icon";

        newDetail.items = [
          {
            type: "string",
            title: detail.title,
            value: detail.data,
          },
        ];

        newDetails.push(newDetail);
      }
    });

    if (minAge || maxAge || gender) {
      const newDetail = {
        title: "Age & Gender",
        icon: "icon-rc-person-icon",
        ordinal: 0,
        items: [],
      } as RCLeagueDetailVM;

      if (gender) {
        let genderText = RCGenderEnum[gender.data] || "Co-ed";
        if (genderText === "OTHER") genderText = "Co-ed";

        newDetail.items.push({
          title: genderText,
          type: "icon",
          value: "icon-rc-person-icon",
        });
      }

      if (minAge || maxAge) {
        let ageString = `${minAge ? minAge.data + "-" : ""}${maxAge ? maxAge.data : ""}`;

        // if max age is above 65 we simply take the lower age and write it with "+" sign
        if (maxAge && maxAge.data && Number(maxAge.data) >= 65 && minAge && minAge.data) {
          ageString = minAge.data + "+";
        }

        newDetail.items.push({
          title: "Years",
          type: "string",
          value: ageString,
        });
      }

      if (newDetail.items[1]) {
        newDetail.items[1].noTitle = true;
      }

      newDetails.unshift(newDetail);
    }

    return newDetails;
  }

  prepareSeasonObject(data, timezone: string): RCLeagueSeason {
    let name, description, longDescription;
    if (data.basicInfo) {
      name = data.basicInfo.name;
      description = data.basicInfo.description;
      longDescription = data.basicInfo.longDescription;
    }

    const { startDate, endDate } = data.creatorSchedule;
    const early = data.creatorSchedule.earlyBirdRegistration;
    const regular = data.creatorSchedule.regularRegistration;
    const late = data.creatorSchedule.lateRegistration;

    const season: RCLeagueSeason = {
      name,
      description,
      longDescription,
      startDate: this.timeService.replaceTimeZone(
        moment(startDate).hour(0).minute(1).format(),
        timezone,
        moment.tz.guess(),
      ),
      endDate: this.timeService.replaceTimeZone(
        moment(endDate).hour(22).minute(59).format(),
        timezone,
        moment.tz.guess(),
      ),
      status: data.status,
      registrationStatus: data.registrationStatus,
      activityTimes: this.calculateActivityTimes(data.activityTime),
      registrationOpen: data.registrationOpen ? moment(data.registrationOpen).hour(0).minute(1).format() : null,
      priceRegularTeam: null,
      priceEarlyTeam: null,
      priceEarlyTeamMember: null,
      priceEarlySingle: null,
      priceRegularSingle: null,
      priceRegularTeamMember: null,
      priceLateTeam: null,
      priceLateTeamMember: null,
      priceLateSingle: null,
    } as any;

    if (early.active) {
      season.earlyRegistrationEnds = early.endDate ? moment(early.endDate).endOf("day").format() : null;

      if (early.individualActive) {
        season.priceEarlySingle = early.individualPrice;
      }

      if (early.teamActive) {
        season.priceEarlyTeam = early.teamPrice;
      }

      if (early.teamPerPlayerActive) {
        season.priceEarlyTeamMember = early.teamPerPlayerPrice;
      }
    } else {
      season.priceEarlyTeamMember = null;
      season.priceEarlyTeam = null;
      season.priceEarlySingle = null;
      season.earlyRegistrationEnds = null;
    }

    if (regular.active) {
      season.regularRegistrationEnds = regular.endDate ? moment(regular.endDate).endOf("day").format() : null;

      if (regular.individualActive) {
        season.priceRegularSingle = regular.individualPrice;
      }

      if (regular.teamActive) {
        season.priceRegularTeam = regular.teamPrice;
      }

      if (regular.teamPerPlayerActive) {
        season.priceRegularTeamMember = regular.teamPerPlayerPrice;
      }
    } else {
      season.priceRegularTeamMember = null;
      season.priceRegularTeam = null;
      season.priceRegularSingle = null;
      season.regularRegistrationEnds = null;
    }

    if (late.active) {
      season.lateRegistrationEnds = late.endDate ? moment(late.endDate).endOf("day").format() : null;

      if (late.individualActive) {
        season.priceLateSingle = late.individualPrice;
      }

      if (late.teamActive) {
        season.priceLateTeam = late.teamPrice;
      }

      if (late.teamPerPlayerActive) {
        season.priceLateTeamMember = late.teamPerPlayerPrice;
      }
    } else {
      season.priceLateTeamMember = null;
      season.priceLateTeam = null;
      season.priceLateSingle = null;
      season.lateRegistrationEnds = null;
    }

    if (data.activityTimes) {
      season.seasonWindows = this.createSeasonActivityWindowFromForm(data.activityTimes);
    }

    return season;
  }

  markPaymentAsSettled(leagueId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/participants/${poolId}/payment-settled`,
        {},
      )
      .pipe(map((response) => response));
  }

  markPaymentAsUnSettled(leagueId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/participants/${poolId}/payment-settled`,
        {
          setPending: true,
        },
      )
      .pipe(map((response) => response));
  }

  calculateActivityTimes(activityTime): RCActivityTime[] {
    let activities: RCActivityTime[] = [];
    if (!activityTime) return activities;

    Object.keys(activityTime).forEach((key) => {
      let dayOfWeek;

      switch (key) {
        case "activityTimeSunday":
          dayOfWeek = 8;
          break;
        case "activityTimeMonday":
          dayOfWeek = 2;
          break;
        case "activityTimeTuesday":
          dayOfWeek = 3;
          break;
        case "activityTimeWednesday":
          dayOfWeek = 4;
          break;
        case "activityTimeThursday":
          dayOfWeek = 5;
          break;
        case "activityTimeFriday":
          dayOfWeek = 6;
          break;
        case "activityTimeSaturday":
          dayOfWeek = 7;
          break;
      }

      if (activityTime[key + "Active"]) {
        activities = activities.concat(this.getTimesForDay(dayOfWeek, activityTime[key]));
      }
    });

    return activities;
  }

  getTimesForDay(dayOfWeek: number, activity): RCActivityTime[] {
    return activity.map((item) => {
      return {
        dayOfWeek,
        open: moment(item.startTime).format("HH:mm"),
        close: moment(item.endTime).format("HH:mm"),
      };
    });
  }

  createSeasonActivityWindowFromForm(formActivities: any[]): RCVenueActivityItem[] {
    const activities: RCVenueActivityItem[] = [];

    formActivities.forEach((activity) => {
      activity.activityDates.forEach((date) => {
        const parsedDaysActivities = this.getActivityTimeObject(date);
        if (!parsedDaysActivities) return;

        parsedDaysActivities.forEach((i) => {
          if (!i || !i.dayOfWeek || !i.open || !i.close) return;

          const item: RCVenueActivityItem = {
            venueName: activity.venueName,
            venueId: activity.venueId,
            address: activity.venueAddress,
            concurrent: date.concurrent || 1,
            activityTime: i,
          };

          if (activity["venueId"] && activity["spaceId"]) {
            item["reservation"] = {
              isInternal: true,
              creatorId: activity["spaceId"],
              creatorType: "space",
            };
          }

          activities.push(item);
        });
      });
    });

    return activities;
  }

  getActivityTimeObject(activity): RCActivityTime[] {
    const activities: RCActivityTime[] = [];
    /*   const startTime = moment
         .tz(activity.startTime, this.currentLeagueObject['timezone'] || moment.tz.guess()).utc().format('HH:mm');
       const endTime = moment
         .tz(activity.endTime, this.currentLeagueObject['timezone'] || moment.tz.guess()).utc().format('HH:mm');
   */
    const startTime = moment(activity.startTime).format("HH:mm");
    const endTime = moment(activity.endTime).format("HH:mm");
    const packageStartHours = activity.packageStartHours;

    if (activity.sunday) {
      activities.push({
        dayOfWeek: 8,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }

    if (activity.monday) {
      activities.push({
        dayOfWeek: 2,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }
    if (activity.tuesday) {
      activities.push({
        dayOfWeek: 3,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }

    if (activity.wednesday) {
      activities.push({
        dayOfWeek: 4,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }
    if (activity.thursday) {
      activities.push({
        dayOfWeek: 5,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }
    if (activity.friday) {
      activities.push({
        dayOfWeek: 6,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }
    if (activity.saturday) {
      activities.push({
        dayOfWeek: 7,
        open: startTime,
        close: endTime,
        parentType: "league",
        packageStartHours: packageStartHours,
      } as RCActivityTime);
    }

    return activities;
  }

  getActivityTimesFormControl() {
    return this.fb.array([this.getActivityTimeGroupObject()]);
  }

  getActivityTimeGroupObject() {
    return this.fb.group({
      venueName: [""],
      venueId: [""],
      spaceId: [""],
      venueAddress: [""],
      venueEntityAddress: [""],
      venue: "",
      activityDates: this.fb.array([this.getActivityDateFormControl()]),
    });
  }

  getActivityDateFormControl() {
    return this.fb.group({
      concurrent: 1,
      sunday: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",

      startTime: moment().hour(18).minute(0),
      endTime: moment().hour(21).minute(0),
      packageStartHours: [],
    });
  }

  convertCourtWindowsToVM(seasonWindows: RCVenueActivityItem[]) {
    const grouppedByAddressId = _.groupBy(seasonWindows, (i) => {
      return i["open"] + "-" + i["close"];
    });

    const activityTimes = [];
    const item = {
      activityDates: [],
    };
    for (const key of Object.keys(grouppedByAddressId)) {
      if (key) {
        const activity = grouppedByAddressId[key][0];
        const fromHour = activity["open"].split(":");
        const toHour = activity["close"].split(":");
        const activityObject: any = {
          concurrent: activity.concurrent,
          packageStartHours: activity.packageStartHours,
          startTime: moment().hour(Number(fromHour[0])).minute(Number(fromHour[1])).toDate(),
          endTime: moment().hour(Number(toHour[0])).minute(Number(toHour[1])).toDate(),
        };
        grouppedByAddressId[key].forEach((singleItem: any) => {
          switch (singleItem.dayOfWeek) {
            case 2:
              activityObject.monday = true;
              break;
            case 3:
              activityObject.tuesday = true;
              break;
            case 4:
              activityObject.wednesday = true;
              break;
            case 5:
              activityObject.thursday = true;
              break;
            case 6:
              activityObject.friday = true;
              break;
            case 7:
              activityObject.saturday = true;
              break;
            case 8:
              activityObject.sunday = true;
              break;
          }
        });

        item.activityDates.push(activityObject);
      }
    }

    activityTimes.push(item);
    return activityTimes;
  }

  convertSeasonWindowsToVM(seasonWindows: any[]) {
    const grouppedByAddressId = _.groupBy(seasonWindows, "venueName");
    const activityTimes = [];
    for (const key of Object.keys(grouppedByAddressId)) {
      if (key) {
        const item = {
          spaceId: grouppedByAddressId[key][0].spaceId || "",
          venueName: grouppedByAddressId[key][0].venueName || "",
          venueId: grouppedByAddressId[key][0].venueId || "",
          venueAddress:
            (grouppedByAddressId[key][0]["venue"]
              ? grouppedByAddressId[key][0]["venue"].address
              : grouppedByAddressId[key][0].address) || "",
          venue: grouppedByAddressId[key][0]["venue"],
          activityDates: [],
        };

        grouppedByAddressId[key].forEach((activity) => {
          const fromHour = activity.activityTime.open.split(":");
          const toHour = activity.activityTime.close.split(":");
          const activityObject: any = {
            concurrent: activity.concurrent,
            startTime: moment().hour(Number(fromHour[0])).minute(Number(fromHour[1])).toDate(),
            endTime: moment().hour(Number(toHour[0])).minute(Number(toHour[1])).toDate(),
          };

          switch (activity.activityTime.dayOfWeek) {
            case 2:
              activityObject.monday = true;
              break;
            case 3:
              activityObject.tuesday = true;
              break;
            case 4:
              activityObject.wednesday = true;
              break;
            case 5:
              activityObject.thursday = true;
              break;
            case 6:
              activityObject.friday = true;
              break;
            case 7:
              activityObject.saturday = true;
              break;
            case 8:
              activityObject.sunday = true;
              break;
          }

          item.activityDates.push(activityObject);
        });

        activityTimes.push(item);
      }
    }

    return activityTimes;
  }
}

function serialize(obj) {
  const str = [];
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  }

  return str.join("&");
}
