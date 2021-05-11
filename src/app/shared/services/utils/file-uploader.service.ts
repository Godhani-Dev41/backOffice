import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { FileItem } from 'ng2-file-upload';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class FileUploaderService {

  constructor() { }

  uploadFile(url, file: FileItem): Observable<any> {
    return Observable.create((observer) => {
      file.url = `${environment.CS_URLS.API_ROOT}${url}`;
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


}
