import { RCUser } from './User';
export declare type RCEntities = 'event' | 'team' | 'league' | 'venue' | 'feed' | 'user' | 'organization' | 'season';
export interface RCConnection {
    id: number;
    connType: number;
    creatorId: number;
    creatorType: RCEntities;
    from: number;
    fromType: RCEntities;
    ownerId: number;
    status: number;
    to: number;
    toType: RCEntities;
    fromUser?: RCUser;
    toUser?: RCUser;
}
