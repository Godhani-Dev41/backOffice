
import {mergeMap, map} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  RCEventMatchStatusEnum,
  RCMatchParticipants,
} from "@rcenter/core/models/Leagues";
import { environment } from "../../../../environments/environment";
import { RCServerResponse } from "@app/shared/services/main";
import { FileItem } from "ng2-file-upload";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { RCInviteeObject } from "@app/shared/services/teams/teams.service";
import { RCEntities, RCEvent } from "@rcenter/core";
import { HttpClient } from "@angular/common/http";

export interface RCRequestUpdateMatch {
  status?: RCEventMatchStatusEnum;
  participants?: RCMatchParticipants[];
}

export enum InviteEntityGroup {
  ORGANIZATION_ACTIVE_PLAYERS = "organizationActivePlayers" as any,
  LEAGUE_ACTIVE_PLAYERS = "leagueActivePlayers" as any,
}

export interface RCInvitesObject {
  invitees?: RCInviteeObject[];
  entities?: {
    entityId: number;
    entityType: RCEntities;
  }[];
  entitiesGroups?: {
    entityId: number;
    entityType: InviteEntityGroup;
  }[];
  inviterId?: number;
  inviterType?: RCEntities;
  generateUrl?: boolean;
  feature?: string;
  bulk?: boolean;
  origin?: number;
  tokend?: boolean;
}

@Injectable()
export class EventsService {
  constructor(
    private noAuthHttp: HttpClient,
    private http: HttpClient,
    private imagesService: ImagesService
  ) {}

  getEventByIdNoAuth(eventId: number): Observable<any> {
    return this.noAuthHttp
      .get(`${environment.CS_URLS.API_ROOT}/events/${eventId}`).pipe(
      map((response) => response));
  }

  deleteEvent(
    leagueId,
    seasonId,
    roundId,
    matchId
  ): Observable<RCServerResponse<any>> {
    // tslint:disable-next-line
    return this.http
      .delete<any>(
        `${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/rounds/${roundId}/match/${matchId}`,
        {
          params: {
            deleteEvent: "true",
          },
        }
      ).pipe(
      map((response) => response));
  }

  createMatchReport(eventIds: number[]) {
    return this.http.post<any>(
      `${environment.CS_URLS.API_ROOT}/events/match/report`,
      {
        eventIds: eventIds,
      },
      {
        responseType: "blob",
      } as any
    );
  }

  updateMatch(
    eventId: number,
    body: RCRequestUpdateMatch
  ): Observable<RCServerResponse<any>> {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/events/${eventId}/match`, body).pipe(
      map((response) => response));
  }

  updateEvent(eventId: number, body): Observable<RCServerResponse<any>> {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/events/${eventId}`, body).pipe(
      map((response) => response));
  }

  createEvent(data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/events`, data).pipe(
      map((response) => response));
  }

  getEventById(eventId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/events/${eventId}`).pipe(
      map((response) => response));
  }

  getEventParticipants(eventId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/events/${eventId}/attendees`).pipe(
      map((response) => response));
  }

  inviteToEvent(eventId: number, invitesObject: RCInvitesObject) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/events/${eventId}/invite`,
        invitesObject
      ).pipe(
      map((response) => response));
  }

  uploadMultipleEventMedia(ids: number[], file: FileItem, fileName: string) {
    return this.imagesService
      .uploadFileItemImage(file, fileName).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/media/multiple-assign?handleType=main`,
          {
            ids,
            file: fileObject,
            parentType: "event",
          }
        );
      }));
  }

  uploadEventMedia(id: number, file: FileItem, fileName: string) {
    return this.imagesService
      .uploadFileItemImage(file, fileName).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/events/${id}/uploadMedia?handleType=main`,
          {
            file: fileObject,
          }
        );
      }));
  }

  generateEventMediaFileName(
    eventData: any,
    eventId: number,
    prevFileName?: string
  ): string {
    const fileName = `e_${eventData.venueName}_${eventData.title}_${
      eventId ? eventId : 0
    }`;
    let indexedFileName: string;

    if (prevFileName) {
      const splitPartsFileName = prevFileName.split("_");
      const newFileNameIndex =
        parseInt(splitPartsFileName[splitPartsFileName.length - 1]) + 1;
      indexedFileName = fileName + "_" + newFileNameIndex;
    } else {
      indexedFileName = fileName + "_0";
    }
    return indexedFileName;
  }

  getEventAnswersByUser(eventId: number, userId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/events/${eventId}/answers/${userId}`
      ).pipe(
      map((response) => response));
  }
}
