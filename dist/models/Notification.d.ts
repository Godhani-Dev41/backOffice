export declare type NotificationEntities = 'user' | 'event' | 'team' | 'league';
export interface RCNotification {
    id: number;
    following: boolean;
    namespace: string;
    read: boolean;
    seen: boolean;
    srcId: number;
    srcType: NotificationEntities;
    sourceName: string;
    sourceImage: string;
    targetId: number;
    targetType: NotificationEntities;
    text: string;
}
