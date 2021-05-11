import { inject, TestBed } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared.module';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '../../../test.utils';
import { APP_PROVIDERS } from '../main';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      providers:  [...APP_PROVIDERS, ...TEST_PROVIDERS,  ...TEST_HTTP_MOCK]
    });
  });

  it('should fetch league by id',  inject(
    [AuthenticationService, MockBackend],
    (service:  AuthenticationService, mockBackend: MockBackend) => {
/*    mockBackend.connections.subscribe((c) => {
      expect(c.request.method).toBe(RequestMethod.Get);
      expect(c.request.url).toEqual(`${environment.CS_URLS.API_ROOT}/leagues/1`);
    });*/

    expect(service.isLoggedIn()).toBeFalsy();
  }));
});
