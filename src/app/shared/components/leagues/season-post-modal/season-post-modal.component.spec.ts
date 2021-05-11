import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonPostModalComponent } from './season-post-modal.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastModule } from 'ng2-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

describe('SeasonPostModalComponent', () => {
  let component: SeasonPostModalComponent;
  let fixture: ComponentFixture<SeasonPostModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastModule.forRoot(),
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
      ],
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [ SeasonPostModalComponent ],
      providers: [...APP_PROVIDERS, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
