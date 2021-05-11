import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared.module';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_PROVIDERS } from '@app/test.utils';

import { AdminLoginPageComponent } from './admin-login-page.component';

describe('AdminLoginPageComponent', () => {
  let component: AdminLoginPageComponent;
  let fixture: ComponentFixture<AdminLoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, FormsModule, SharedModule, RouterTestingModule],
        declarations: [ AdminLoginPageComponent ],
        providers: [...APP_PROVIDERS, ...TEST_PROVIDERS],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
