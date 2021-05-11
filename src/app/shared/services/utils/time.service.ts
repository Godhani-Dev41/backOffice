import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";

export declare type TimeList = {
  timeValue: string;
  display: string;
};

@Injectable()
export class TimeService {
  constructor(private http: HttpClient) {}

  // convert a possibly wrongly created date/time to the same hour - but in a diff timezone
  // e.g. if the client is in the east coast (ET) creating an event @ 1/1/2020 11:00
  // in pacific time PT is 3 hours before ET
  // the wrongly created date is:
  // Wed Jan 01 2020 10:00:00 GMT-0500 (Eastern Standard Time)
  // when we really should be @
  // Wed Jan 01 2020 10:00:00 GMT-0800 (Pacific Standard Time)
  dateTimeInTimeZone(date: Date | string, timezone?: string): Date {
    if (!timezone) timezone = moment.tz.guess();
    let m = moment(date);
    return moment.tz(m.format("YYYY-MM-DDTHH:mm:ss"), timezone).toDate();
  }

  // hack #2
  // because the backoffice assumes everything happens in LOCAL TIME
  // getting the time:
  // Wed Jan 01 2020 10:00:00 GMT-0800 (Pacific Standard Time)
  // is being translated into 13:00:00 Eastern Time (assuming ran on ET)
  // so we trick the backoffice into wrong local time:
  // Wed Jan 01 2020 10:00:00 GMT-0500 (Eastern Standard Time)
  // which will later be converted back using #dateTimeInTimeZone
  dateFromTimeZone(date: Date | string, timezone?: string): Date {
    if (!timezone) timezone = moment.tz.guess();
    let m = moment(date);
    return new Date(moment.tz(m, timezone).format("YYYY-MM-DDTHH:mm:ss"));
  }

  // convert a local date / time to the same hour in UTC - just cause the server expects it 
  // to be in that format :(
  // so "2021-02-03T19:00:00-05:00" will be converted to "2021-02-03T19:00:00Z" (although it's 5 hours off)
  localTimeToSameDateTimeInUTC(date: Date | string) : string {
    return moment(date).format("YYYY-MM-DDTHH:mm:ss") + 'Z';    
  }

  convertTimeZone(date: Date | string, timezone?: string, format?: string): string {
    if (!timezone) timezone = moment.tz.guess();

    if (format) {
      return moment(date).tz(timezone).format(format);
    } else {
      return moment(date).tz(timezone).format();
    }
  }

