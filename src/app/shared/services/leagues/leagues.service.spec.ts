import { inject, TestBed } from '@angular/core/testing';
import { RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';
import { SharedModule } from '../../../shared.module';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '../../../test.utils';
import { APP_PROVIDERS } from '../main';

describe('LeaguesService', () => {
  let leagueDetails: any[];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      providers:  [...APP_PROVIDERS, ...TEST_PROVIDERS,  ...TEST_HTTP_MOCK]
    });

    leagueDetails = [{
      'detailType': 7,
      'ordinal': 2,
      'title': 'Min/Week',
      'data': '100'
    }, {
      'detailType': 5,
      'ordinal': 3,
      'title': null,
      'data': [3, 4, 1],
    }, {
      'detailType': 4,
      'ordinal': 103,
      'title': null,
      'data': 1
    }, {
      'detailType': 2,
      'ordinal': 101,
      'title': null,
      'data': 18,
    }, {
      'detailType': 3,
      'ordinal': 103,
      'title': null,
      'data': 90
    }, {
      'detailType': 1,
      'ordinal': 103,
      'title': 'Test',
      'data': 'test value'
    }];
  });

  it('should fetch league by id',  inject([LeaguesService, MockBackend],  (service:  LeaguesService, mockBackend: MockBackend) => {
    mockBackend.connections.subscribe((c) => {
      expect(c.request.method).toBe(RequestMethod.Get);
      expect(c.request.url).toEqual(`${environment.CS_URLS.API_ROOT}/leagues/1`);
    });

    service.getLeagueById(1);
  }));

  it('should fetch organization leagues',  inject([LeaguesService, MockBackend],  (service:  LeaguesService, mockBackend: MockBackend) => {
    service.currentOrganization = { id: 1 } as any;
    mockBackend.connections.subscribe((c) => {
      expect(c.request.method).toBe(RequestMethod.Get);
      expect(c.request.url).toEqual(`${environment.CS_URLS.API_ROOT}/organizations/1/leagues?datascope=full&limit=100&`);
    });

    service.getLeagues();
  }));

  it('should generate league details VM with length of 7',  inject([LeaguesService],  (service:  LeaguesService) => {
    expect(service.parseLeagueDetails(leagueDetails).length).toEqual(4);
  }));

  it('should generate Age & Gender detail VM',  inject([LeaguesService],  (service:  LeaguesService) => {
    const gender = service.parseLeagueDetails(leagueDetails)[0];

    expect(gender.title).toEqual('Age & Gender');
    expect(gender.icon).toEqual('icon-rc-person-icon');
    expect(gender.items.length).toEqual(2);
    expect(gender.items[0].title).toEqual('Co-ed');
    expect(gender.items[0].value).toEqual('icon-rc-person-icon');
    expect(gender.items[0].noTitle).toBeFalsy();

    expect(gender.items[1].title).toEqual('Years');
    expect(gender.items[1].value).toEqual('18+');
    expect(gender.items[1].noTitle).toEqual(true);
  }));

  it('should generate Min/Week detail VM',  inject([LeaguesService],  (service:  LeaguesService) => {
    const minWeek = service.parseLeagueDetails(leagueDetails)[1];

    expect(minWeek.title).toEqual('Min/Week');
    expect(minWeek.icon).toEqual('icon-rc-min-per-week');
    expect(minWeek.items.length).toEqual(1);
    expect(minWeek.items[0].title).toEqual('Minutes');
    expect(minWeek.items[0].value).toEqual('100');
    expect(minWeek.items[0].noTitle).toBeFalsy();
  }));

  it('should generate LevelOfPlay detail VM',  inject([LeaguesService],  (service:  LeaguesService) => {
    const minWeek = service.parseLeagueDetails(leagueDetails)[2];

    expect(minWeek.title).toEqual('Level of Play');
    expect(minWeek.icon).toEqual('icon-rc-star-icon');
    expect(minWeek.items.length).toEqual(3);
    expect(minWeek.items[0].title).toEqual('Advanced');
    expect(minWeek.items[0].value).toEqual('icon-rc-star-icon');
    expect(minWeek.items[0].noTitle).toBeFalsy();

    expect(minWeek.items[1].noTitle).toBeTruthy();
  }));

  it('should generate Other detail VM',  inject([LeaguesService],  (service:  LeaguesService) => {
    const minWeek = service.parseLeagueDetails(leagueDetails)[3];

    expect(minWeek.title).toEqual('Test');
    expect(minWeek.icon).toEqual('icon-rc-star-icon');
    expect(minWeek.items.length).toEqual(1);
    expect(minWeek.items[0].title).toEqual('Test');
    expect(minWeek.items[0].value).toEqual('test value');
    expect(minWeek.items[0].noTitle).toBeFalsy();
  }));

  it('should return the team captain',  inject([LeaguesService],  (service:  LeaguesService) => {
    const team = {
      teamMembers: [{
        role: 1,
        user: {
          firstName: 'Test Captain'
        }
      }, {
        role: null,
        user: {
          firstName: 'Test Captain'
        }
      }]
    } as any;

    const captain = service.findTeamCaptain(team);

    expect(captain.firstName).toBe('Test Captain');
  }));

  it('should return the null when no team captain is available',  inject([LeaguesService],  (service:  LeaguesService) => {
    const team = {
      teamMembers: [{
        role: null,
        user: {
          firstName: 'Test Captain'
        }
      }, {
        role: null,
        user: {
          firstName: 'Test Captain'
        }
      }]
    } as any;

    const captain = service.findTeamCaptain(team);

    expect(captain).toBeFalsy();
  }));

  it('should send a create match request',  inject([LeaguesService, MockBackend],  (service:  LeaguesService, mockBackend: MockBackend) => {
    service.currentSeasonId = 2;
    service.currentLeagueId = 1;

    mockBackend.connections.subscribe((c) => {
      expect(c.request.method).toBe(RequestMethod.Post);
      expect(c.request.url).toEqual(`${environment.CS_URLS.API_ROOT}/leagues/1/season/2/rounds/3/match`);

      const body = JSON.parse(c.request.getBody());

      expect(body).toEqual({
        title: 'Hello world'
      });
    });

    service.createSeasonMatch(3, {
      title: 'Hello world'
    } as any);
  }));
});
