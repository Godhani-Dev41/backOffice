import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";

import { HostListener, Injectable, OnDestroy, OnInit } from "@angular/core";

import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, ActivationEnd, NavigationStart, Router, RouterEvent } from "@angular/router";
import { ActivityTimes } from "@app/client/pages/programs/program-season-schedule-page/program-season-schedule-page.component";
import { AddOnItem } from "@app/shared/components/add-ons-management/add-ons-management.component";
import { DaysOfWeek } from "@app/shared/components/week-days-hours-select/week-days-hours-select.component";

import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import {
  RCLeagueDetailVM,
  RCSeriesBulkUpdateObject,
  RCStandingFetchResult,
  RCTournamentScheduleSuggestCreate,
  ReAssignTeamMemberBody,
  SeasonPlayerResponseObject,
} from "@app/shared/services/leagues/leagues.service";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { SportsEnum, SportsService } from "@app/shared/services/utils/sports.service";
import { TimeService } from "@app/shared/services/utils/time.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import {
  IRCLeagueDetail,
  RCActivityTime,
  RCAddress,
  RCCanJoinSeasonEnum,
  RCEvent,
  RCGenderEnum,
  RCLeague,
  RCLeagueDetailTypeEnum,
  RCLeagueSeason,
  RCLeagueSeasonStatusEnum,
  RCMediaObject,
  RCOrganization,
  RCPaymentSettingStatus,
  RCSeasonCanJoinStatus,
  RCSeasonDivision,
  RCSeasonPoolParticipant,
  RCSeasonRosterStatusEnum,
  RCSeasonRound,
  RCSeasonRoundMatch,
  RCSeasonScheduleStatusEnum,
  RCSeasonTeam,
  RCSeasonTeamRequest,
  RCTeam,
  RCTeamMember,
  RCTeamMemberRoleEnum,
  RCUser,
  RCUserInvite,
  RCVenue,
  RCVenueActivityItem,
} from "@rcenter/core";
import * as _ from "lodash";
import { FileItem } from "ng2-file-upload";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import "rxjs/add/operator/map";
import { filter, map, takeUntil, mergeMap } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { RCServerResponse } from "../main";
import { User } from "app/react/types/user";

const moment: any = require("moment-timezone");

export interface RCProgram {
  id: number;
  name: string;
  organizationId: number;
  userCreatorId: number;
  programType: ProgramTypeEnum;
  programName: string;
  sport: SportsEnum;
  minAge: string;
  maxAge: string;
  gender: GenderEnum;
  status: ProgramSeasonStatusEnum;
  programHighlights: any[];
  mainMedia?: RCMediaObject;
  level?: LevelOfPlayEnum[];
  description?: string;
  longDescription?: string;
  GL?: string;
  requiredProductIds?: number[];
}

export interface RCCreateProgramData {
  organizationId: number;
  programType: ProgramTypeEnum;
  programName: string;
  description: string;
  longDescription?: string;
  sport: SportsEnum;
  minAge: string;
  maxAge: string;
  isAgeInMonths: boolean;
  gender: GenderEnum;
  status: ProgramSeasonStatusEnum;
  highlights: any[];
  levelOfPlay?: LevelOfPlayEnum[];
  GL?: string;
  requiredProductIds?: number[];
}

export interface RCUpdateProgramData extends RCCreateProgramData {
  programId: number;
  userCreatorId: number;
}

export interface SubSeason {
  name: string;
  startDate: string;
  endDate: string;
  activityTimes?: any;
  segmentType: "program_season" | "event";
}

export interface SegmentItem extends SubSeason {
  index: number;
  useSeasonDayTime: boolean;
  editing: boolean;
}

export interface RCCreateProgramSeason {
  name: string;
  status: number;
  seasonType: number;
  startDate: string;
  endDate: string;
  description?: string;
  longDescription?: string;
  parentSeasonId?: number;
  registrationStartDate?: string;
  registrationEndDate?: string;
  questionnaires?: number[];
  maxParticipants?: number;
  maxMaleParticipants?: number;
  maxFemaleParticipants?: number;
  maxWaitlist?: number;
  maxMaleWaitlist?: number;
  maxFemaleWaitlist?: number;
  facilityId?: number;
  addressId?: number;
  blockedDated?: { name: string; startDate: string; endDate: string; id?: number }[];
  activityTimes?: ActivityTimes[];
  subSeasons?: SegmentItem[] | SubSeason[];
  id?: number;
}

