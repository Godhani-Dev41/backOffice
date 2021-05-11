import { mergeMap, map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RCServerResponse } from "@app/shared/services/main";
import {
  IRCLeagueDetail,
  RCAddress,
  RCLeague,
  RCLeagueBookingStateEnum,
  RCLeagueSeason,
  RCSeasonTeam,
} from "@rcenter/core";
import { environment } from "../../../../environments/environment";
import { FileItem } from "ng2-file-upload";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { HttpClient } from "@angular/common/http";

export interface RCCreateLeagueData {
  address: RCAddress;
  league: {
    GL?: any;
    requiredProductIds?: any;
    name: string;
    organizationId: number;
    shortDescription: string;
    leagueType?: "tournament" | "league";
    sports: number[];
    description: string;
    addressName: string;
    timezone: string;
    questionnaireId?: number;
    isPublished?: boolean;
    sportConfigData?: {
      standingsView: any;
    };
  };
  leagueDetails: IRCLeagueDetail[];
}

export interface RCSeriesUpdateParticipant {
  entityType: "team" | "user";
  entityId: number;
  name: string;
}

@Injectable()
export class TournamentService {
  constructor(private imagesService: ImagesService, private http: HttpClient) {}

  getTournamentById(tournamentId: number) {
    return this.http.get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}`).pipe(
      map((response) => response),
      map((response) => {
        return response;
      }),
    );
  }

  createTournament(createTournamentData: RCCreateLeagueData): Observable<RCServerResponse<RCLeague>> {
    createTournamentData.league.leagueType = "tournament";

    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues`, createTournamentData)
      .pipe(map((response) => response));
  }

  createTournamentEvent(tournamentId: number, tournament: RCLeagueSeason) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/tournament`, tournament)
      .pipe(map((response) => response));
  }

  getTournamentEventById(tournamentId: number, eventId: number): Observable<RCServerResponse<RCLeagueSeason>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/season/${eventId}?dataScope=tournament`)
      .pipe(map((response) => response));
  }

  updateSeason(leagueId: number, seasonId: number, season: RCLeagueSeason) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}`, season)
      .pipe(map((response) => response));
  }

  removeSchedule(leagueId: number, seasonId: number, tournamentId: number) {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/tournament-events/${tournamentId}/suggest`,
      )
      .pipe(map((response) => response));
  }

  updateSeriesParticipants(
    tournamentId: number,
    eventId: number,
    seriesId: number,
    participants: RCSeriesUpdateParticipant[],
  ) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/season/${eventId}/series/${seriesId}`, {
        seriesParticipants: participants,
      })
      .pipe(map((response) => response));
  }

  /**
   * Uploads a tournament media
   * default type of the media equals to main media
   * @param file
   * @param tournamentId
   * @param type - available types are 'logo' and 'main'
   * @returns {Observable<R>}
   */
  uploadTournamentMedia(file: FileItem, tournamentId: number, type: "main" | "logo" = "main") {
    return this.imagesService.uploadFileItemImage(file).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/leagues/${tournamentId}/uploadMedia?handleType=${type}`,
          {
            file: fileObject,
          },
        );
      }),
    );
  }
}
