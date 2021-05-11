import { TestBed, inject } from '@angular/core/testing';

import { EventsService } from './events.service';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

describe('EventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK,
        EventsService
      ]
    });
  });

  it('should ...', inject([EventsService], (service: EventsService) => {
    expect(service).toBeTruthy();
  }));
});
