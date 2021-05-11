import { RCEntities, RCSeasonRound, RCSeasonTeam, RCVenueActivityItem } from '@rcenter/core';

export interface RCSkipDateData {
  startDate?: Date;
  endDate?: Date;
  fullDay?: boolean;
  name?: string;
  isCustom?: boolean;
}

export interface SchedulerGenerateBody {
  participantsRequests: any[];
  timeSlots?: RCVenueActivityItem[];
  participantsList?: any[];
  participantsCount?: number;
  matchLength?: number;
  startDate?: Date;
  endDate?: Date;
  eventGapLength?: number;
  skipDates?: RCSkipDateData[];
  numberOfRounds: number;
  simulateOnly?: boolean;
  timezone?: string;
  stopAtEndDate?: boolean;
  notMoreThanNAWeek?: number;
  playoffWeeks?: number;
}

export interface SchedulerGeneratedData {
  rounds: RCSeasonRound[];
  seasonTeams: RCSeasonTeam[];
  numberOfEncountersCanOccur: number;
  percentageUse: number;
  numberOfEncountersNeeded: number;
  participantStatistics: {
    encounters: any[];
    participantId: number;
    participantType: RCEntities;
    times: {
      hour: number;
      count: number;
    }[]
  }[];
  seasonDivisions: {
    opponentsTable?: any[];
    id: number;
    name: string;
    participantStatistics: {
      encounters: any[];
      participantId: number;
      participantType: RCEntities;
      times: {
        hour: number;
        count: number;
      }[]
    }[];
  }[];
  scheduleData: {
    endDate: Date;
    startDate: Date;
    eventGapLength: 5;
    matchLength: number;
    notMoreThanOnceAWeek: boolean;
    numberOfRounds: number;
    seasonId: string;
    skipDates: RCSkipDateData[];
    timeSlots: RCVenueActivityItem[];
    participantsList: any[];
  };
}
