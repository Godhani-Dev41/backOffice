import { Injectable } from "@angular/core";
import { ImagesService } from "@app/shared/services/utils/images.service";
import { FileItem } from "ng2-file-upload";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs/Observable";
import { RCServerResponse } from "@app/shared/services/main";
import { RCVenue } from "@rcenter/core";
import * as moment from "moment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { mergeMap } from "rxjs/operators";
import { SportsService } from "@app/shared/services/utils/sports.service";

@Injectable()
export class VenuesService {
  currentVenue = new BehaviorSubject<any>(null);
  constructor(
    private imagesService: ImagesService,
    private sportsService: SportsService,
    private http: HttpClient
  ) { }

  searchVenues(query: string): Observable<RCServerResponse<RCVenue[]>> {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/venues?fuzzy=${query}&limit=30`
      )
      .map((response) => response);
  }

  updateVenue(venueId: number, venue) {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/venues/${venueId}`, venue)
      .map((response) => response);
  }

  createVenue(venue) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/venues`, venue)
      .map((response) => response);
  }

  createSpace(venueId: number, space) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/spaces`,
        space
      )
      .map((response) => response);
  }

  updateSpace(venueId: number, spaceId: number, space) {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/spaces/${spaceId}`,
        space
      )
      .map((response) => response);
  }
  getSpaceById(venueId: number, spaceId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/spaces/${spaceId}`
      )
      .map((response) => response);
  }

  uploadVenueMedia(
    media: FileItem,
    venueData: any,
    type: "main" | "logo" = "main"
  ) {
    let fileName = this.generateVenueMediaFileName(venueData);
    fileName = this.generateFileNameWithMediaNum(fileName, venueData.media);

    return this.imagesService.uploadFileItemImage(media, fileName).pipe(
      mergeMap(response => {
        const fileObject = {
          url: response.secure_url,
          provider: "cloudinary",
          fileType: response.format,
          mediaKey: response.public_id,
          fileName: response.original_filename,
        };

        return this.http.post<any>(
          `${environment.CS_URLS.API_ROOT}/venues/${venueData.id}/uploadMedia?handleType=${type}`,
          {
            file: fileObject,
          }
        );
      }),
    );
  }

  uploadCourtMedia(
    file: FileItem,
    space: any,
    venue: any,
    type: "main" | "logo" = "main"
  ) {
    let fileName = this.generateCourtMediaFileName(space, venue);
    fileName = this.generateFileNameWithMediaNum(fileName, space.media);
    return this.imagesService
      .uploadFileItemImage(file, fileName).pipe(
        mergeMap(response => {
          const fileObject = {
            url: response.secure_url,
            provider: "cloudinary",
            fileType: response.format,
            mediaKey: response.public_id,
            fileName: response.original_filename,
          };

          return this.http.post<any>(
            `${environment.CS_URLS.API_ROOT}/venues/${venue.id}/spaces/${space.id}/uploadMedia?handleType=${type}`,
            {
              file: fileObject,
            }
          );
        })
      );
  }

  private generateVenueMediaFileName(venue: any) {
    let fileName = `f_${venue.name}`;
    if (venue.address) {
      fileName += `-${venue.address.city}`;
    }
    fileName += `_${venue.id}_`;
    fileName = fileName.split(" ").join("-");
    return fileName;
  }

  private generateCourtMediaFileName(space: any, venue: any) {
    let fileName = this.generateVenueMediaFileName(venue);
    fileName += `_s_${space.properties[0]}-${space.spaceType}`;
    space.sports.map((i) => {
      fileName += `-${this.sportsService.getSport(i).name}`;
    });
    fileName += `_${space.id}_`;
    fileName = fileName.split(" ").join("-");
    return fileName;
  }

  private generateFileNameWithMediaNum(fileName: string, medias: any): string {
    let index = medias ? medias.length : 0;
    let indexedFileName = fileName + index;

    while (medias && medias.find((media) => media.url === indexedFileName)) {
      index++;
      indexedFileName = fileName + index;
    }

    return indexedFileName;
  }

  getOrganizationVenues(id) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${id}/venues`)
      .map((response) => response);
  }

  getVenueById(id: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/venues/${id}`)
      .map((response) => response);
  }

  getVenueSpaces(
    id: number,
    activeOnly?: boolean,
    showBlocking?: boolean,
    startDate: moment.Moment = moment(), 
    endDate: moment.Moment = moment()
  ) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT
        }/venues/${id}/spaces?startDate=${startDate}&?endDate=${endDate}&limit=100000${activeOnly ? `&onlyActiveSessions=true` : ""
        }&includeBlocking=${!!showBlocking}`
      )
      .map((response) => response);
  }

  getAddons(orgId: number, venueId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${orgId}/packages?creatorId=${venueId}&creatorType=venue&packageType=addon`
      )
      .map((response) => response);
  }

  getPackages(orgId: number, venueId: number) {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${orgId}/packages?creatorId=${venueId}&creatorType=venue`
      )
      .map((response) => response);
  }

  createPackage(orgId: number, data) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${orgId}/packages`,
        data
      )
      .map((response) => response);
  }

  updatePackage(orgId: number, packageId: number, data) {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${orgId}/packages/${packageId}`,
        data
      )
      .map((response) => response);
  }

  assignPackages(
    orgId: number,
    data: {
      id?: number;
      toRemove?: boolean;
      packageId: number;
      resourceId: number;
      resourceType: string;
    }[]
  ) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/organizations/${orgId}/packages/resources/bulk`,
        {
          packages: data,
        }
      )
      .map((response) => response);
  }

  calculateBestPackage(
    venueId: number,
    spaceId: number,
    times: { startDate: Date; endDate: Date; percentage: string }[]
  ) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/spaces/${spaceId}/calculate-package`,
        {
          times,
        }
      )
      .map((response) => response);
  }

  calculateSpaceAvailability(
    venueId: number,
    spaceId: number,
    data: { startDate: Date; endDate: Date; percentage: string }[]
  ) {
    return this.http
      .post<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/spaces/${spaceId}/occupancy-check`,
        {
          times: data,
        }
      )
      .map((response) => response);
  }

  bookVenue(data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations`, data)
      .map((response) => response);
  }

  bookVenueOrder(data) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT_V2}/reservations/order`, data)
      .map((response) => response);
  }

  updateBooking(reservationId: number, data) {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT_V2}/reservations/${reservationId}`,
        data
      )
      .map((response) => response);
  }

  cancelBooking(reservationId: number) {
    return this.http
      .delete<any>(
        `${environment.CS_URLS.API_ROOT_V2}/reservations/${reservationId}`
      )
      .map((response) => response);
  }

  cancelSession(sessionId: number) {
    return this.http
      .delete(
        `${environment.CS_URLS.API_ROOT_V2}/reservations/sessions/${sessionId}`
      )
      .map((response) => response);
  }

  updateSession(sessionId: number, data) {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT_V2}/reservations/sessions/${sessionId}`,
        data
      )
      .map((response) => response);
  }

  getVenuePaymentToken(orgId: number, provider = "stripe") {
    return this.http
      .get<any>(
        `${environment.CS_URLS.API_ROOT}/payments/client-token?provider=${provider}&id=${orgId}&type=organization`
      )
      .map((response) => response);
  }

  setQuestionnaire(
    venueId: number,
    questionnaireId: number
  ): Observable<RCServerResponse<RCVenue>> {
    return this.http
      .put<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/questionnaire/${questionnaireId}`,
        {}
      )
      .map((response) => response);
  }

  unsetQuestionnaire(venueId: number): Observable<RCServerResponse<RCVenue>> {
    return this.http
      .delete<any>(
        `${environment.CS_URLS.API_ROOT}/venues/${venueId}/questionnaire`,
        {}
      )
      .map((response) => response);
  }

  getMinMaxSpacesTime(spacesBusinessHours) {
    let minStartTime = "06:00";
    let maxStartTime = "23:30";

    if (spacesBusinessHours.length) {
      const startTimes = spacesBusinessHours.map((i) =>
        Number(i.start.split(":")[0])
      );
      const endTimes = spacesBusinessHours.map((i) =>
        Number(i.end.split(":")[0])
      );

      const min = Math.min(...startTimes);
      const max = Math.max(...endTimes);

      minStartTime = min + ":00";
      maxStartTime = max + ":00";
    }
    return {
      minStartTime,
      maxStartTime,
    };
  }

  getSpaceBusinessHours(venue: RCVenue) {
    const spacesBusinessHours = [];
    for (const space of venue.spaces) {
      const spaceBusiness = space.activityTimes.map((j) => {
        const startHour = j.open.split(":");
        const endHour = j.close.split(":");
        let day = j.dayOfWeek;
        if (day === 8) {
          day = 0;
        } else {
          day -= 1;
        }

        return {
          dow: [day],
          start: startHour[0] + ":" + startHour[1],
          end: endHour[0] + ":" + endHour[1],
        };
      });

      spacesBusinessHours.push(...spaceBusiness);
    }

    const venueBusinessHours = venue.openingTimes.map((j) => {
      const startHour = j.open.split(":");
      const endHour = j.close.split(":");
      let day = j.dayOfWeek;
      if (day === 8) {
        day = 0;
      } else {
        day -= 1;
      }

      return {
        dow: [day],
        start: startHour[0] + ":" + startHour[1],
        end: endHour[0] + ":" + endHour[1],
      };
    });

    return {
      venueBusinessHours,
      spacesBusinessHours,
    };
  }
}
