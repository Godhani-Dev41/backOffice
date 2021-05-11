import { RCMediaObject } from './Media';
import { RCAddress } from './Address';
import { RCGenderEnum, RCUser } from './';
import { RCEntities } from './Utils';
export interface RCMembership {
    id?: number;
    appliesTo?: {
        event?: boolean;
        venue?: boolean;
        league?: boolean;
    };
    waiverDoc?: string;
    ordinal?: number;
    creatorId?: number;
    creatorType?: RCEntities;
    name?: string;
    isActive?: boolean;
    isMandatory?: boolean;
    price?: number;
    details?: string;
    cycleLength?: number;
    cycleType?: 'M' | 'w' | 'y';
    canJoin?: RCMembershipCanJoin;
    toDelete?: boolean;
}
export declare enum RCMembershipCanJoin {
    CAN_JOIN = 0,
    CANNOT_ALREADY_MEMBER = 1,
}
export interface RCPortalConfig {
    colors: {
        mainColor: string;
    };
    newsTicker: {
        text: string;
    }[];
}
export interface RCWebPortal {
    id: number;
    shortUrl: string;
    bannerImage: RCMediaObject;
    portalConfig: RCPortalConfig;
}
export declare enum RCLinkedAccountStatus {
    NOT_ACTIVE = 0,
    PENDING = 1,
    ACTIVE = 2,
}
export declare enum RCOfflinePaymentSetting {
    DISABLED = 1,
    ALLOW_CASH = 2,
    REDIRECT = 3,
    INFO_ONLY = 4,
}
export declare enum RCPaymentSettingStatus {
    ENABLED = 1,
    DISABLED_REDIRECT = 2,
    DISABLED_INFO_ONLY = 3,
    DISABLED_EMAIL = 4,
}
export interface RCOrganization {
    id: number;
    name: string;
    email: string;
    sports?: number[];
    phoneNumber: string;
    about: string;
    tagline?: string;
    creator?: RCUser;
    mainMedia?: RCMediaObject;
    logo?: RCMediaObject;
    address?: RCAddress;
    followers?: Array<any>;
    followersCount?: number;
    membershipTypes?: RCMembership[];
    media?: any;
    blog?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    website?: string;
    following?: boolean;
    webPortal?: RCWebPortal;
    braintreeAccount?: RCLinkedAccountStatus;
    stripeAccount?: RCLinkedAccountStatus;
    organizationActivityTypes?: number[];
    organizationAudienceTypes?: number[];
    organizationGenders?: RCGenderEnum[];
    paymentSettings?: {
        installments?: number;
        onlinePaymentEnabled?: boolean;
        allowCash?: boolean;
        paymentSettingStatus?: RCPaymentSettingStatus;
        bookingRequestOnly?: boolean;
        vettedCustomerDirectBooking?: boolean;
    };
    isClaimed?: boolean;
    questionnaireId?: number;
    membershipQuestionnaireId?: number;
}
