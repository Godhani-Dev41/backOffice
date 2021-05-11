
import {throwError,  Observable } from 'rxjs';

import {mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { RCServerResponse } from '@app/shared/services/main';
import { ImagesService } from '@app/shared/services/utils/images.service';
import { FileItem } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { RCTeamMemberRoleEnum, RCTeam, RCOrganization } from '@rcenter/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { HttpClient } from '@angular/common/http';

export interface RCInviteeObject {
  phoneNumbers?: string[];
  rc_id?: number;
  name: string;
  source: 'phone' | 'connection';
  emails?: string[];
}

@Injectable()
export class TeamsService {
  organization: RCOrganization;
  constructor(
    private http: HttpClient,
    private imagesService: ImagesService,
    private authService: AuthenticationService
  ) {

    this.authService.currentOrganization.subscribe((organization) => {
      this.organization = organization;
    });
  }

  /**
   *
   * @param teamId
   * @param invitees
   * @returns { Observable<RCServerResponse>}
   */
  sendTeamInvite(teamId: number, invitees: RCInviteeObject[]): Observable<RCServerResponse<any>> {
    if (!teamId) return throwError('teamId not specified');
    if (!invitees) return throwError('No invitees have been passed');

    return this.http.post<any>(`${environment.CS_URLS.API_ROOT}/teams/${teamId}/invite`, {
      inviterId: this.organization.id,
      inviterType: 'organization',
      invitees: invitees,
      generateUrl: true,
      feature: 'Team Invite',
      bulk: true,
      origin: 2,
      tokend: true
    }).pipe(map(response => response));
  }

  updateTeam(teamId: number, teamData: RCTeam) {
    return this.http.put<any>(`${environment.CS_URLS.API_ROOT}/teams/${teamId}`, teamData).pipe(
      map(response => response));
  }

  changeTeamMemberRole(teamId: number, memberId: number, role: RCTeamMemberRoleEnum) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/teams/${teamId}/member/${memberId}/change-role`, {
        role
      }).pipe(
      map(response => response));
  }

  /**
   * Uploads a team media
   * default type of the media equals to main media
   * @param file
   * @param teamId
   * @param type - available types are 'logo' and 'main'
   * @returns {Observable<R>}
   */
  uploadTeamMedia(file: FileItem, teamId: number, type: 'main' | 'logo' = 'main') {
    return this.imagesService.uploadFileItemImage(file).pipe(mergeMap((response) => {
      const fileObject = {
        url: response.secure_url,
        provider: 'cloudinary',
        fileType: response.format,
        mediaKey: response.public_id,
        fileName: response.original_filename,
      };

      return this.http
        .post<any>(`${environment.CS_URLS.API_ROOT}/teams/${teamId}/uploadMedia?handleType=${type}`, {
          file: fileObject
        });
    }));
  }


}
