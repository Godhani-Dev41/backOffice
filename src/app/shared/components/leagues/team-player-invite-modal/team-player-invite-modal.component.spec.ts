import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { ModalModule } from 'ngx-bootstrap';
import { ToastModule } from 'ng2-toastr';

import { TeamPlayerInviteModalComponent } from './team-player-invite-modal.component';

describe('TeamPlayerInviteModalComponent', () => {
  let component: TeamPlayerInviteModalComponent;
  let fixture: ComponentFixture<TeamPlayerInviteModalComponent>;

  function updateForm(data) {
    component.inviteForm.get('email').setValue(data.email);
    component.inviteForm.get('firstName').setValue(data.firstName);
    component.inviteForm.get('lastName').setValue(data.lastName);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [ToastModule.forRoot(), ReactiveFormsModule, ModalModule.forRoot(), RouterTestingModule],
        declarations: [ TeamPlayerInviteModalComponent ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [...APP_PROVIDERS, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPlayerInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show modal when triggered', () => {
    expect(fixture.debugElement.queryAll(By.css('.modal-backdrop')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('.rc-modal')).length).toBe(1);
    component.showModal(1);

    expect(fixture.debugElement.queryAll(By.css('.rc-modal')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('.modal-backdrop')).length).toBe(1);
  });

  it('should require email to be filled', () => {
    expect(component.inviteForm.valid).toBeFalsy();

    updateForm({email: 'test@gmail.com'});
    expect(component.inviteForm.valid).toBeTruthy();
  });

  it('should validate email address', () => {
    expect(component.inviteForm.valid).toBeFalsy();

    updateForm({email: 'test'});
    expect(component.inviteForm.valid).toBeFalsy();

    updateForm({email: 'test@ddd.'});
    expect(component.inviteForm.valid).toBeFalsy();

    updateForm({email: 'test@ddd.com'});
    expect(component.inviteForm.valid).toBeTruthy();
  });

  it('should add a new invitee to the team invitees', () => {
    component.currentTeamId = 2;
    component.teams = [{
      team: {
        id: 2
      },
      userInvites: [{}]
    }, {
      team: {
        id: 3
      },
      userInvites: []
    }] as any;

    component.addInviteeToTeam([{
      id: 12321,
      invitedUserEmail: 'testingstest@hotmail.com',
      token: 'asd3dasdas'
    }] as any);

    expect(component.teams[0].userInvites.length).toBe(2);
    expect(component.teams[0].userInvites[1].id).toBe(12321);
  });
});
