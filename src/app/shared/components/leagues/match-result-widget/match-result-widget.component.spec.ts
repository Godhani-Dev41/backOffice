import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultWidgetComponent } from './match-result-widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

describe('MatchResultWidgetComponent', () => {
  let component: MatchResultWidgetComponent;
  let fixture: ComponentFixture<MatchResultWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ MatchResultWidgetComponent ],
      providers: [...APP_PROVIDERS, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK],
      schemas: [NO_ERRORS_SCHEMA]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchResultWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
