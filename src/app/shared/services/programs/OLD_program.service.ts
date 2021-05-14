import { Injectable } from '@angular/core';
import { RCServerResponse } from '@app/shared/services/main';
import { environment } from '../../../../environments/environment';
import { FileItem } from 'ng2-file-upload';
import { ImagesService } from '@app/shared/services/utils/images.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RCCreateProgramData {
  id: number;
  type: ProgramTypeEnum;
  organizationId: number;
  name: string;
  sport: SportsEnum;
  minAge: number;
  maxAge: number;
  gender: GenderEnum;
  level: Array<number>;
  shortDescription: string;
  description: string;
  highlights: Array<IProgramHighlightSchema> | null;
  address: {
    city: string;
    country: string;
    lat: number;
    lon: number;
    name: string;
    poi: boolean;
    state: string;
    timezone: string | null;
  };
}

export enum SportsEnum {
  SOFTBALL = 1,
  BASKETBALL = 2,
  FOOTBALL = 3,
  SOCCER = 4,
  BOWLING = 5,
  BOCCEBALL = 6,
  CORNHOLE = 7,
  DODGEBALL = 8,
  FRISBEE = 9,
  HOCKEY = 10,
  KICKBALL = 11,
  LACROSSE = 12,
  PINGPONG = 13,
  RUGBY = 14,
  SKEEBALL = 15,
  TENNIS = 16,
  VOLLEYBALL = 17,
  WIFFLEBALL = 18,
  BADMINTON = 19,
  FITNESS = 20,
  GOLF = 21,
  PILATES = 22,
  RUNNING = 23,
  SKIING = 24,
  SNOWBOARDING = 25,
  YOGA = 26,
  BROOMBALL = 27,
  CRICKET = 28,
  CROSSFIT = 29,
  CYCLING = 30,
  FIELD_HOCKEY = 31,
  RACQUETBALL = 32,
  SPINNING = 33,
  SQUASH = 34,
  SURFING = 35,
  SWIMMING = 36,
  WIND_SURFING = 37,
  ADVENTURE = 38,
  BOXING = 39,
  BASEBALL = 40,
  DANCE = 41,
  KICKBOXING = 42,
  MARTIAL_ARTS = 43,
  OUTDOORS = 44,
  ROWING = 45,
  SAILING = 46,
  SUP = 47,
  TRIATHLON = 48,
  HANDBALL = 49,
  CATCHBALL = 50,
  BLITZBALL = 51,
  ROLLER_DERBY = 52,
  OTHER = 999,
}

export enum ProgramTypeEnum {
  LEAGUE = 0,
  TOURNAMENT = 1,
  CLASS = 2,
  CLINIC = 3,
  CAMP = 4,
}

export enum GenderEnum {
  OTHER = 1,
  MALE = 2,
  FEMALE = 3,
}

export interface IProgramHighlightSchema {
  highlightType: number; // Send 1 here always (when used for programs only
  programId?: number;
  ordinal: number;
  title?: string;
  data: any;
}

export interface RCSeriesUpdateParticipant {
  entityType: 'team' | 'user';
  entityId: number;
  name: string;
}

@Injectable()
export class OLD_ProgramService {
  constructor(private imagesService: ImagesService, private http: HttpClient) {}

  getProgramTypesInUse = (organizationId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/organization/${organizationId}`)
      .map((response) => response);
  };

  getAllProgramsById = (organizationId: number, programId: number) => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/programs/organization/${organizationId}/${programId}`)
      .map((response) => response);
  };

  getProgramById = (programId: number) => {
    return this.http.get<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}`).map((response) => response);
  };

  createProgram = (createProgramData: RCCreateProgramData): Observable<RCServerResponse<RCCreateProgramData>> => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs`, createProgramData)
      .map((response) => response);
  };

  updateProgram = (updateProgramData: RCCreateProgramData, programId: number) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}`, updateProgramData)
      .map((response) => response);
  };

  deleteProgram = (programId: number) => {
    return this.http.delete<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}`).map((response) => response);
  };

  /*createProgramEvent = (tournamentId: number, tournament: RCLeagueSeason) => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/tournament`, tournament)
      .map((response) => response);
  };

  getProgramEventById = (tournamentId: number, eventId: number): Observable<RCServerResponse<RCLeagueSeason>> => {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/season/${eventId}?dataScope=tournament`)
      .map((response) => response);
  };

  updateSeason = (leagueId: number, seasonId: number, season: RCLeagueSeason) => {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}`, season)
      .map((response) => response);
  };

  removeSchedule = (leagueId: number, seasonId: number, tournamentId: number) => {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/tournament-events/${tournamentId}/suggest`,
      )
      .map((response) => response);
  };

  updateSeriesParticipants = (
    tournamentId: number,
    eventId: number,
    seriesId: number,
    participants: RCSeriesUpdateParticipant[],
  ) => {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/season/${eventId}/series/${seriesId}`, {
        seriesParticipants: participants,
      })
      .map((response) => response);
  };*/

  /**
   * Uploads a tournament media
   * default type of the media equals to main media
   * @param file
   * @param programId
   * @param type - available types are 'logo' and 'main'
   * @returns {Observable<R>}
   */
  uploadProgramMedia = (file: FileItem, programId: number, type: 'main' | 'logo' = 'main') => {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/programs/${programId}/uploadMedia`, file)
      .map((response) => response);

    /*   return this.imagesService.uploadFileItemImage(file).flatMap((response) => {
      const fileObject = {
        url: response.url,
        provider: 'cloudinary',
        fileType: response.format,
        mediaKey: response.public_id,
        fileName: response.original_filename,
      };

      return this.http.post<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${programId}/uploadMedia?handleType=${type}`,
        {
          file: fileObject,
        },
      );
    });*/
  };
}