export interface RCProgramSeason extends RCCreateProgramSeason {
  id: number;
  programId: number;
  products?: RCProgramProduct[];
  gender: GenderEnum;
  level?: LevelOfPlayEnum[];
  sport: SportsEnum;
  minAge: string;
  maxAge: string;
  inviteSendDate?: Date;
  seasonTiming?: "current" | "future" | "past";
  registrationTiming?: "early" | "regular" | "late" | "close" | "ended";
  name: string;
  canJoin?: RCCanJoinSeasonEnum;
  canJoinStatus?: RCSeasonCanJoinStatus;
  multipleDivision?: boolean;
  priceEarlySingle?: number;
  priceRegularSingle?: number;
  priceLateSingle?: number;
  priceEarlyTeam?: number;
  priceEarlyTeamMember?: number;
  priceRegularTeam?: number;
  priceLateTeam?: number;
  priceLateTeamMember?: number;
  priceEarlyGroup?: number;
  priceRegularTeamMember?: number;
  priceRegularGroup?: number;
  priceLateGroup?: number;
  earlyRegistrationEnds: Date;
  regularRegistrationEnds: Date;
  lateRegistrationEnds: Date;
  registrationOpen: Date;
  registrationStatus?: number;
  description?: string;
  addressName?: string;
  rounds?: RCSeasonRound[];
  seasonProgram?: RCProgram;
  seasonVenues?: RCVenue[];
  // seasonTeams?: Group[];
  tournamentType?: boolean;
  playoffType?: boolean;
  playerCount?: number;
  seasonDivisions?: any[];
  tournament?: {
    tournamentConfig?: any;
    name: string;
    id: number;
    tournamentType: "singleElimination" | "doubleElimination";
    seasonId: number;
  };
  seasonWindows?: RCVenueActivityItem[];
  scheduleStatus?: RCSeasonScheduleStatusEnum;
  rosterStatus?: RCSeasonRosterStatusEnum;
  connectedSeasonId?: number;
  connectedDivisionId?: number;
  metaData?: {
    playoff?: {
      teamsToChoose?: {
        amount?: number;
        orderType?: "top" | "bottom";
      };
    };
  };
  installments?: number;
  onlinePaymentEnabled?: boolean;
  allowCash?: boolean;
  paymentSettingStatus?: RCPaymentSettingStatus;
  canJoinTeamMember?: boolean;
  canJoinTeamMemberId?: number;
  parentSeason?: RCProgramSeason;
  isPunchCard?: boolean;
}

export interface RCProgramSubSeason extends RCProgramSeason {
  segmentType: "program_season" | "event";
}

export interface RCProgramProducts {
  products: RCProgramProduct[];
}

export interface RCProgramProduct {
  id?: number;
  organizationId: number;
  name: string;
  description: string;
  quantity: number;
  isPublic: boolean;
  startDate: string;
  endDate: string;
  productType: string;
  productSubType?: string;
  resourcesType: string;
  resourcesIdsToApplyOn: number[];
  prices: RCProgramPricing[];
  downpayment?: number;
  GL?: string;
}

export interface RCProgramAddOn extends RCProgramProduct {
  relationType: string;
  new?: boolean;
}

export interface RCProgramPricing {
  price: number;
  currency: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface RCProgramPricingDisplay extends RCProgramPricing {
  active: boolean;
}

export enum ProgramTypeEnum {
  LEAGUE = 0,
  TOURNAMENT = 1,
  CLASS = 2,
  CLINIC = 3,
  CAMP = 4,
  LESSON = 5,
  CLUB_TEAM = 6,
}

export enum ProductTypesEnum {
  RESERVATION = "reservation",
  REGISTRATION = "registration",
  MEMBERSHIP = "membership",
  GOODS = "goods",
}

export enum GenderEnum {
  OTHER = 1,
  MALE = 2,
  FEMALE = 3,
}

export enum ProgramSeasonStatusEnum {
  UNPUBLISHED = 1,
  PUBLISHED = 2,
  CLOSED = 3,
  CANCELLED = 4,
}

export enum LevelOfPlayEnum {
  BEGINNER = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  SEMIPRO = 4,
  SPECTATOR = 5,
}

export interface RCProgramDetail {
  id?: number;
  programId?: number;
  detailType: RCLeagueDetailTypeEnum;
  title?: string;
  ordinal?: number;
  createdAt?: string;
  updatedAt?: string;
  data?: any;
  isCustom?: boolean;
}

export interface SeasonTeam {
  captainUserId: number;
  createdAt: Date;
  description: string;
  id: number;
  levelOfPlay: number[];
  mainMediaId: null;
  maxAgeYears: number;
  maxCapacity: number;
  seasonId: number;
  teamId: number;
  standingPosition: number;
  statistics: any;
  points: number;
  divisionId?: number;
  metaData?: {
    scheduleRequests?: RCSeasonTeamRequest[];
  };
  updatedAt: Date;
  team: RCTeam;
}

export interface Team {
  id: number;
}

export interface Division {
  id: number;
  name: string;
  ordinal?: number;
  programSeasonId: number;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  groups: SeasonTeam[];
  isDefault: boolean;
}

export interface Attendee {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  about?: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  status: string;
  pushNotifications?: boolean;
  notificationSettings?: {
    feed: { active: boolean };
    teams: { active: boolean };
    users: { active: boolean };
    events: { active: boolean };
    venues: { active: boolean };
    leagues: { active: boolean };
  };
  addressId?: number;
  currentAddressId?: number;
  merchantId?: number;
  loginToken?: string;
  gender: RCGenderEnum;
  height?: string;
  weight?: string;
  birthDate?: string;
  lastLogin?: Date;
  lastInteractionDay?: Date;
  createAsId?: boolean;
  createAsType?: boolean;
  motto?: string;
  privateProfile?: boolean;
  allowMultiSignHack?: boolean;
  deletedAt?: Date;
}

export enum GroupStatusEnum {
  ACTIVE = 1,
  INACTIVE = 2,
  DRAFT = 3,
}

export interface CreateGroup {
  name: string;
  description?: string;
  status?: GroupStatusEnum;
  maxCapacity?: number;
  mainMediaId?: number;
  minAgeYears?: number;
  maxAgeYears?: number;
  gender: RCGenderEnum;
  levelOfPlay?: LevelOfPlayEnum[];
  sports: SportsEnum[];
  questionnaires?: number[];
  captainUserId?: number;
  divisionId?: number;
}

export interface CreateDivision {
  name: string;
  ordinal?: number;
  programSeasonId: number;
  color: string;
  isDefault: boolean;
}

/*
 *
 *   On a shallow edit of a program season, you may update these fields plus subseason name
 *
 * */
export interface ShallowUpdateProgramSeason {
  seasonId: number;
  name: string;
  description?: string;
  questionnaires?: number[];
  maxParticipants?: number;
  maxMaleParticipants?: number;
  maxFemaleParticipants?: number;
  maxWaitlist?: number;
  maxMaleWaitlist?: number;
  maxFemaleWaitlist?: number;
  facilityId?: number;
  addressId?: number;
  subSeasons?: ShallowUpdateSubSeason[];
}

export interface ShallowUpdateSubSeason {
  id: number;
  name: string;
}

@Injectable()
export class ProgramsService implements OnInit, OnDestroy {
  loadingProgram = new BehaviorSubject<boolean>(false);
  loadingSeason = new BehaviorSubject<boolean>(false);
  loadingPricing = new BehaviorSubject<boolean>(true);
  loadingProgram$ = this.loadingProgram.asObservable();
  loadingSeason$ = this.loadingSeason.asObservable();
  loadingPricing$ = this.loadingSeason.asObservable();

