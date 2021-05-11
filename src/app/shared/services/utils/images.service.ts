
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FileItem } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

const GENERAL_UPLOAD_URL = `${environment.CLOUDINARY_API_ROOT}?upload_preset=${environment.CLOUDINARY_UPLOAD_PRESET}`;

@Injectable()
export class ImagesService {
  constructor(
    private http: HttpClient
  ) {

  }

  uploadBase64Image(image: string): Observable<any> {
    return this.http.post<any>(GENERAL_UPLOAD_URL, {
      file: image
    }).pipe(map((response) => response));
  }

  uploadFileItemImage(file: FileItem, filePublicId?: string): Observable<any> {
    return Observable.create((observer) => {
      if (filePublicId) {
        const formattedFileName = filePublicId.replace(/[\\~#%&*{ }/:<>?!@#$%^&*()+=|"'`]/g, '-');
        file.url = GENERAL_UPLOAD_URL + `&public_id=${formattedFileName}`
      }
      else {
        file.url = GENERAL_UPLOAD_URL;
      }
      file.headers = {};

      file.withCredentials = false;
      file.upload();

      file.onSuccess = (response) => {
        observer.next(JSON.parse(response));
        observer.complete();
      };

      file.onError = (response) => {
        observer.error(response);
      };
    });
  }

  getBase64FromFile(file: File): Observable<string> {
    return Observable.create((observer) => {
      const reader = new FileReader();

      reader.onloadend = function () {
        observer.next(reader.result);
        observer.complete();
      };

      reader.readAsDataURL(file);
    });
  }
}
