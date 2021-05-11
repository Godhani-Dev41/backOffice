import { RCMediaObject } from './Media';
import { RCAddress } from './Address';
import { RCEvent } from './Event';
import { RCTeam } from './Team';
import { RCUser } from './User';
import { RCEntities } from './Utils';
import { RCCreator, RCVenue } from './';
import { RCWebPortal, RCPaymentSettingStatus } from './Organization';
export interface RCSeasonVenue {
    id: number;
    seasonId: number;
    venueId: number;
    venue: RCVenue;
}
export declare enum RCLeagueDetailTypeEnum {
    OTHER = 1,
    MINAGE = 2,
    MAXAGE = 3,
    GENDER = 4,
    LEVELOFPLAY = 5,
    GAMESSEASON = 6,
    MINWEEK = 7,
    SURFACE = 8,
    FORMAT = 9,
    PLAYERSPERTEAM = 10,
    MATCHLENGTH = 12,
}
export declare enum RCLeagueSeasonStatusEnum {
    UNPUBLISHED = 1,
    PUBLISHED = 2,
    CLOSED = 3,
    CANCELLED = 4,
}
export declare enum RCLeagueSeasonRegistrationStatusEnum {
    UNAVAILABLE = 1,
    OPEN = 2,
    FULLYBOOKED = 3,
    ENDED = 4,
}
export interface IRCLeagueSubscription {
    type: 'team' | 'freeAgent' | 'teamPerPlayer';
    answers?: {
        questionId: number;
        answer: any;
    }[];
    installments?: number;
}
export interface IRCLeagueActivity {
    dayOfWeek: number;
    open: string;
    close: string;
}
export interface IRCLeagueDetail {
    id?: number;
    leagueId?: number;
    detailType: RCLeagueDetailTypeEnum;
    title?: string;
    ordinal?: number;
    createdAt?: string;
    updatedAt?: string;
    data?: any;
    isCustom?: boolean;
}
export interface RCActivityTime {
    id?: number;
    parentType: 'venue' | 'season' | 'league';
    parentId: number;
    dayOfWeek: number;
    open: string;
    close: string;
    packageStartHours?: string[];
}
export declare enum RCLeagueBookingStateEnum {
    BOOK_BY_EMAIL = 1,
    BOOK_DIRECTLY = 2,
    NO_BOOKING = 3,
    REDIRECT = 4,
}
export declare enum RCSeasonPoolStatusEnum {
    IN_POOL = 5,
    ASSIGNED = 1,
    QUIT = 2,
    SUSPENDED = 3,
    INACTIVE = 4,
}
export declare enum RCPaymentStatus {
    SENT_TO_CLIENT = 1,
    SENT_FOR_PAYMENT = 2,
    ACCEPTED = 3,
    REJECTED = 4,
    CANCELLED = 5,
    FRAUD = 6,
    NOT_RELEVANT = 7,
    PENDING = 8,
}
export interface RCSeasonPoolParticipant {
    id: number;
    entityId?: number;
    entityType: 'team' | 'user';
    metadata: any;
    paymentStatus: RCPaymentStatus;
    seasonId: number;
    leagueSeason?: RCLeagueSeason;
    status: RCSeasonPoolStatusEnum;
    createdAt: Date;
    userId: number;
    groupId: number;
    userEntity?: RCUser;
    teamEntity?: RCTeam;
}
export interface RCLeague {
    GL: string;
    id: number;
    sports: number[];
    maxAge: number;
    minAge: number;
    name: string;
    creator?: RCUser;
    startDate: Date;
    endDate: Date;
    isPublished: boolean;
    mainMedia?: RCMediaObject;
    logo?: RCMediaObject;
    address?: RCAddress;
    addressName?: string;
    description?: string;
    shortDescription?: string;
    waiverDoc?: string;
    leagueSeasons: RCLeagueSeason[];
    leagueDetails: IRCLeagueDetail[];
    levelOfPlay: number[];
    following: boolean;
    timezone: string;
    bookingStateStatus: RCLeagueBookingStateEnum;
    teams?: RCTeam[];
    venues?: RCVenue[];
    shortUrl?: string;
    leagueType?: 'tournament' | 'league';
    webPortal?: RCWebPortal;
    sportConfigData?: {
        standingsView?: {
            pointsOrPercentageView: 'points' | 'percentage';
        };
    };
    questionnaireId?: number;
}
export declare enum RCEventMatchStatusEnum {
    PENDING = 1,
    ACTIVE = 2,
    CANCELLED = 3,
}
export interface RCMatchParticipants {
    id?: number;
    matchId?: number;
    ordinal?: number;
    outcomeOrdinal?: number;
    resultMetaData?: any;
    points?: number;
    gameSlotId?: number;
    participants?: number;
    participantId?: number;
    score?: number;
}
export interface RCSeasonEventMatchData {
    id?: number;
    status?: RCEventMatchStatusEnum;
    eventId?: number;
    participants?: Array<{
        id?: number;
        score?: number;
        points?: number;
        entity?: {
            id: number;
            entityType: RCEntities;
            name: string;
            logo?: RCMediaObject;
            mainMedia: RCMediaObject;
        };
    }>;
}
export interface RCSeasonRoundMatch extends RCEvent {
    match: RCSeasonEventMatchData;
    requestsStatus?: {
        valid: boolean;
        reasons?: {
            participantId: number;
            participantName: string;
            participantType: RCEntities;
        }[];
    };
}
export interface RCSeasonRound {
    id: number;
    name: string;
    ordinal: number;
    seasonId: number;
    createdAt: string;
    matches: RCSeasonRoundMatch[];
    series?: RCSeasonSeries[];
    divisionId?: number;
}
export declare enum RCCanJoinSeasonEnum {
    CAN_JOIN = 0,
    CANNOT_ALREADY_IN_SEASON = 1,
    CANNOT_MISSING_ORGANIZATION_SUBSCRIPTION = 2,
    CANNOT_SEASON_STATUS = 3,
}
export declare enum RCSeasonCanJoinStatus {
    REGISTRATION_OPEN_NOW_PLAYING,
    REGISTRATION_OPEN,
    NOW_PLAYING,
    REGISTRATION_ENDED,
    ENDED,
}
export interface RCLeagueSeason {
    inviteSendDate?: Date;
    seasonTiming?: 'current' | 'future' | 'past';
    registrationTiming?: 'early' | 'regular' | 'late' | 'close' | 'ended';
    startDate: Date;
    endDate: Date;
    id?: number;
    activityTimes: RCActivityTime[];
    leagueId?: number;
    name: string;
    canJoin?: RCCanJoinSeasonEnum;
    canJoinStatus?: RCSeasonCanJoinStatus;
    status?: RCLeagueSeasonStatusEnum;
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
    seasonLeague?: RCLeague;
    seasonVenues?: RCVenue[];
    seasonTeams?: RCSeasonTeam[];
    tournamentType?: boolean;
    subSeasons?: RCLeagueSeason[];
    playoffType?: boolean;
    playerCount?: number;
    seasonDivisions?: RCSeasonDivision[];
    tournament?: {
        tournamentConfig?: any;
        name: string;
        id: number;
        tournamentType: 'singleElimination' | 'doubleElimination';
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
                orderType?: 'top' | 'bottom';
            };
        };
    };
    installments?: number;
    onlinePaymentEnabled?: boolean;
    allowCash?: boolean;
    paymentSettingStatus?: RCPaymentSettingStatus;
    canJoinTeamMember?: boolean;
    canJoinTeamMemberId?: number;
    parentSeason?: RCLeagueSeason;
}
export declare enum RCSeasonScheduleStatusEnum {
    DRAFT,
    PUBLISHED,
}
export declare enum RCSeasonRosterStatusEnum {
    DRAFT,
    PUBLISHED,
}
export interface RCVenueActivityItem {
    address?: RCAddress;
    addressId?: number;
    activityTime: RCActivityTime;
    concurrent?: number;
    venueId?: number;
    venueName?: string;
    seasonId?: number;
    id?: number;
    packageStartHours?: string[];
}
export interface RCSeasonSeries {
    id: number;
    isBye: boolean;
    looseSeriesId: number;
    ordinal: number;
    roundId: number;
    tournamentId: number;
    winSeriesId: number;
    matches: RCSeasonRoundMatch[];
    seriesParticipants: RCMatchParticipants[];
}
export interface RCUserInvite {
    id: number;
    token: string;
    invitedUserEmail: string;
    invitedUserPhone: string;
    invitedUserId: number;
    createdLink: string;
    name: string;
    userCreatorId: number;
    createdAt: string;
    status?: number;
    user?: RCUser;
    creatorType?: string;
    creator?: RCCreator;
    creatorId?: number;
}
export interface RCSeasonTeamRequest {
    dayOfWeek: number;
    open: string;
    close: string;
    requestType: 'can' | 'cant';
}
export interface RCSeasonTeam {
    id: number;
    seasonId: number;
    team: RCTeam;
    teamId: number;
    userInvites: RCUserInvite[];
    divisionId?: number;
    metaData?: {
        scheduleRequests?: RCSeasonTeamRequest[];
    };
    captain?: RCUser;
}
export interface RCSeasonDivision {
    id?: number;
    name: string;
    ordinal: number;
    color: string;
    rounds?: RCSeasonRound[];
    seasonTeams?: RCSeasonTeam[];
}
