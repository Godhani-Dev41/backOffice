import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IRCLeagueDetail, RCLeagueDetailTypeEnum } from '@rcenter/core';

@Injectable()
export class LeaguesFormService {

  constructor(
    private fb: FormBuilder
  ) { }

  getDefaultFormatItem(
    type: RCLeagueDetailTypeEnum = RCLeagueDetailTypeEnum.OTHER,
    active?: boolean,
    ordinal?: number,
    mandatory?: boolean
  ) {
    return this.fb.group({
      type: type,
      customValue: '',
      title: '',
      value: '',
      secondValue: '',
      ordinal: ordinal !== undefined ? ordinal : '',
      active: active || false,
      mandatory: mandatory || false
    });
  }

  getDefaultFormatsArray() {
    return this.fb.array([
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.MATCHLENGTH, true, 1),
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.SURFACE, true, 2),
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.GAMESSEASON, true, 3),
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.MINWEEK, true, 4),
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.FORMAT, true, 5),
      this.getDefaultFormatItem(RCLeagueDetailTypeEnum.PLAYERSPERTEAM, true, 6)
    ]);
  }

  extractLeagueDetailsObjects(leagueDetails: IRCLeagueDetail[]) {
    if (!leagueDetails) return;

    const minAge = leagueDetails.find((i) => i.detailType === RCLeagueDetailTypeEnum.MINAGE);
    const maxAge = leagueDetails.find((i) => i.detailType === RCLeagueDetailTypeEnum.MAXAGE);
    const gender = leagueDetails.find((i) => i.detailType === RCLeagueDetailTypeEnum.GENDER);
    const levelOfPlay = leagueDetails.find((i) => i.detailType === RCLeagueDetailTypeEnum.LEVELOFPLAY);

    const otherDetails = leagueDetails.filter((i) => {
      return i.detailType !== RCLeagueDetailTypeEnum.MINAGE && i.detailType !== RCLeagueDetailTypeEnum.MAXAGE &&
        i.detailType !== RCLeagueDetailTypeEnum.GENDER && i.detailType !== RCLeagueDetailTypeEnum.LEVELOFPLAY;
    });

    return {
      age: [(minAge && minAge.data), (maxAge && maxAge.data)],
      gender: gender && gender.data,
      levelOfPlay: levelOfPlay && levelOfPlay.data,
      otherDetails: otherDetails
    };
  }

  convertLeagueDetailsToVM(leagueDetails: IRCLeagueDetail[]) {
    return leagueDetails.map((i) => {
      const dataObject = {
        type: i.detailType,
        customValue: i.isCustom ? i.data : '',
        title: i.title,
        value: i.data,
        ordinal: i.ordinal,
        active: true,
        secondValue: ''
      };

      if (i.data !== null && typeof i.data === 'object') {
        dataObject.value = i.data.min;
        dataObject.secondValue = i.data.max;
      }

      return dataObject;
    }).sort((a, b) => a.ordinal - b.ordinal);
  }


  getConstraintItem(type: 'holiday' | 'custom', active: boolean, title?: string, startDate?: Date, endDate?: Date): FormGroup {
    return this.fb.group({
      type: type,
      active: [active],
      title: [title || ''],
      startDate: [startDate || ''],
      endDate: [endDate || ''],
      constraintDuration: 'fullDay'
    });
  }
}
