import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchResultsModalComponent } from './match-results-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { MomentDatePipe } from '@app/shared/pipes/moment-date.pipe';

describe('MatchResultsModalComponent', () => {
  let component: MatchResultsModalComponent;
  let fixture: ComponentFixture<MatchResultsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ToastModule.forRoot(),
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
      ],
      declarations: [ MatchResultsModalComponent, MomentDatePipe ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ...APP_PROVIDERS,
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchResultsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
