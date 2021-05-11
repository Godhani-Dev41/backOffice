import { RCGamificationLevel, RCUser } from './User';
import { RCEvent, RCPoolItem } from './Event';
import { RCLeague } from './Leagues';
import { RCTeam } from './Team';
import { RCVenue } from './Venue';
import { RCMediaObject } from './Media';
import { RCEntities } from './Utils';
import { RCAddress } from './Address';
import { RCOrganization } from './Organization';
import { RCCreator, RCSeasonRound, RCSeasonRoundMatch } from './';
export interface RCEmbedMetadata {
    title: string;
    description?: string;
    image: string;
    author?: string;
    url: string;
    rootUrl?: string;
}
export interface RCFeedItemComment {
    id: number;
    content: string;
    creator: RCUser;
    likesCount: number;
    createdAt: Date;
    userLiked?: boolean;
}
export declare enum RCFeedContentTypeEnum {
    BASIC = 1,
    GALLERY = 2,
    VIDEO = 3,
    VENUE = 4,
    EVENT = 5,
    LEAGUE = 6,
    SCORES = 7,
    PROMOTEDEVENT = 8,
    CHECKIN = 9,
    SHARE = 10,
    JOINEVENT = 11,
    TEAM = 15,
    EMBED = 16,
    ORGANIZATION = 17,
    MATCH_RESULTS = 18,
    LEAGUE_STANDINGS = 19,
    ROUND_STANDINGS = 20,
    TEAM_LOOKING_FOR_PLAYERS = 21,
    PLAYER_LOOKING_FOR_TEAM = 22,
    TEAM_LOOKING_FOR_FRIENDLY_MATCH = 23,
    LEVEL_UP_SHARE = 24,
}
export interface RCFeedItem {
    id: number;
    contentType: RCFeedContentTypeEnum;
    creator: RCCreator;
    feed?: RCFeedItem;
    organization?: RCOrganization;
    content?: string;
    subContentType?: number;
    likesCount: number;
    likes: any[];
    commentsCount: number;
    comments: RCFeedItemComment[];
    userLiked: boolean;
    event?: RCEvent;
    match?: RCSeasonRoundMatch;
    league?: RCLeague;
    checkinId?: number;
    checkinType?: 'event' | 'venue' | 'dbVenue';
    team?: RCTeam;
    round?: RCSeasonRound;
    venue?: RCVenue;
    address?: RCAddress;
    media?: RCMediaObject[];
    checkinVenue?: RCVenue;
    checkinEvent?: RCEvent;
    createdAt?: Date;
    embedMetadata?: RCEmbedMetadata;
    embedUrl?: string;
    postedBefore?: string;
    embedType?: 'youtube' | 'url';
    isMe?: boolean;
    feedMetadata?: {
        reachOut?: {
            addressId?: number;
            startDate?: Date;
            endDate?: Date;
            addressObject?: RCAddress;
            position?: string;
        };
        sharedMedia?: {
            fullUrl?: string;
            url?: string;
        };
        standings?: any;
        levelUp?: {
            levelConfig: RCGamificationLevel;
        };
        scoreBoard?: {
            points?: number;
            rank?: number;
            boardType: any;
        };
        betShare?: {
            poll?: RCPoolItem;
        };
    };
}
export declare type RCShareType = 'feed' | 'event' | 'venue' | 'league' | 'team' | 'round' | 'match';
export declare enum RCPostTargetTypeEnum {
    USER = 0,
    FOLLOWERS = 1,
    PUBLIC = 2,
    EVENT = 3,
    VENUE = 4,
    TEAM = 5,
    LEAGUE = 6,
    GEO = 7,
}
export interface RCPostTarget {
    targetName?: string;
    targetId?: number;
    targetType: RCPostTargetTypeEnum;
}
export interface IRCFeedPost {
    id?: number;
    /** The checkin object provided, may be a venue or an event */
    checkin?: any;
    /** The feed item text */
    content?: string;
    /** Array of images to upload containing image path on device */
    images?: string[];
    /** The video path returned from device excluding file:/ prefix (Services adds it itself) */
    video?: string;
    targets?: RCPostTarget[];
    address?: RCAddress;
    attachmentId?: string;
    embedMetadata?: RCEmbedMetadata;
    creatorId?: number;
    creatorType?: RCEntities;
    /**
     * If the user shares a resource with the feed here we want to
     * specify the id of the shared content and it's creatorType
     */
    parentType?: RCShareType;
    parentId?: number;
    shared?: boolean;
    /** if there are more attachments that will be sent we want to notify the server about them */
    attachmentsFollowed?: number[];
    postUploadMultipart?: boolean;
    postUploadVideo?: boolean;
    postType?: 'feed' | 'event' | 'venue' | 'league' | 'team' | 'image' | 'checkin' | 'gallery' | 'share' | 'video' | 'embed' | 'round' | 'standings' | 'match';
    embedUrl?: string;
    embedType?: 'youtube' | 'url';
}