  public currentOrganization = new BehaviorSubject<RCOrganization>(undefined);
  public currentProgram = new BehaviorSubject<RCProgram>(undefined);
  public currentSeason = new BehaviorSubject<RCProgramSeason>(undefined);
  public currentPricing = new BehaviorSubject(undefined);
  public currentEventDates = new BehaviorSubject(undefined);
  currentOrganization$ = this.currentOrganization.asObservable();
  currentProgram$ = this.currentProgram.asObservable();
  currentSeason$ = this.currentSeason.asObservable();
  currentPricing$ = this.currentPricing.asObservable();
  currentEventDates$ = this.currentEventDates.asObservable();

  public currentProgramType = new BehaviorSubject<string>("");
  public currentProgramTypeParam = new BehaviorSubject<string>("");
  currentProgramType$ = this.currentProgramType.asObservable();
  currentProgramTypeParam$ = this.currentProgramTypeParam.asObservable();

  private currentOrganizationVenues = new BehaviorSubject<RCVenue[]>([]);
  currentOrganizationVenues$ = this.currentOrganizationVenues.asObservable();

  private currentTeams = new BehaviorSubject<any[]>([]);
  currentTeams$ = this.currentTeams.asObservable();

  public seasonEdit = new BehaviorSubject<undefined | "shallow" | "full">(undefined);
  seasonEdit$ = this.seasonEdit.asObservable();

  private destroy$ = new Subject<true>();

  constructor(
    private timeService: TimeService,
    private http: HttpClient,
    private authService: AuthenticationService,
    private sportsService: SportsService,
    private venuesService: VenuesService,
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private programsFormService: ProgramsFormService,
    private datePipe: DatePipe,
  ) {
    /*router.events
      .pipe(
        filter((event: RouterEvent) => {
          return event instanceof NavigationStart;
        }),
      )
      .subscribe((event: NavigationStart) => {
        if (event.navigationTrigger === "popstate") {
          if (event.url.includes("schedule") || event.url.includes("basic")) {
            if (event.url && event.url.split("/").length === 7) {
              if (this.getProgramTypeParam() && this.getPrgId() && this.getSeasonId()) {
                this.router.navigate(
                  [
                    "/client/programs/" +
                      this.getProgramTypeParam() +
                      "/" +
                      this.getPrgId() +
                      "/season/" +
                      this.getSeasonId() +
                      (event.url.includes("schedule") ? "/schedule" : "/basic"),
                  ],
                  { replaceUrl: true },
                );
              }
            }
          }
        }
      });*/

    this.router.events
      .pipe(
        filter((e) => e instanceof ActivationEnd && Object.keys(e.snapshot.params).length > 0),
        map((e) => (e instanceof ActivationEnd ? e.snapshot.params : {})),
      )
      .subscribe((params) => {
        if (params.programType) {
          this.handleProgramTypeUrlChange(params.programType.toString());
        }
      });
  }

  ngOnInit() {}

  ngOnDestroy = () => {
    this.destroy$.next(true);
  };

  init = async (programId?: number, seasonId?: number) => {
    this.clearProgramValues();
    this.clearPrgSeasonValues();
    // Subscribe to currentOrganization and get venues + spaces
    if (!this.getOrgId()) {
      this.authService.currentOrganization.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        this.currentOrganization.next(data);
        this.venuesService.getOrganizationVenues(data.id).subscribe((res) => {
          this.currentOrganizationVenues.next(res.data);
        });
      });
    }

    //  Load program data
    if (programId && programId !== this.getPrgId()) {
      console.log("programs loading");
      this.loadingProgram.next(true);
      this.getProgramById(programId).subscribe(
        (res) => {
          if (res.data) {
            this.setCurrentProgram(res.data);
            this.loadingProgram.next(false);
            console.log("programs loading completed");
          }
        },
        (err) => {
          this.clearProgramValues();
          this.loadingProgram.next(false);
          console.error("programs loading failed", err);
        },
      );
    }

