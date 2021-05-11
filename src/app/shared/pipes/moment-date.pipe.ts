import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'momentDate'
})
export class MomentDatePipe implements PipeTransform {

  transform(value: any, format, timezone): any {
    if (!value) return null;
    if (!timezone) timezone = moment.tz.guess();

    if (format) {
      return moment.tz(value, timezone).format(format);
    } else {
      return moment.tz(value, timezone).toDate();
    }
  }

}
