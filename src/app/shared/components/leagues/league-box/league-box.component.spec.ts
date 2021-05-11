import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import * as moment from 'moment';

import { LeagueBoxComponent } from './league-box.component';
import { RCLeagueDetailTypeEnum } from '@rcenter/core';
import { SportsService } from '@app/shared/services/utils/sports.service';

describe('LeagueBoxComponent', () => {
  let component: LeagueBoxComponent;
  let fixture: ComponentFixture<LeagueBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [SportsService],
      declarations: [
        LeagueBoxComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueBoxComponent);
    component = fixture.componentInstance;
    component.league = {
      mainMedia: { url: 'sadass' },
      sports: [],
      leagueSeasons: [{
        startDate: moment('02/16/2017', 'MM/DD/YYYY').toDate(),
        endDate: moment('03/30/2017', 'MM/DD/YYYY').toDate()
      }, {
        startDate: moment('01/01/2017', 'MM/DD/YYYY').toDate(),
        endDate: moment('02/28/2017', 'MM/DD/YYYY').toDate()
      }, {
        startDate: moment('02/14/2016', 'MM/DD/YYYY').toDate(),
        endDate: moment('03/16/2016', 'MM/DD/YYYY').toDate()
      }]
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return max and min dates string', () => {
    const dateStr = component.getLeagueDates();

    expect(dateStr).toBe('02/14/16 - 03/30/17');
  });

  it('should return multi sport icon', () => {
    expect(component.getSportIcon([ 1, 2 ])).toBe('icon-outlineicn-sport-multi');

    expect(component.getSportIcon([])).toBe('icon-outlineicn-sport-multi');
  });

  it('should return sport icon', () => {
    const icon = component.getSportIcon([ 1 ]);

    expect(icon).toBe('icon-outlineicn-sport-baseball');
  });

  it('should return level of play texts', () => {
    expect(component.getLevelOfPlayTexts()).toBe('Not Specified');
    component.league.leagueDetails = [{
      detailType: RCLeagueDetailTypeEnum.LEVELOFPLAY,
      data: [ 1, 2]
    }];

    expect(component.getLevelOfPlayTexts()).toBe('Beginner, Intermediate');
    component.league.leagueDetails = [{
      detailType: RCLeagueDetailTypeEnum.LEVELOFPLAY,
      data: [{ name: 'beginner' }]
    }] as any;

    expect(component.getLevelOfPlayTexts()).toBe('Beginner');
  });

  it('should return seasons count by their type', () => {
    expect(component.getSeasonCountByRegistrationStatus('open')).toEqual(0);
    component.league.leagueSeasons[0].seasonTiming = 'future';
    component.league.leagueSeasons[1].seasonTiming = 'current';
    expect(component.getSeasonCountByRegistrationStatus('open')).toEqual(1);
    expect(component.getSeasonCountByRegistrationStatus('playing')).toEqual(1);
    expect(component.getSeasonCountByRegistrationStatus('closed')).toEqual(1);

    component.league.leagueSeasons[1].seasonTiming = 'future';
    expect(component.getSeasonCountByRegistrationStatus('open')).toEqual(2);

    component.league.leagueSeasons[0].seasonTiming = 'past';
    expect(component.getSeasonCountByRegistrationStatus('closed')).toEqual(2);
  });
});