    //  Load season + products
    if (seasonId && seasonId !== this.getSeasonId()) {
      console.log("seasons loading");
      this.loadingSeason.next(true);

      this.getSeasonById(seasonId).subscribe(
        (res) => {
          if (res.data) {
            this.currentSeason.next(res.data);
            this.setCurrentSeason(res.data);

            this.loadingSeason.next(false);
            console.log("seasons loading completed");

            // Get subseasons
            this.getSubSeasons(seasonId).subscribe((subSeasons) => {
              const subs: RCProgramSubSeason[] = subSeasons.data;
              const subsForm = [];
              if (subs && subs.length > 0) {
                const segmentType = subs[0].segmentType;
                for (let sub of subs) {
                  // TODO sometimes they are different completely (objects)
                  const sameTimes = _.isEqual(
                    sub.activityTimes,
                    this.programsFormService.seasonForm.get("activityTimes").value,
                  );
                  subsForm.push({
                    index: sub.id,
                    name: sub.name,
                    startDate: sub.startDate,
                    endDate: sub.endDate,
                    useSeasonDayTime: sameTimes,
                    editing: false,
                    activityTimes: [...this.createActivityTimes(sub.activityTimes)],
                    segmentType: segmentType,
                  });
                }
                this.programsFormService.seasonForm.patchValue({ subSeasons: [...subsForm] });
              }
            });

            // Get season products if the season loaded successfully
            console.log("pricing loading");
            this.loadingPricing.next(true);
            this.getProductsBySeason(seasonId).subscribe(
              (res) => {
                if (res) {
                  this.programsFormService.productsForm.patchValue({
                    products: [...res],
                  });
                  if (res.length > 0) {
                    this.getAddOnsByProductId(Number(res[0].id)).subscribe(async (addons) => {
                      if (addons) {
                        const tempAddons = [];
                        for (let addon of addons.children) {
                          tempAddons.push(addon.product);
                        }
                        this.programsFormService.productsForm.patchValue({
                          addons: tempAddons,
                        });
                        this.currentPricing.next({
                          products: [...res],
                          addons: tempAddons,
                        });
                        console.log("pricing loading completed");
                        this.loadingPricing.next(false);
                      }
                    });
                  }
                }
              },
              (err) => {
                this.loadingPricing.next(false);
                console.error("pricing loading failed", err);
              },
            );
          }
        },
        (err) => {
          this.clearPrgSeasonValues();
          this.loadingSeason.next(false);
          console.error("seasons loading failed", err);
        },
      );
    }
  };

  reset = (programReset: boolean, seasonReset: boolean) => {};

  processAddOnResp = (resp: any[]) => {
    if (!resp) return [];

    const convertedResp: AddOnItem[] = [];
    for (let i = 0; i < resp.length; i++) {
      const convertedItem: AddOnItem = {
        index: resp[i].id,
        name: resp[i].name,
        price: resp[i].prices[0].price,
        active: true,
        editing: false,
        new: false,
      };
      convertedResp.push({ ...convertedItem });
    }
    return convertedResp;
  };

  getOrgId = () => {
    if (!this.currentOrganization.getValue()) return undefined;
    return this.currentOrganization.getValue().id;
  };

  getPrgId = () => {
    if (!this.currentProgram.getValue()) return undefined;
    return this.currentProgram.getValue().id;
  };

  getSeasonId = () => {
    if (!this.currentSeason.getValue()) return undefined;
    return this.currentSeason.getValue().id;
  };

  getProgramType = () => {
    if (!this.currentProgramType.getValue()) return undefined;
    return this.currentProgramType.getValue();
  };

  getProgramTypeParam = () => {
    if (!this.currentProgramTypeParam.getValue()) return undefined;
    return this.currentProgramTypeParam.getValue();
  };

  getProgramStatus = () => {
    if (!this.currentProgram.getValue()) return undefined;
    return this.currentProgram.getValue().status;
  };

  setOrganizationVenues = (venues: RCVenue[]) => {
    this.currentOrganizationVenues.next([...venues]);
  };

  handleProgramTypeUrlChange(programType: string) {
    this.currentProgramTypeParam.next(programType);
    if (this.getProgramTypeParam() !== "classes") {
      this.currentProgramType.next(this.getProgramTypeParam().slice(0, -1));
    } else {
      this.currentProgramType.next(this.getProgramTypeParam().slice(0, -2));
    }
  }

  createProgram(data: RCCreateProgramData) {
    return this.http.post<any>(`${environment.CS_URLS.API_ROOT}/programs`, data).pipe(map((response) => response));
  }

  changePublishingStatusOfProgram(programId: number, status: ProgramSeasonStatusEnum) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}/status`, { status })
      .map((response) => response);
  }

  updateProgram(data: RCCreateProgramData) {
    return this.http.put<any>(`${environment.CS_URLS.API_ROOT}/programs`, data).map((response) => response);
  }

  getProgramTypesInUse = (organizationId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/organization/${organizationId}`)
      .map((response) => response);
  };

  getProgramsInOrganizationByType = (organizationId: number, programType: ProgramTypeEnum) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/organization/${organizationId}/${programType}`)
      .map((response) => response);
  };

  getProgramById(id: number): Observable<RCServerResponse<RCProgram>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/${id}`)
      .map((response) => response)
      .map((response) => {
        return response;
      });
  }

  setCurrentSeason(season: RCProgramSeason) {
    const at = season.activityTimes;
    for (let a of at) {
      a.open = moment(a.open, "HH:mm:ss").format("HH:mm");
      a.close = moment(a.close, "HH:mm:ss").format("HH:mm");
    }
    this.programsFormService.seasonForm.patchValue({
      name: season.name,
      status: season.status,
      seasonType: season.seasonType,
      startDate: season.startDate,
      endDate: season.endDate,
      description: season.description,
      longDescription: season.longDescription,
      registrationStartDate: season.registrationStartDate,
      registrationEndDate: season.registrationEndDate,
      maxParticipants: season.maxParticipants,
      maxMaleParticipants: season.maxMaleParticipants,
      maxFemaleParticipants: season.maxFemaleParticipants,
      maxWaitlist: season.maxWaitlist,
      maxMaleWaitlist: season.maxMaleWaitlist,
      maxFemaleWaitlist: season.maxFemaleWaitlist,
      addressId: season.addressId,
      facilityId: season.facilityId,
      blockedDated: season.blockedDated,
      activityTimes: [...at],
      subSeasons: season.subSeasons,
      questionnaires:
        season.questionnaires && season.questionnaires.length ? season.questionnaires[0] : season.questionnaires,
      products: season.products ? [...season.products] : [],
      isPunchCard: season.isPunchCard,
    });
  }

  setCurrentProgram(program: RCProgram) {
    this.currentProgram.next(program);
    this.programsFormService.programForm.patchValue({
      sports: program.sport,
      levelOfPlay: program.level,
      gender: program.gender,
      name: program.name,
      ageRange: [
        program.minAge.toLowerCase().includes(" m") || program.minAge.toLowerCase().includes(" y")
          ? program.minAge.substring(0, program.minAge.length - 2)
          : program.minAge,
        program.maxAge.toLowerCase().includes(" m") || program.maxAge.toLowerCase().includes(" y")
          ? program.maxAge.substring(0, program.maxAge.length - 2)
          : program.maxAge,
      ],
      description: program.description,
      longDescription: program.longDescription,
      mainImage: program.mainMedia,
      programHighlights: program.programHighlights,
    });
  }

  getSeasonById(seasonId: number): Observable<RCServerResponse<RCProgramSeason>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/season/${seasonId}`)
      .map((response) => response)
      .map((response) => {
        // this.setCurrentSeason(response.data);
        this.currentSeason.next(response.data);
        return response;
      });
  }

  getSeasonStatistics(programId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches/statistics`)
      .map((response) => response);
  }

  getSeasonMatches(programId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches`)
      .map((response) => response);
  }

  getSeasonEvents(seasonId: number): Observable<RCServerResponse<RCEvent[]>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/events/${seasonId}`)
      .map((response) => response)
      .map((response) => {
        return response;
      });
  }

  getSeasonQuestionsReport(programId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/questionnaire/report`, {
        responseType: "blob",
      } as any)
      .map((response) => {
        return response;
      });
  }

  getScheduleReport(programId: number, seasonId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/download-spreadsheet-schedule`,
        {
          responseType: "blob",
        } as any,
      )
      .map((response) => {
        return response;
      });
  }

  getSeasonParticipantsReport(programId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/participants/report`, {
        responseType: "blob",
      } as any)
      .map((response) => {
        return response;
      });
  }

  bulkPublishSeasonMatches(programId: number, seasonId: number, ids: number[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches/publish`, {
        eventIds: ids,
      })
      .map((response) => response);
  }

  bulkCancelSeasonMatches(programId: number, seasonId: number, data: { eventId: number; roundId: number }[]) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches`, {
        params: {
          events: data as any,
        },
      })
      .map((response) => response);
  }

  bulkMatchesUpdate(programId: number, seasonId: number, data: any[]) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches`, {
        events: data,
      })
      .map((response) => response);
  }

  bulkScoreUpdate(
    programId: number,
    seasonId: number,
    data: { eventId: number; status: number; participants: any[] }[],
  ) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/matches/scores`, {
        events: data,
      })
      .map((response) => response);
  }

  getSeasonTeams(programId: number, seasonId: number, query?: object): Observable<RCServerResponse<RCSeasonTeam[]>> {
    const reqQuery = query || {};

    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/teams?${serialize(reqQuery)}`)
      .map((response) => response)
      .map((response) => {
        response.data = response.data.map((i) => {
          i.captain = this.findTeamCaptain(i.team);

          return i;
        });

        return response;
      });
  }

  getSeasonRounds(programId: number, seasonId: number, roundId: number): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/rounds/${roundId}?datascope=full`,
      )
      .map((response) => response);
  }

  reAssignTeamMember(programId: number, seasonId: number, data: ReAssignTeamMemberBody): Observable<any> {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/teams/reassign`, data)
      .map((response) => response);
  }

  updateSeasonMatch(
    programId: number,
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
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/rounds/${roundId}/match/${matchId}`,
        body,
      )
      .map((response) => response);
  }

  removeTeamAssignment(teamId: number, divisionId: number, prevDivisionId: number) {
    return this.http
      .put(`${environment.CS_URLS.API_ROOT_V3}/programseason/group-to-division`, {
        groupId: teamId,
        divisionId: divisionId,
        prevDivisionId,
      })
      .map((response) => response);
  }

  restorePoolEntity(programId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/participants/${poolId}/restore`,
        {},
      )
      .map((response) => response);
  }

  removePoolEntity(programId: number, seasonId: number, poolId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/participants/${poolId}`)
      .map((response) => response);
  }

  getSeasonPlayer(
    programId: number,
    seasonId: number,
    userId: number,
  ): Observable<RCServerResponse<SeasonPlayerResponseObject>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/players/${userId}`)
      .map((response) => response);
  }

  /*cancelSeasonMatch(roundId: number, matchId: number) {
    return (
      this.http
        // tslint:disable-next-line
        .delete(
          `${environment.CS_URLS.API_ROOT}/leagues/${this.currentProgramId}/season/${this.currentSeasonId}/rounds/${roundId}/match/${matchId}`,
        )
        .map((response) => response)
    );
  }*/

  createSeasonGroup(body: CreateGroup): Observable<any> {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/programseason/group`, body)
      .map((response) => response);
  }

  uploadLeagueMedia(file: FileItem, programId: number, type: "main" | "logo" = "main") {
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
          `${environment.CS_URLS.API_ROOT}/leagues/${programId}/uploadMedia?handleType=${type}`,
          {
            file: fileObject,
          },
        );
      }),
    );
  }

  /**
   * Uploads a program media
   * default type of the media equals to main media
   * @param file
   * @param programId
   * @param type - available types are 'logo' and 'main'
   * @returns {Observable<R>}
   */
  uploadProgramMedia = (file: FileItem, programId: number, type: "main" | "logo" = "main") => {
    return this.imagesService.uploadFileItemImage(file).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}/uploadMedia`, {
          file: fileObject,
          handleType: type,
        });
      }),
    );
  };

  /*assignTeamToSeason(teamId: number): Observable<RCServerResponse<RCTeam>> {
    const createSubject = {
      createTeam: {
        create: false,
      },
      teamId,
    };

    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.currentProgramId}/season/${this.currentSeasonId}/teams`,
        createSubject,
      )
      .map((response) => response);
  }*/

  createRound(body: {
    name: string;
    ordinal: number;
    divisionId: number;
  }): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${this.getPrgId()}/season/${this.getSeasonId()}/rounds`, body)
      .map((response) => response);
  }

  updateRound(roundId: number, body: { name: string; ordinal: number }): Observable<RCServerResponse<RCSeasonRound>> {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.getPrgId()}/season/${this.getSeasonId()}/rounds/${roundId}`,
        body,
      )
      .map((response) => response);
  }

  removeRound(roundId: number) {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT}/leagues/${this.getPrgId()}/season/${this.getSeasonId()}/rounds/${roundId}`,
      )
      .map((response) => response);
  }

  getSeasonStandings(programId: number, seasonId: number): Observable<RCServerResponse<RCStandingFetchResult[]>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/standings`)
      .map((response) => response);
  }

  getSeasonPool(): Observable<RCServerResponse<RCSeasonPoolParticipant[]>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/${this.getPrgId()}/season/${this.getSeasonId()}/participants`)
      .map((response) => response);
  }

  assignPlayerToGroup(userId: number, groupId?: number, prevGroupId?: number): any {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT_V3}/programseason/user-to-group`, {
        userId,
        groupId,
        prevGroupId,
      })
      .map((response) => response);
  }

  removePlayerFromTeam(teamId: number, userId: number): any {
    return this.http
      .delete(
        `${
          environment.CS_URLS.API_ROOT
        }/leagues/${this.getPrgId()}/season/${this.getSeasonId()}/teams/${teamId}/members/${userId}`,
      )
      .map((response) => response);
  }

  createSeason = (season: any) => {
    const transformSeason = season;
    const transformBlocked = [];
    const transformSubSeason = [];

    transformSeason.status = 1;
    transformSeason.seasonType =
      ProgramTypeEnum[
        this.getProgramType().toUpperCase() !== "CLUB" ? this.getProgramType().toUpperCase() : "CLUB_TEAM"
      ];

    transformSeason.startDate = this.datePipe.transform(season.startDate, "yyyy-MM-dd");
    transformSeason.endDate = this.datePipe.transform(season.endDate, "yyyy-MM-dd");

    transformSeason.registrationStartDate = this.datePipe.transform(season.registrationStartDate, "yyyy-MM-dd");
    transformSeason.registrationEndDate = this.datePipe.transform(season.registrationEndDate, "yyyy-MM-dd");

    if (transformSeason.blockedDated) {
      transformSeason.blockedDated.forEach((bd) => {
        if (bd.active)
          transformBlocked.push({
            name: bd.name,
            startDate: bd.startDate,
            endDate: bd.finishDate,
          });
      });
      transformSeason.blockedDated.splice(0, transformSeason.blockedDated.length, ...transformBlocked);
    }

    if (transformSeason.subSeasons) {
      transformSeason.subSeasons.forEach((s) => {
        transformSubSeason.push({
          name: s.name,
          startDate: this.datePipe.transform(s.startDate, "yyyy-MM-dd"),
          endDate: this.datePipe.transform(s.endDate, "yyyy-MM-dd"),
        });
      });
      transformSeason.subSeasons = [...transformSubSeason];
    }

    for (let key in transformSeason) {
      if (transformSeason.hasOwnProperty(key) && !transformSeason[key]) delete transformSeason[key];
    }
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs/${this.getPrgId()}/season`, transformSeason)
      .pipe(map((response) => response));
  };

  updateSeason(season: RCProgramSeason) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/programs/${this.getPrgId()}/season`, season)
      .map((response) => response);
  }

  publishSeason(programId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/publish`, {})
      .map((response) => response);
  }

  publishSeasonRoster(programId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/publish-roster`, {})
      .map((response) => response);
  }

  publishSeasonSchedule(programId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/publish-schedule`, {})
      .map((response) => response);
  }

  sendInvites(programId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/invite-schedule`, {})
      .map((response) => response);
  }

  createTournamentSuggest(
    tournamentId: number,
    data: RCTournamentScheduleSuggestCreate,
    seasonId?: number,
    programId?: number,
  ) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId || this.getPrgId()}/season/${
          seasonId || this.getSeasonId()
        }/tournament-events/${tournamentId}/suggest`,
        data,
      )
      .map((response) => response);
  }

  bulkSeasonTeamAssign(programId: number, seasonId: number, teamIds: number[]) {
    const data = teamIds.map((i) => {
      return {
        teamId: i,
        createTeam: {
          create: false,
        },
      };
    });

    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/teams/bulk`, { teams: data })
      .map((response) => response);
  }

  bulkBracketsAssignment(programId: number, seasonId: number, data: RCSeriesBulkUpdateObject[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/series/bulk-update`, {
        series: data,
        handleWithSeasonTeams: true,
      })
      .map((response) => response);
  }

  updateSeasonTeamScheduleRequests(programId: number, seasonId: number, teamId: number, scheduleRequests) {
    return this.http
      .patch(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/teams/${teamId}`, {
        scheduleRequests,
      })
      .map((response) => response);
  }

  updateSeasonTeamDivision(teamId: number, prevDivisionId: number, divisionId?: number) {
    return this.http
      .put(`${environment.CS_URLS.API_ROOT_V3}/programseason/group-to-division`, {
        groupId: teamId,
        divisionId,
        prevDivisionId,
      })
      .map((response) => response);
  }

  unpublishLeague(programId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/unpublish`, {})
      .map((response) => response);
  }

  deleteLeague(programId: number) {
    return this.http.delete(`${environment.CS_URLS.API_ROOT}/leagues/${programId}`).map((response) => response);
  }

  deleteSeason(programId: number, seasonId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}`)
      .map((response) => response);
  }

  unpublishSeason(programId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/unpublish`, {})
      .map((response) => response);
  }

  updateDivisions(data: CreateDivision[]) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/programseason/divisions`, { divisions: [...data] })
      .map((response) => response);

    /*return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/divisions/bulk`, {
        divisions,
      })
      .map((response) => response);*/
  }

  getDivisionsBySeason(seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/programseason/${seasonId}/divisions`)
      .map((response) => response);
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
    let name, description;

    if (data.basicInfo) {
      name = data.basicInfo.name;
      description = data.basicInfo.description;
    }

    const { startDate, endDate } = data.creatorSchedule;
    const early = data.creatorSchedule.earlyBirdRegistration;
    const regular = data.creatorSchedule.regularRegistration;
    const late = data.creatorSchedule.lateRegistration;

    const season: RCLeagueSeason = {
      name,
      description,
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
      EarlySingle: null,
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

  markPaymentAsSettled(programId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/participants/${poolId}/payment-settled`,
        {},
      )
      .map((response) => response);
  }

  markPaymentAsUnSettled(programId: number, seasonId: number, poolId: number) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/season/${seasonId}/participants/${poolId}/payment-settled`,
        {
          setPending: true,
        },
      )
      .map((response) => response);
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

  getParticipantsFromSeason = (seasonId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/attendees/${this.getSeasonId()}?isFreeAgentsOnly=true`)
      .map((response) => response);
  };

  getRegisteredUserInfo = (userId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/attendees/${this.getSeasonId()}/${userId}`)
      .map((response) => response);
  };

  createSeasonProducts = (data: RCProgramProducts) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/products`, data)
      .pipe(map((response) => response));
  };

  getSeasonsByProgram = (programId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}/seasons`)
      .pipe(map((response) => response));
  };

  clearProgramValues = () => {
    this.currentProgram.next(undefined);
    this.programsFormService.programForm.reset({ ...this.programsFormService.defaultProgramForm });
  };

  clearPrgSeasonValues = () => {
    this.seasonEdit.next(undefined);
    this.currentSeason.next(undefined);
    this.programsFormService.seasonForm.reset({
      ...this.programsFormService.defaultPrgSeasonForm,
      subSeasons: [],
      blockedDated: [],
      products: [],
    });
    this.clearPrgSeasonProds();
  };

  clearPrgSeasonProds = () => {
    this.currentPricing.next(undefined);
    this.programsFormService.productsForm.reset({ products: [], addons: [] });
  };

  createActivityTimes = (times: ActivityTimes[]) => {
    if (times) {
      const tempWeek: ActivityTimes[] = [...defaultWeek];
      const doneWeek: DaysOfWeek[] = [];
      tempWeek.forEach((day: { dayOfWeek: number; open: string; close: string }) =>
        doneWeek.push({
          index: day.dayOfWeek,
          startTimeValue: day.open,
          finishTimeValue: day.close,
          active: false,
        }),
      );
      if (times.length > 0) {
        times.forEach((time) => {
          const idx = doneWeek.findIndex((t) => time.dayOfWeek === t.index);
          if (idx > -1) {
            doneWeek.splice(idx, 1, {
              index: time.dayOfWeek,
              active: true,
              startTimeValue: time.open.slice(0, -3),
              finishTimeValue: time.close.slice(0, -3),
            });
          }
        });
      }
      return doneWeek;
    } else {
      return [];
    }
  };

  getSubSeasons = (seasonId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/segments/${seasonId}`)
      .pipe(map((response) => response));
  };

  setSubSeasons = (subSeasons: { name: string; startDate: string; endDate: string }[]) => {
    this.programsFormService.seasonForm.patchValue({ subSeasons: [...subSeasons] });
  };

  // save product individually, for updates
  saveProgramProduct = (product: RCProgramProduct) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/product`, product)
      .pipe(map((response) => response));
  };

  // save products + add ons together, for creates
  saveProgramProducts = (products: RCProgramProduct[], addOns: RCProgramAddOn[]) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/products`, {
        products: products || [],
        addOnsData: addOns || [],
      })
      .pipe(map((response) => response));
  };

  getProductsBySeason = (seasonId: number) => {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/productPricing/product/resource/program_season/${seasonId}/true/true`,
      )
      .pipe(map((response) => response));
  };

  getLeagueProductsBySeason = (seasonId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/product/resource/season/${seasonId}/true/true`)
      .pipe(map((response) => response));
  };

  getAddOnsByProductId = (productId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/product/${productId}/package`)
      .pipe(map((response) => response));
  };

  getSpaceAllocations = (seasonId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/season/${seasonId}/allocation`)
      .pipe(map((response) => response));
  };

  // Save every event for each season session allocated to a space
  saveSpaceAllocations = (seasonId: number, spaceAllocations: any[]) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs/season/${seasonId}/allocation`, {
        spaceAllocations: spaceAllocations,
      })
      .pipe(map((response) => response));
  };

  payPartialBalance = (userId: number, orderId: number, amount: number, organizationId: number) => {
    const data = {
      orderId: orderId,
      amountToPay: amount,
      organizationId,
      payingUserId: userId,
    };
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V3}/purchase/partial-payment`, data)
      .pipe(map((response) => response));
  };

  setCurrentTeams(teams: any[]) {
    this.currentTeams.next(teams);
  }

  makeCaptain(groupId: number, userId: number) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT_V3}/programseason/captain-to-group`, {
        groupId: groupId,
        userId: userId,
      })
      .map((response) => response);
  }

  getEventDates = (startDate: string, endDate: string, activityTimes: ActivityTimes, blockedDated: any) => {
    const data = {
      startDate,
      endDate,
      activityTimes,
      blockedDated,
    };
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs/season/get-dates`, data)
      .pipe(map((response) => response));
  };

  setSeasonEdit = (editType: undefined | "shallow" | "full") => {
    if (editType !== undefined) this.programsFormService.seasonShallowUpdateForm.patchValue({ id: this.getSeasonId() });
    if (editType === undefined)
      this.programsFormService.seasonShallowUpdateForm.patchValue({
        ...this.programsFormService.defaultShallowUpdateForm,
      });
    this.seasonEdit.next(editType);
  };

  getSeasonEdit = () => {
    return this.seasonEdit.getValue();
  };

  shallowSeasonUpdate(updateData: any) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/programs/1/season/1/shallow-update`, { ...updateData })
      .map((response) => response);
  }

  editFlowGuard = () => {
    if (!this.programsFormService.seasonForm.get("name").value) {
      /*
      const prgId = this.activeRoute.snapshot.params["programId"];
      const seasId = this.activeRoute.snapshot.params["seasonId"];
      const type = this.activeRoute.snapshot.params["programType"];

      this.router.navigate(["/client/programs/" + type + "/" + prgId + "/season/" + seasId + "/basic"]);
*/
    }
  };

  getResourcesFromMembership = (membershipId: number) => {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/productPricing/product/resource/membership/${membershipId}/true/true`,
      )
      .map((response) => {
        return response;
      });
  };

  getMembershipsFromResources = (productId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/product/${productId}/resources`)
      .map((response) => {
        return response;
      });
  };

  getResourceWrapper = async (membershipId: number) => {
    return this.getResourcesFromMembership(membershipId).toPromise();
  };

  getMembershipsWrapper = async (productId: number) => {
    return this.getMembershipsFromResources(productId).toPromise();
  };

  convertMembershipToResource = async (memberships: number[]) => {
    const converted = [];
    for (let m of memberships) {
      const res = await this.getResourceWrapper(m);
      converted.push(res[0].id);
    }
    return converted;
  };

  convertResourceToMembership = async (products: number[]) => {
    const converted = [];
    for (let p of products) {
      const res = await this.getMembershipsWrapper(p);
      converted.push(res[0].resourcesIds[0]);
    }
    return converted;
  };
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

export const defaultWeek = [
  {
    dayOfWeek: 2,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 3,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 4,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 5,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 6,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 7,
    open: "06:00",
    close: "23:00",
  },
  {
    dayOfWeek: 8,
    open: "06:00",
    close: "23:00",
  },
];
