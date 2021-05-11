import { RCMediaObject } from './Media';
import { RCAddress } from './Address';
import { RCEntities } from './';
import { RCSchool } from './School';
import { RCOrganization } from './Organization';
export declare type RCGenderStringLabel = 'Co-ed' | 'Male' | 'Female';
export declare enum RCGenderEnum {
    OTHER = 1,
    MALE = 2,
    FEMALE = 3,
}
export interface RCAthleteSport {
    sports: number;
    levelOfPlay: number;
}
export interface RCAthlete {
    athleteSports?: RCAthleteSport[];
    schools?: RCSchool[];
}
export interface RCCreator {
    id: number;
    firstName?: string;
    lastName?: string;
    creatorType: RCEntities;
    name: string;
    mainMedia: RCMediaObject;
    profilePicture: RCMediaObject;
}
export interface RCGamificationLevel {
    ordinal: number;
    requiredPoints: number;
    levelSetId: number;
    mainMedia?: RCMediaObject;
    name?: string;
}
export interface RCGUserState {
    id?: number;
    brandId: number;
    currentLevel: number;
    currentPoints: number;
    currentPointsInLevel: number;
    levelSetId: number;
    level: RCGamificationLevel;
    pointsForNextLevel: number;
    userId: number;
    currentCoins?: number;
}
export interface RCNotificationEntitySettings {
    active: boolean;
}
export interface RCNotificationSettings {
    teams: RCNotificationEntitySettings;
    leagues: RCNotificationEntitySettings;
    events: RCNotificationEntitySettings;
    venues: RCNotificationEntitySettings;
    feed: RCNotificationEntitySettings;
    users: RCNotificationEntitySettings;
}
export interface RCUser {
    id: number;
    fullName?: string;
    name?: string;
    firstName: string;
    lastName: string;
    email?: string;
    logo?: RCMediaObject;
    birthDate?: Date;
    mainMedia?: RCMediaObject;
    media?: Array<RCMediaObject>;
    profilePicture?: RCMediaObject;
    profilePictureId?: string;
    athlete?: RCAthlete;
    currentAddress?: RCAddress;
    address?: RCAddress;
    phoneNumber?: string;
    motto?: string;
    about?: string;
    merchant?: {
        id: number;
    };
    merchantId?: number;
    gender?: RCGenderEnum;
    userState?: RCGUserState;
    privateProfile?: boolean;
    followers?: any[];
    followingArray?: any[];
    followersCount?: number;
    followingArrayCount?: number;
    followersConnectionsCount?: number;
    following?: boolean;
    isPending?: boolean;
    notificationSettings?: RCNotificationSettings;
    createAsId: number;
    createAsType: 'organization';
    pushNotifications?: boolean;
    createAs?: RCOrganization;
    rank?: number;
}
