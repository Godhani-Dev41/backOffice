import { RCMediaObject } from './Media';
export interface RCGamificaitonServerResponse {
    coins: number;
    isLevelUp: boolean;
    xp: number;
    newLevel?: RCGamificationNewLevelResponse;
}
export interface RCGamificationNewLevelResponse {
    id?: number;
    levelSetId: number;
    name: string;
    ordinal: number;
    requiredPoints: number;
    mainMedia?: RCMediaObject;
}
