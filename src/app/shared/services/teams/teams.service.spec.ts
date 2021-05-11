import { inject, TestBed } from '@angular/core/testing';
import { RequestMethod } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { SharedModule } from '@app/shared.module';
import { RCInviteeObject, TeamsService } from '@app/shared/services/teams/teams.service';
import { ImagesService } from '@app/shared/services/utils/images.service';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      providers:  [ImagesService, TeamsService, AuthenticationService, OrganizationsService, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK]
    });
  });

  it('should send team invites',  inject([
    TeamsService, MockBackend
  ], (teamsService:  TeamsService, mockBackend: MockBackend) => {
    const invites: RCInviteeObject[] = [{
      name: 'Test',
      source: 'phone',
      emails: ['test@ccc.com']
    }];

    mockBackend.connections.subscribe((c) => {
      const body = JSON.parse(c.request.getBody());

      expect(c.request.method).toBe(RequestMethod.Post);
      expect(body.tokend).toBe(true);
      expect(body.bulk).toBe(true);
      expect(body.generateUrl).toBe(true);
      expect(body.invitees).toEqual(invites);

      expect(c.request.url).toEqual(`${environment.CS_URLS.API_ROOT}/teams/1/invite`);
    });
    teamsService.organization = {id: 1} as any;
    teamsService.sendTeamInvite(1, invites);
  }));
});
