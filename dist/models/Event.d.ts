import { RCMediaObject } from './Media';
import { RCAddress } from './Address';
import { RCGenderEnum, RCUser } from './User';
import { RCEntities } from './Utils';
import { RCTeam } from './Team';
import { RCSeasonEventMatchData } from './Leagues';
export declare enum EventStatus {
    OPEN = 1,
    DRAFT = 2,
    FULL = 3,
    CANCELLED = 4,
    CLOSED = 5,
    DELETED = 6,
}
export declare enum RCEventAttendeeStatus {
    PENDING = 1,
    ACCEPTED = 2,
    DECLINED = 3,
    REJECTED = 4,
}
export interface RCEventAttendee {
    id: number;
    isMe?: boolean;
    user: RCUser;
    attendeeId: number;
    following?: boolean;
    teamId?: number;
    teamName?: string;
    status?: RCEventAttendeeStatus;
    hasPaid?: boolean;
}
export interface RCPoolItemAnswer {
    id: number;
    answerType: 'draw' | 'team';
    text: string;
    pollId: number;
    voteCount: number;
    coins: number;
    parent?: {
        entityId: number;
        entity: RCTeam;
    };
}
export interface RCPoolUserAnswer {
    answerId: number;
    coins: number;
    id: number;
    pollId: number;
    userId: number;
    outcome?: string;
    status?: 'pending' | 'won' | 'lost';
}
export interface RCPoolItem {
    coinMultiplier: number;
    creatorId: number;
    id: number;
    maxCoins?: number;
    minCoins?: number;
    parent?: any;
    parentId: number;
    parentType: RCEntities;
    pollType: 'matchBet' | 'tournamentBet';
    status: 'open' | 'close';
    text?: string;
    possibleAnswers: RCPoolItemAnswer[];
    userAnswer: RCPoolUserAnswer;
    userAnswers: RCPoolUserAnswer[];
    expDate?: Date;
}
export declare enum RCEventType {
    PICK_UP = 2,
    LEAGUE_MATCH = 3,
    FRIENDLY_MATCH = 4,
    PRACTICE = 5,
    GENERAL = 6,
}
export interface RCEvent {
    id?: number;
    levelOfPlay?: number[];
    poll?: RCPoolItem;
    paymentSettings?: {
        allowCash?: boolean;
        onlinePaymentEnabled?: boolean;
    };
    participantsLimit?: number;
    mainMedia?: RCMediaObject;
    title?: string;
    description?: string;
    creatorId?: number;
    creator: RCUser;
    startDate?: Date | string;
    endDate?: Date | string;
    price?: number;
    venueName?: string;
    venueId?: number;
    status?: EventStatus;
    private?: boolean;
    guestsCanInvite?: boolean;
    sports?: number[];
    address?: RCAddress;
    participating?: boolean;
    following?: boolean;
    timezone?: string;
    eventAttendees?: RCEventAttendee[];
    match?: RCSeasonEventMatchData;
    inviteId?: number;
    attending?: boolean;
    isCreator?: boolean;
    isInvited?: boolean;
    inviterName?: string;
    canJoin?: RCEventJoinEnum;
    redirectUri?: string;
    isRedirect?: boolean;
    isPlayoff?: boolean;
    seasonMaxRoundNumber?: number;
    seasonRoundNumber?: number;
    minAge?: number;
    maxAge?: number;
    gender?: RCGenderEnum;
    eventAttendeesCount?: number;
    eventType?: RCEventType;
    isPastMatch?: boolean;
    questionnaireId?: number;
}
export declare enum RCEventJoinEnum {
    CAN_JOIN = 0,
    CANNOT_ALREADY_ATTENDEE = 1,
    CANNOT_JOIN_FULL = 2,
    CANNOT_JOIN_INACTIVE = 3,
    CANNOT_JOIN_NO_NEW = 4,
}
