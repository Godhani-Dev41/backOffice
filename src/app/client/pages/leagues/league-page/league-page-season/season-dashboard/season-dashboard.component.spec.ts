import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared.module';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

import { SeasonDashboardComponent } from './season-dashboard.component';
import { ModalModule } from 'ngx-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedPagesModule } from '@app/shared/shared.pages.module';


describe('SeasonDashboardComponent', () => {
  let component: SeasonDashboardComponent;
  let fixture: ComponentFixture<SeasonDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ModalModule.forRoot(),
        SharedModule,
        RouterTestingModule,
        SharedPagesModule
      ],
      providers: [
        ...APP_PROVIDERS,
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
