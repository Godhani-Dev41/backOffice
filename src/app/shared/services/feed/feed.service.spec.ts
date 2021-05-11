import { TestBed, inject } from '@angular/core/testing';

import { FeedService } from './feed.service';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('FeedService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        ...APP_PROVIDERS,
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK,
        FeedService
      ]
    });
  });

  it('should ...', inject([FeedService], (service: FeedService) => {
    expect(service).toBeTruthy();
  }));
});
