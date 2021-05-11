import { RCMembership } from './Organization';
import { RCMediaObject } from './Media';
import { RCEvent } from './Event';
import { RCAddress } from './Address';
import { RCQuestionObject } from './Questions';
import { RCGenderEnum, RCGenderStringLabel, RCUser } from './User';
import { RCLeagueDetailTypeEnum, RCPaymentStatus, RCSeasonPoolParticipant } from './Leagues';
import { RCEntities } from './Utils';
import { RCLeagueSeason } from './';
export declare enum RCTeamMemberRoleEnum {
    ADMIN = 1,
}
export interface RCTeamEvent {
    id: number;
    event: RCEvent;
}
export interface RCTeamMember {
    notRegistered?: boolean;
    canUnassign?: boolean;
    paymentStatus?: RCPaymentStatus;
    status: RCTeamMemberStatusEnum;
    user: RCUser;
    following?: boolean;
    isPending?: boolean;
    teamId?: number;
    userId?: number;
    isCreator?: boolean;
    role: RCTeamMemberRoleEnum;
}
export declare enum RCTeamMemberStatusEnum {
    PENDING = 1,
    ACTIVE = 2,
    DECLINED = 3,
    SUSPENDED = 4,
    INACTIVE = 5,
    INVITED = 6,
}
export declare enum RCTeamJoinEnum {
    CAN_JOIN = 0,
    CANNOT_ALREADY_MEMBER = 1,
    CANNOT_JOIN_FULL = 2,
    CANNOT_JOIN_INACTIVE = 3,
    CANNOT_JOIN_NOT_RECRUITING = 4,
    CLOSED_CAN_REQUEST_TO_JOIN = 5,
}
export interface RCTeamSeason {
    id?: number;
    leagueSeason?: RCLeagueSeason;
    teamId: number;
    standingPosition?: number;
    seasonId?: number;
    team?: RCTeam;
}
export declare enum RCTeamPrivacySettingEnum {
    OPEN = 1,
    CLOSED = 2,
    CLOSED_CONTROLLED = 3,
    PRIVATE = 4,
}
export declare enum RCTeamInviteEnum {
    CAN_INVITE = 0,
    CAN_INVITE_WITH_APPROVAL = 1,
    CANNOT_INVITE = 2,
}
export interface RCTeamReachout {
    id: number;
    metadata: {
        answers?: any[];
    };
    ownerId: number;
    requestType: string;
    status: number;
    creatorType: string;
    creatorId: number;
    targetId: number;
    targetType: string;
}
export interface RCTeam {
    id?: number;
    address?: RCAddress;
    mainMedia?: RCMediaObject;
    logo?: RCMediaObject;
    name?: string;
    description?: string;
    addressId?: number;
    capacity?: number;
    questions?: RCQuestionObject[];
    captain?: RCUser;
    reachOut?: RCTeamReachout;
    private?: boolean;
    sports?: number;
    price?: number;
    teamEvents?: RCTeamEvent[];
    levelOfPlay?: RCLeagueDetailTypeEnum[];
    gender?: RCGenderEnum | RCGenderStringLabel;
    minAge?: number;
    maxAge?: number;
    isCreator?: boolean;
    isMember?: boolean;
    allowNewMembers?: boolean;
    following?: boolean;
    teamMembers?: RCTeamMember[];
    memberStatus?: RCTeamMemberStatusEnum;
    creatorId?: number;
    memberships?: RCMembership[];
    creatorType?: RCEntities;
    teamSeasons?: RCTeamSeason[];
    teamPools?: RCSeasonPoolParticipant[];
    inviteId?: number;
    teamMembersCount?: number;
    teamMembersFriendsCount?: number;
    canJoin?: RCTeamJoinEnum;
    canInvite?: RCTeamInviteEnum;
    membersCanInvite?: boolean;
    inviteOnly?: boolean;
    privacySetting?: RCTeamPrivacySettingEnum;
    joinSeasonTeamMember?: boolean;
    joinSeasonTeamMemberSeasonId?: number;
    joinSeasonTeamMemberLeagueId?: number;
    questionnaireId?: number;
}
