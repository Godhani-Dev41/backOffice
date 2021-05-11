import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLogoAvatarComponent } from './team-logo-avatar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_PROVIDERS } from '@app/test.utils';
import { MediaUrlPipe } from '@app/shared/pipes/media-url.pipe';

describe('TeamLogoAvatarComponent', () => {
  let component: TeamLogoAvatarComponent;
  let fixture: ComponentFixture<TeamLogoAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamLogoAvatarComponent, MediaUrlPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [...APP_PROVIDERS, ...TEST_PROVIDERS]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLogoAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
