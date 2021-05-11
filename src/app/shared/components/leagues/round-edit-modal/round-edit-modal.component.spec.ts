import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundEditModalComponent } from './round-edit-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';

describe('RoundEditModalComponent', () => {
  let component: RoundEditModalComponent;
  let fixture: ComponentFixture<RoundEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastModule.forRoot(),
        FormsModule,
        ModalModule.forRoot(),
        ReactiveFormsModule
      ],
      declarations: [ RoundEditModalComponent ],
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
    fixture = TestBed.createComponent(RoundEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