  getTimezoneByLocation(lat: number, lon: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${moment()
          .add("1", "hour")
          .format("X")}&key=${environment.GOOGLE_API_KEY}`,
      )
      .pipe(
        map((response) => response),
        map((response: any) => {
          if (response && response.status === "OK") {
            return response.timeZoneId;
          } else {
            return null;
          }
        }),
      );
  }

  replaceTimeZone(time: any, newTimeZone: string, oldTimeZone?: string) {
    /*
    if (oldTimeZone) {
      moment.tz.setDefault(oldTimeZone);
    }
    */

    const current = moment(time);
    const newDate = current.clone();
    newDate.tz(newTimeZone);
    newDate.add(current.utcOffset() - newDate.utcOffset(), "minutes");

    return newDate;
  }

  prepareTZForDisplay(time: any, newTimeZone: string) {
    const converted = this.convertTimeZone(time, newTimeZone);
    return this.replaceTimeZone(converted, moment.tz.guess(), newTimeZone);
  }

  switchTimeZone(date, newTimeZone = moment.tz.guess(), format = "") {
    return moment.tz(date, "YYYY-MM-DDTHH:mm:ss", newTimeZone).format(format);
  }

  /*
   *
   * Time functions for new time-related components
   *
   * */
  getTimeSelectList = (): TimeList[] => {
    return [
      { timeValue: "00:00", display: "12:00 AM" },
      { timeValue: "00:15", display: "12:15 AM" },
      { timeValue: "00:30", display: "12:30 AM" },
      { timeValue: "00:45", display: "12:45 AM" },
      { timeValue: "01:00", display: "1:00 AM" },
      { timeValue: "01:15", display: "1:15 AM" },
      { timeValue: "01:30", display: "1:30 AM" },
      { timeValue: "01:45", display: "1:45 AM" },
      { timeValue: "02:00", display: "2:00 AM" },
      { timeValue: "02:15", display: "2:15 AM" },
      { timeValue: "02:30", display: "2:30 AM" },
      { timeValue: "02:45", display: "2:45 AM" },
      { timeValue: "03:00", display: "3:00 AM" },
      { timeValue: "03:15", display: "3:15 AM" },
      { timeValue: "03:30", display: "3:30 AM" },
      { timeValue: "03:45", display: "3:45 AM" },
      { timeValue: "04:00", display: "4:00 AM" },
      { timeValue: "04:15", display: "4:15 AM" },
      { timeValue: "04:30", display: "4:30 AM" },
      { timeValue: "04:45", display: "4:45 AM" },
      { timeValue: "05:00", display: "5:00 AM" },
      { timeValue: "05:15", display: "5:15 AM" },
      { timeValue: "05:30", display: "5:30 AM" },
      { timeValue: "05:45", display: "5:45 AM" },
      { timeValue: "06:00", display: "6:00 AM" },
      { timeValue: "06:15", display: "6:15 AM" },
      { timeValue: "06:30", display: "6:30 AM" },
      { timeValue: "06:45", display: "6:45 AM" },
      { timeValue: "07:00", display: "7:00 AM" },
      { timeValue: "07:15", display: "7:15 AM" },
      { timeValue: "07:30", display: "7:30 AM" },
      { timeValue: "07:45", display: "7:45 AM" },
      { timeValue: "08:00", display: "8:00 AM" },
      { timeValue: "08:15", display: "8:15 AM" },
      { timeValue: "08:30", display: "8:30 AM" },
      { timeValue: "08:45", display: "8:45 AM" },
      { timeValue: "09:00", display: "9:00 AM" },
      { timeValue: "09:15", display: "9:15 AM" },
      { timeValue: "09:30", display: "9:30 AM" },
      { timeValue: "09:45", display: "9:45 AM" },
      { timeValue: "10:00", display: "10:00 AM" },
      { timeValue: "10:15", display: "10:15 AM" },
      { timeValue: "10:30", display: "10:30 AM" },
      { timeValue: "10:45", display: "10:45 AM" },
      { timeValue: "11:00", display: "11:00 AM" },
      { timeValue: "11:15", display: "11:15 AM" },
      { timeValue: "11:30", display: "11:30 AM" },
      { timeValue: "11:45", display: "11:45 AM" },
      { timeValue: "12:00", display: "12:00 PM" },
      { timeValue: "12:15", display: "12:15 PM" },
      { timeValue: "12:30", display: "12:30 PM" },
      { timeValue: "12:45", display: "12:45 PM" },
      { timeValue: "13:00", display: "1:00 PM" },
      { timeValue: "13:15", display: "1:15 PM" },
      { timeValue: "13:30", display: "1:30 PM" },
      { timeValue: "13:45", display: "1:45 PM" },
      { timeValue: "14:00", display: "2:00 PM" },
      { timeValue: "14:15", display: "2:15 PM" },
      { timeValue: "14:30", display: "2:30 PM" },
      { timeValue: "14:45", display: "2:45 PM" },
      { timeValue: "15:00", display: "3:00 PM" },
      { timeValue: "15:15", display: "3:15 PM" },
      { timeValue: "15:30", display: "3:30 PM" },
      { timeValue: "15:45", display: "3:45 PM" },
      { timeValue: "16:00", display: "4:00 PM" },
      { timeValue: "16:15", display: "4:15 PM" },
      { timeValue: "16:30", display: "4:30 PM" },
      { timeValue: "16:45", display: "4:45 PM" },
      { timeValue: "17:00", display: "5:00 PM" },
      { timeValue: "17:15", display: "5:15 PM" },
      { timeValue: "17:30", display: "5:30 PM" },
      { timeValue: "17:45", display: "5:45 PM" },
      { timeValue: "18:00", display: "6:00 PM" },
      { timeValue: "18:15", display: "6:15 PM" },
      { timeValue: "18:30", display: "6:30 PM" },
      { timeValue: "18:45", display: "6:45 PM" },
      { timeValue: "19:00", display: "7:00 PM" },
      { timeValue: "19:15", display: "7:15 PM" },
      { timeValue: "19:30", display: "7:30 PM" },
      { timeValue: "19:45", display: "7:45 PM" },
      { timeValue: "20:00", display: "8:00 PM" },
      { timeValue: "20:15", display: "8:15 PM" },
      { timeValue: "20:30", display: "8:30 PM" },
      { timeValue: "20:45", display: "8:45 PM" },
      { timeValue: "21:00", display: "9:00 PM" },
      { timeValue: "21:15", display: "9:15 PM" },
      { timeValue: "21:30", display: "9:30 PM" },
      { timeValue: "21:45", display: "9:45 PM" },
      { timeValue: "22:00", display: "10:00 PM" },
      { timeValue: "22:15", display: "10:15 PM" },
      { timeValue: "22:30", display: "10:30 PM" },
      { timeValue: "22:45", display: "10:45 PM" },
      { timeValue: "23:00", display: "11:00 PM" },
      { timeValue: "23:15", display: "11:15 PM" },
      { timeValue: "23:30", display: "11:30 PM" },
      { timeValue: "23:45", display: "11:45 PM" },
    ];
  };
}
