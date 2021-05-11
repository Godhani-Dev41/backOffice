/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared.module';
import { TEST_PROVIDERS } from '../../../test.utils';
import { APP_PROVIDERS } from '../../services/main';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, RouterTestingModule],
      declarations: [ LoginPageComponent ],
      providers: [...APP_PROVIDERS, ...TEST_PROVIDERS]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be in login mode when initialized', () => {
    expect(component.currentState).toEqual('login');
  });

  it('should be initialized without error', () => {
    expect(component.isError).toBeFalsy();
  });

  it('should change state when change state is called', () => {
    component.isError = true;
    component.goToState('forgot-password');
    expect(component.currentState).toEqual('forgot-password');
    expect(component.isError).toBe(false);
  });

  it('should validate password before submit', () => {
    component.user = {
      email: '',
      password: '123',
      passwordRepeat: '1234'
    };

    expect(component.validatePasswordReset()).toBeTruthy();

    // password length at least 6 chars
    component.user.passwordRepeat = '123';
    expect(component.validatePasswordReset()).toBeTruthy();

    // password must equal
    component.user.password = '123123';
    component.user.passwordRepeat = '123123';
    expect(component.validatePasswordReset()).toBeTruthy();

    // token must be provided
    component.resetToken = '1231213';
    expect(component.validatePasswordReset()).toBeFalsy();
  });
});
