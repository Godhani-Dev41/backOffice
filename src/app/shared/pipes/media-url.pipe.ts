import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RCMediaObject } from '@rcenter/core';

@Pipe({
  name: 'mediaUrl'
})
export class MediaUrlPipe implements PipeTransform {

  transform(media: string | RCMediaObject, width?: number, shareOverlay?: boolean ): any {
    if (!media) return media;
    if (typeof media === 'string') return media;

    let url = media.url;

    if (media.provider === 'cloudinary') {
      const ROOT_CLOUDINARY = environment.CLOUDINARY_ROOT;

      if (shareOverlay) {
        // tslint:disable-next-line:max-line-length
        url = `${ROOT_CLOUDINARY}/q_100,w_476,h_249,c_thumb/l_strip_jplwwk,x_0,y_-125,w_476,h_7/l_icon_qwopvt,w_50,h_50,y_-100,x_-199/${media.mediaKey}.${media.fileType}`;
      } else {
        const w = 'w_' + ( width || '1000' );
        url = `${ROOT_CLOUDINARY}/q_60/${w}/${media.mediaKey}.${media.fileType}`;
      }
    }

    return url;
  }
}
