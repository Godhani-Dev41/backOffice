import { Injectable } from "@angular/core";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { RCAddress, RCMembership, RCOrganization } from "@rcenter/core";
import { FileItem } from "ng2-file-upload";
import { environment } from "../../../../environments/environment";
import { RCServerResponse } from "../main";
import { RCQuestionnaireObject } from "@rcenter/core";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import "rxjs/add/operator/map";
import { mergeMap, map } from "rxjs/operators";
import { TimeService } from "@app/shared/services/utils/time.service";
import { Observable } from "rxjs";

export interface RCEventsBulkEditEntity {
  eventId?: number;
  publish?: boolean;
  cancel?: boolean;
  venueName?: string;
  startDate?: Date;
  endDate?: Date;
  venueId?: number;
  address?: RCAddress;
  description?: string;
}

@Injectable()
export class OrganizationsService {
  constructor(private http: HttpClient, private imagesService: ImagesService, private timeService: TimeService) {}
  setQuestionnaire(organizationId: number, questionnaireId: number): Observable<RCServerResponse<RCOrganization>> {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaire/${questionnaireId}`, {})
      .map((response) => response);
  }
  deleteQuestionnaire(organizationId: number): Observable<RCServerResponse<RCOrganization>> {
    return this.http
      .delete<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaire`, {})
      .map((response) => response);
  }
  getOrganizationQuestionnaires(organizationId: number): Observable<RCServerResponse<RCQuestionnaireObject[]>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaires`)
      .map((response) => response);
  }

  getOrganizationReservations(organizationId: number): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(
      `${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/reservations`,
    );
  }

  getOrganizationVenueReservations(organizationId: number, venueId: number, filters = {}): Observable<{ data: any[] }> {
    return this.http.get<{ data: any[] }>(
      `${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/reservations`,
      {
        params: {
          venueId: `${venueId}`,
          ...filters,
        },
      },
    );
  }

  getOrganizationAgenda(organizationId: number) {
    return this.http.get<any>(`${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/agenda`);
  }

  getOrganizationDailyCalander(organizationId: number) {
    return this.http
      .get<any>(
        `${
          environment.CS_URLS.API_ROOT_V2
        }/organizations/${organizationId}/daily-calender?date=${this.timeService.switchTimeZone(
          moment().startOf("day").format(),
          "utc",
        )}`,
      )
      .map((response) => response);
  }

  getOrganizationStats(organizationId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/stats`)
      .map((response) => response);
  }

  searchCustomers(organizationId: number, term: string) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V3}/orgCustomers/organizations/${organizationId}/customers?fuzzy=` +
          encodeURIComponent(term),
      )
      .map((response) => response);
  }

  getOrganizationMemberships(organizationId: number): Observable<RCMembership[]> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/membership/organization/${organizationId}`)
      .map((response) => response);
  }

  addMembershipType(organizationId: number, membership: RCMembership) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/memberships`, membership)
      .map((response) => response);
  }

  updateMembership(organizationId: number, membershipId: number, membership: RCMembership) {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/memberships/${membershipId}`,
        membership,
      )
      .map((response) => response);
  }

  getUserOrganizations(): Observable<RCServerResponse<RCOrganization[]>> {
    return this.http.get<any>(environment.CS_URLS.API_ROOT + "/users/organizations").map((response) => response);
  }

  getOrganizationById(id: number) {
    return this.http
      .get<any>(environment.CS_URLS.API_ROOT + "/organizations/" + id + "?dataScope=full")
      .map((response) => response);
  }

  updateOrganization(id: number, data) {
    return this.http.put<any>(environment.CS_URLS.API_ROOT + "/organizations/" + id, data).map((response) => response);
  }

  createOrganization(data) {
    return this.http.post<any>(environment.CS_URLS.API_ROOT + "/organizations", data).map((response) => response);
  }

  getOrganizationEvents(id) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${id}/events?limit=1000000`)
      .map((response) => response);
  }

  getOrganizationSeasons(organizationId: number, playerCount?: boolean) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/leagues/seasons?${
          playerCount ? "playerCount=true" : ""
        }`,
      )
      .map((response) => response);
  }

  createBulkEvents(organizationId: number, data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/events/bulk`, { events: data })
      .map((response) => response);
  }

  getInviteCenterData(organizationId: number): Observable<RCServerResponse<{ active: number; followers: number }>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/invite-center?countOnly=true`)
      .map((response) => response);
  }

  bulkEventsEdit(organizationId: number, data: RCEventsBulkEditEntity[]) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/events`, {
        events: data,
      })
      .map((response) => response);
  }

  getMembershipReport(membershipId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/memberships/${membershipId}/questionnaire/report`, {
        responseType: "blob",
      } as any)
      .map((response) => response);
  }

  getOrganizationNotificationsSubscriptions(organizationId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/notifications-subscriptions`,
        {} as any,
      )
      .map((response) => response);
  }

  updateOrganizationNotificationsSubscriptions(organizationId: number, updateData) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT_V2}/organizations/${organizationId}/notifications-subscriptions`,
        updateData,
      )
      .map((response) => response);
  }

  /**
   * Uploads a organization media
   * default type of the media equals to main media
   * @param file
   * @param orgId
   * @param type - available types are 'logo' and 'main'
   * @returns {Observable<R>}
   */
  uploadOrganizationMedia(file: FileItem, organization: RCOrganization, type: "main" | "logo" = "main") {
    const fileName = this.generateMediaFileName(organization);
    return this.imagesService.uploadFileItemImage(file, fileName).pipe(
      mergeMap((response) => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/organizations/${organization.id}/uploadMedia?handleType=${type}`,
          {
            file: fileObject,
          },
        );
      }),
    );
  }

  getGlCodes = (organizationId: number) => {
    if (!organizationId) throw new Error("no organization id");
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT_V3}/productPricing/organization/${organizationId}/getGlCodes`)
      .pipe(map((res) => res));
  };

  private generateMediaFileName(organization: RCOrganization): string {
    const fileName = `o_${organization.name}_logo_${organization.id}_`;

    const medias = organization.media;
    let index = medias ? medias.length : 0;
    let indexedFileName = fileName + index;

    while (medias && medias.find((media) => media.url === indexedFileName)) {
      index++;
      indexedFileName = fileName + index;
    }
    return indexedFileName;
  }
}
