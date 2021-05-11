import trimStart from "lodash/trimStart";
import { getDay, getYear, format } from "date-fns";

const BLANK_CHARACTER = "\u00A0";

const padTo2Digits = (n: number) => (n > 9 ? String(n) : `0${n}`);

export function getCurrentYear() {
  return getYear(Date.now());
}

/**
 * Get today's day number.
 */
export function getToday() {
  return getDay(Date.now());
}

/**
 * Get the month name by the month number
 *
 * @param month - the month number
 */
export function getMonthName(month: number) {
  const monthsNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return monthsNames[month - 1];
}

// so .. there's a HUGE bug in the API that expects all times passed as if they happened in UTC
// so if something happens in Israel 2021-01-21 at 19:00, you'll notice these:
// "2021-01-21T19:00:00+02:00" --->> breaks the server
// "2021-01-21T19:00:00Z"      --->> makes the server happy
// ALTHOUGH it's wrong - the server's happy about that
export function fixBrokenTZDate(sDateTime: string) {
  const d = new Date(sDateTime);
  const dateStr = `${d.getFullYear()}-${padTo2Digits(d.getMonth() + 1)}-${padTo2Digits(d.getDate())}`;
  const timeStr = `${padTo2Digits(d.getHours())}:${padTo2Digits(d.getMinutes())}:00Z`;

  return `${dateStr}T${timeStr}`;
}

// RC stores in some places days 2-8 instead of 0-6
export function getFixedDayName(day: number, short = true) {
  return getDayName(day - 2, short);
}

/**
 * Get the day name by the day number
 *
 * @param day
 * @param short - boolean if to return first 3 characters
 *                or the full day name
 *
 * @returns string - The day name
 */
export function getDayName(day: number, short = true) {
  const daysNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  if (short) {
    return daysNames[day].slice(0, 3);
  }

  return daysNames[day];
}

export function getActivityOpenCloseHours(open: string, close: string, dayOfWeek: string) {
  // This constant date has no significance
  // since we want the time only. You can put
  // any valid date you want.
  const openHour = format(new Date(`2020-12-31T${open}`), "ha");
  const closeHour = format(new Date(`2020-12-31T${close}`), "ha");

  // Days range from api is: 2-8 (Mon-Sun)
  return `${getDayName(Number(dayOfWeek) - 2)}, ${openHour} - ${closeHour}`;
}

// export function getActivityDayTime(activityTimes: ActivityTime[]) {
//   if (!activityTimes || !Array.isArray(activityTimes) || !activityTimes.length) {
//     return BLANK_CHARACTER;
//   }

//   const activityTime = activityTimes[0];

//   if (!activityTime.open || !activityTime.close) {
//     return BLANK_CHARACTER;
//   }

//   return getActivityOpenCloseHours(activityTime.open, activityTime.close, activityTime.dayOfWeek);
// }

export const parseHoursRange = ({ from, to }: { from: string; to: string }) => `${from} - ${to}`;

function apiDateStringToDate(date: string): Date {
  if (date.endsWith("Z")) {
    return new Date(date.slice(0, -1));
  }

  return new Date(`${date}T00:00:00`);
}

/**
 * returns something like Apr 1
 */
export function getDateString(date: Date): string {
  return `${getMonthName(date.getMonth() + 1)} ${date.getDate()}`;
}

export function getDateStringWithYear(date: Date): string {
  return `${getMonthName(date.getMonth() + 1)} ${date.getDate()}, 
  ${date.getFullYear()}`;
}

export function getDates(date: string) {
  return getDateString(apiDateStringToDate(date));
}

export function getDatesRange(startDate: string, endDate?: string) {
  const start = apiDateStringToDate(startDate);
  if (!endDate) {
    return getDateString(start);
  }
  // TODO: fix eslint to accept react ?? as well
  const end = apiDateStringToDate(endDate || "");
  return `${getDateString(start)} - ${getDateString(end)}`;
}

export function getDatesRangeWithYears(startDate: string, endDate?: string) {
  const start = apiDateStringToDate(startDate);
  if (!endDate) {
    return getDateString(start);
  }
  // TODO: fix eslint to accept react ?? as well
  const end = apiDateStringToDate(endDate || "");
  return `${getDateStringWithYear(start)} - ${getDateStringWithYear(end)}`;
}

