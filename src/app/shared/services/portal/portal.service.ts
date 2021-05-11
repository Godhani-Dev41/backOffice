
import {mergeMap, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { RCServerResponse } from '@app/shared/services/main';
import { RCWebPortal } from '@rcenter/core';
import { FileItem } from 'ng2-file-upload';
import { ImagesService } from '@app/shared/services/utils/images.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PortalService {

  constructor(
    private imagesService: ImagesService,
    private http: HttpClient
  ) { }

  updatePortal(id: number, data): Observable<RCServerResponse<RCWebPortal>> {
    return this.http
      .put<any>(`${environment.CS_URLS.API_ROOT}/web-portal/${id}`, data).pipe(
      map(response => response));
  }

  /**
   * Uploads a portal banner media
   * @param file
   * @param portalId
   * @returns {Observable<R>}
   */
  updatePortalBanner(file: FileItem, portalId: number) {
    return this.imagesService.uploadFileItemImage(file).pipe(mergeMap((response) => {
      const fileObject = {
        url: response.secure_url,
        provider: 'cloudinary',
        fileType: response.format,
        mediaKey: response.public_id,
        fileName: response.original_filename,
      };

      return this.http
        .post<any>(`${environment.CS_URLS.API_ROOT}/web-portal/${portalId}/uploadMedia?handleType=banner`, {
          file: fileObject
        });
    }));
  }
}
