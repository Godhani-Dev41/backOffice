import { RCTeam } from './Team';
export interface RCStanding {
    id: number;
    points: number;
    seasonId: number;
    standingPosition: number;
    statistics: {
        loses: number;
        wins: number;
        winPercentage: number;
        gamesPlayed: number;
        ties: number;
        againstTeam: number;
        differenceTeam: number;
        forTeam: number;
    };
    team: RCTeam;
    teamId: number;
}