export function getDatesRangeWithYearsOnSameYear(startDate: string, endDate?: string) {
  const start = apiDateStringToDate(startDate);
  if (!endDate) {
    return getDateString(start);
  }
  // TODO: fix eslint to accept react ?? as well
  const end = apiDateStringToDate(endDate || "");

  return start.getFullYear() === end.getFullYear() ?
    `${getDateString(start)} - ${getDateStringWithYear(end)}` :
    `${getDateStringWithYear(start)} - ${getDateStringWithYear(end)}`;
}


export function getTimes(startDateWithTime: string, endDateWithTime: string) {
  // TODO: fix eslint to accept react ? as well (startDateWithTime.?)
  let [, startTime] = startDateWithTime ? startDateWithTime.split("T") : ["", ""];
  // TODO: fix eslint to accept react ? as well (endDateWithTime.?)
  let [, endTime] = endDateWithTime ? endDateWithTime.split("T") : ["", ""];
  startTime = startTime.slice(0, 8);
  endTime = endTime.slice(0, 8);
  return getTimeRangeDisplay(startTime, endTime);
}

function time24ToAmPm(hour: number, minutes: number): string {
  const amOrPm = hour >= 12 ? "PM" : "AM";
  if (hour > 12) {
    hour = hour - 12;
  }

  return `${hour}:${padTo2Digits(minutes)}${amOrPm}`;
}

export function getTime24ToAmPmDisplay(time: string): string {
  const [hour, minutes] = time.split(":");
  return time24ToAmPm(Number(hour), Number(minutes));
}

export function getTimeRangeDisplay(startTime: string, endTime: string) {
  return `${getTime24ToAmPmDisplay(startTime)} - ${getTime24ToAmPmDisplay(endTime)}`;
}

// export function getDateTimeByActivity(activityTime: ActivityTime) {
//   return getTimeRangeDisplay(activityTime.open, activityTime.close);
// }

export const getDayMonth = (date: string) => {
  const d = apiDateStringToDate(date);
  return `${getMonthName(d.getMonth() + 1)} ${d.getDate()}`;
};

export const getDateYear = (date: string) => {
  const dateYear = apiDateStringToDate(date);
  return ` ${dateYear.getFullYear()}`;
};

// converts an array of numbers into ranges
// e.g, [0,1,2,4,5] => [[0,2],[4,5]]
function getRanges(array: number[]) {
  const ranges: number[][] = [];
  for (let i = 0; i < array.length; i++) {
    const rstart = array[i];
    let rend = rstart;
    while (array[i + 1] - array[i] === 1) {
      rend = array[i + 1]; // increment the index if the numbers sequential
      i++;
    }
    ranges.push(rstart === rend ? [rstart] : [rstart, rend]);
  }
  return ranges;
}

// export function getDaysAndTimeForActivityTimes(activityTimes: ActivityTime[]): string[] {
//   // create a map of key: startTime-endTime => value [ days ]
//   const byTime = activityTimes.reduce((acc: { [key: string]: ActivityTime[] }, v) => {
//     const times = getTimeRangeDisplay(v.open, v.close);
//     if (!acc[times]) {
//       acc[times] = [];
//     }
//     acc[times].push(v);
//     return acc;
//   }, {});

//   const daysAndTimes: string[] = [];
//   for (const time in byTime) {
//     const days = byTime[time].map((activity) => Number(activity.dayOfWeek)).sort();
//     // we get ranges either of 2 days (such as monday to thursday) == [2,5]
//     // or 1 day (meaning no range): monday [2]
//     const daysRange = getRanges(days).reduce((acc, range) => {
//       acc += acc ? "," : "";
//       acc += getFixedDayName(range[0]);
//       if (range.length === 2) {
//         acc += `-${getFixedDayName(range[1])}`;
//       }
//       return acc;
//     }, "");
//     daysAndTimes.push(`${daysRange} ${time}`);
//   }
//   return daysAndTimes;
// }
