import { TestBed, inject } from '@angular/core/testing';

import { VenuesService } from './venues.service';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

describe('VenuesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:  [...APP_PROVIDERS, ...TEST_PROVIDERS,  ...TEST_HTTP_MOCK]
    });
  });

  it('should ...', inject([VenuesService], (service: VenuesService) => {
    expect(service).toBeTruthy();
  }));
});
