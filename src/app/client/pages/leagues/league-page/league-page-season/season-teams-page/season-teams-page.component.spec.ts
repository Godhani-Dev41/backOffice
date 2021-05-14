import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@app/shared.module';
import { TeamEditModalComponent } from '@app/shared/components/leagues/team-edit-modal/team-edit-modal.component';
import {
  TeamMemberTransferModalComponent
} from '@app/shared/components/leagues/team-member-transfer-modal/team-member-transfer-modal.component';
import { TeamPlayerInviteModalComponent } from '@app/shared/components/leagues/team-player-invite-modal/team-player-invite-modal.component';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import * as _ from 'lodash';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SelectModule } from 'ng2-select';

import { SeasonTeamsPageComponent } from './season-teams-page.component';
import { DragulaModule, DragulaService } from 'ng2-dragula';

class MockActiveRoute {
  parent: any;
  constructor() {
    this.parent = {
      snapshot: {
        paramMap: {
          get: () => 1
        }
      },
      parent: {
        snapshot: {
          paramMap: {
            get: () => 1
          }
        },
      }
    };
  }
}

describe('SeasonTeamsPageComponent', () => {
  let component: SeasonTeamsPageComponent;
  let fixture: ComponentFixture<SeasonTeamsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          DragulaModule,
          SelectModule,
          ReactiveFormsModule,
          ModalModule.forRoot(),
          SharedModule,
          RouterTestingModule
        ],
        declarations: [
          SeasonTeamsPageComponent,
          TeamMemberTransferModalComponent,
          TeamPlayerInviteModalComponent,
          TeamEditModalComponent
        ],
        providers: [
          ...APP_PROVIDERS,
          ...TEST_PROVIDERS,
          ...TEST_HTTP_MOCK,
          {
            provide: ActivatedRoute,
            useClass: MockActiveRoute
          }
        ],
        schemas: [ NO_ERRORS_SCHEMA ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonTeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // tslint:disable-next-line:quotemark whitespace max-line-length
    component.seasonTeams = [{"id":3,"seasonId":170,"teamId":192,"updatedAt":"2017-03-05T16:43:15.079Z","team":{"id":192,"name":"Team B","description":null,"capacity":0,"allowNewMembers":true,"private":false,"publishedDate":"2017-03-01T10:25:43.921Z","isPublished":true,"levelOfPlay":[1,2,3,4],"sports":2,"minAge":18,"maxAge":35,"gender":1,"createdAt":"2017-03-01T10:25:44.245Z","updatedAt":"2017-03-01T10:25:44.245Z","teamMembers":[{"id":191,"teamId":192,"userId":3,"status":2,"role":1,"createdAt":"2017-03-01T10:25:47.013Z","updatedAt":"2017-03-01T10:25:47.013Z","user":{"fullName":"Amidan Roth","id":3,"firstName":"Amidan","lastName":"Roth","email":"amidanr@gmail.com","privateProfile":true,"profilePicture":{"id":20,"url":"https://graph.facebook.com/10153843091430662/picture?type=large","fileType":null,"mediaType":1,"provider":null,"mediaKey":null}}}],"address":{"id":879,"city":"Tel Aviv-Yafo","street":"Yigal Alon Street","streetNum":"51","aptNum":null,"country":"Israel","state":"Tel Aviv District","geo":[34.79131940000002,32.061087]},"logo":null,"mainMedia":null},"userInvites":[{"id":177,"token":"f94ac824-b84f-413c-b86d-25fbaf54f5aa","invitedUserEmail":"player.B2@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/PAFvHr5QlB","name":"First 6 Last 6","creatorId":192,"creatorType":"team","userCreatorId":3,"ownerId":null},{"id":178,"token":"d5864a9f-c471-418d-9cc0-75bdab1dda6e","invitedUserEmail":"player.B3@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/UIgNHr5QlB","name":"First 7 Last 7","creatorId":192,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:36.539Z","updatedAt":"2017-03-08T16:06:36.539Z"},{"id":179,"token":"48359358-df0b-4537-b320-558f5f81ed58","invitedUserEmail":"player.B4@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/ZQR4Hr5QlB","name":"First 8 Last 8","creatorId":192,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:36.556Z","updatedAt":"2017-03-08T16:06:36.556Z"},{"id":180,"token":"80fbae64-3597-4555-a2b1-de904ed7c1f4","invitedUserEmail":"player.B1@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/Js4dHr5QlB","name":"First 5 Last 5","creatorId":192,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:36.554Z","updatedAt":"2017-03-08T16:06:36.554Z"}]},{"id":2,"seasonId":170,"teamId":193,"createdAt":"2017-03-05T16:43:13.932Z","updatedAt":"2017-03-05T16:43:13.932Z","team":{"id":193,"name":"Team C","description":null,"capacity":0,"allowNewMembers":true,"private":false,"publishedDate":"2017-03-01T10:25:47.525Z","isPublished":true,"levelOfPlay":[1,2,3,4],"sports":2,"minAge":18,"maxAge":35,"gender":1,"createdAt":"2017-03-01T10:25:47.834Z","updatedAt":"2017-03-01T10:25:47.834Z","teamMembers":[{"id":192,"teamId":193,"userId":3,"status":2,"role":1,"createdAt":"2017-03-01T10:25:50.291Z","updatedAt":"2017-03-01T10:25:50.291Z","user":{"fullName":"Amidan Roth","id":3,"firstName":"Amidan","lastName":"Roth","email":"amidanr@gmail.com","privateProfile":true,"profilePicture":{"id":20,"url":"https://graph.facebook.com/10153843091430662/picture?type=large","fileType":null,"mediaType":1,"provider":null,"mediaKey":null}}}],"address":{"id":879,"city":"Tel Aviv-Yafo","street":"Yigal Alon Street","streetNum":"51","aptNum":null,"country":"Israel","state":"Tel Aviv District","geo":{"coordinates":[34.79131940000002,32.061087]}},"logo":null,"mainMedia":null},"userInvites":[{"id":181,"token":"88c020f7-59c6-4d07-8aa8-4ec3a7d67072","invitedUserEmail":"player.C3@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":3,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/DliBVG5QlB","name":"First 11 Last 11","creatorId":193,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:39.861Z","updatedAt":"2017-03-08T16:06:39.861Z"},{"id":182,"token":"a3a61b10-3743-470a-918f-b2438a872602","invitedUserEmail":"player.C2@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/ydHjVG5QlB","name":"First 10 Last 10","creatorId":193,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:39.857Z","updatedAt":"2017-03-08T16:06:39.857Z"},{"id":183,"token":"0e9e8819-0938-493f-9352-f28ecd409ea8","invitedUserEmail":"player.C1@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/pXuKUG5QlB","name":"First 9 Last 9","creatorId":193,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:39.871Z","updatedAt":"2017-03-08T16:06:39.871Z"},{"id":184,"token":"1205cd1a-6b2d-43cb-a7b9-3bab83ffc0c9","invitedUserEmail":"player.C4@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/ItTSVG5QlB","name":"First 12 Last 12","creatorId":193,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:39.885Z","updatedAt":"2017-03-08T16:06:39.885Z"}]},{"id":4,"seasonId":170,"teamId":194,"createdAt":"2017-03-05T16:43:16.188Z","updatedAt":"2017-03-05T16:43:16.188Z","team":{"id":194,"name":"Team D","description":null,"capacity":0,"allowNewMembers":true,"private":false,"publishedDate":"2017-03-01T10:25:50.800Z","isPublished":true,"levelOfPlay":[1,2,3,4],"sports":2,"minAge":18,"maxAge":35,"gender":1,"createdAt":"2017-03-01T10:25:51.126Z","updatedAt":"2017-03-01T10:25:51.126Z","teamMembers":[{"id":193,"teamId":194,"userId":3,"status":2,"role":1,"createdAt":"2017-03-01T10:25:53.503Z","updatedAt":"2017-03-01T10:25:53.503Z","user":{"fullName":"Amidan Roth","id":3,"firstName":"Amidan","lastName":"Roth","email":"amidanr@gmail.com","privateProfile":true,"profilePicture":{"id":20,"url":"https://graph.facebook.com/10153843091430662/picture?type=large","fileType":null,"mediaType":1,"provider":null,"mediaKey":null}}}],"address":{"id":879,"city":"Tel Aviv-Yafo","street":"Yigal Alon Street","streetNum":"51","aptNum":null,"country":"Israel","state":"Tel Aviv District","geo":{"coordinates":[34.79131940000002,32.061087]}},"logo":null,"mainMedia":null},"userInvites":[{"id":142,"token":"e0232f0a-d226-40df-814f-5a423eba02fe","invitedUserEmail":"player.D4@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/JFFgdYlZhB","name":null,"creatorId":194,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-06T08:11:52.046Z","updatedAt":"2017-03-06T08:11:52.046Z"},{"id":185,"token":"95b637b4-0c64-4919-8017-79e7e9047637","invitedUserEmail":"player.D1@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/MXXKTT5QlB","name":"First 13 Last 13","creatorId":194,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:42.581Z","updatedAt":"2017-03-08T16:06:42.581Z"},{"id":186,"token":"a6a13cb3-878e-4202-baa9-63571de26423","invitedUserEmail":"player.D4@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/xoySWT5QlB","name":"First 16 Last 16","creatorId":194,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:42.589Z","updatedAt":"2017-03-08T16:06:42.589Z"},{"id":187,"token":"ef4109c0-ed44-4bd3-9bd8-03a2810597a6","invitedUserEmail":"player.D2@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/3tmTUT5QlB","name":"First 14 Last 14","creatorId":194,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:42.593Z","updatedAt":"2017-03-08T16:06:42.593Z"},{"id":188,"token":"3db13de9-319c-43f6-9522-eca64a20f19a","invitedUserEmail":"player.D3@reccenter.me","invitedUserPhone":"(617) 555-0126","invitedUserId":null,"data":null,"userRegister":null,"inviteOrigin":2,"createdLink":"https://vjyu.test-app.link/gS9JVT5QlB","name":"First 15 Last 15","creatorId":194,"creatorType":"team","userCreatorId":3,"ownerId":null,"createdAt":"2017-03-08T16:06:42.787Z","updatedAt":"2017-03-08T16:06:42.787Z"}]}] as any;
  });

  it('should generate SeasonTeamsVM array', () => {
    component.createTeamsViewModel();
    expect(component.seasonTeamsVM.length).toEqual(3);
    expect(component.seasonTeamsVM[0].members.length).toEqual(5);
    expect(component.seasonTeamsVM[0].members[0].isRegistered).toEqual(true);
    expect(component.seasonTeamsVM[0].members[0].name).toEqual('Amidan Roth');
    expect(component.seasonTeamsVM[0].members[0].userId).toEqual(3);
    expect(component.seasonTeamsVM[0].members[1].isRegistered).toEqual(false);
    expect(component.seasonTeamsVM[0].members[1].name).toEqual('First 6 Last 6');
    expect(component.seasonTeamsVM[0].members[1].userId).toEqual(undefined);
  });

  it('should send token invites to single player', () => {
    spyOn(component, 'sendInvites');
    component.onPlayerCardResendInvite({
      token: '12321321'
    } as any);

    expect(component.sendInvites).toHaveBeenCalledWith(['12321321']);
  });

  it('should send tokens re invite to all players', () => {
    spyOn(component, 'sendInvites');
    component.invitedList = [{token: '123'}, {token: '124'}] as any;
    component.sendMultipleInvites(true);

    expect(component.sendInvites).toHaveBeenCalledWith([ '123', '124' ]);
  });

  it('should send tokens re invite to all players except ones already sent', () => {
    spyOn(component, 'sendInvites');
    component.invitedList = [{token: '123', isInviteResent: true}, {token: '124'}] as any;
    component.sendMultipleInvites(true);

    expect(component.sendInvites).toHaveBeenCalledWith([ '124' ]);
  });

  it('should send token re invites only to selected users that didn\'t receive invitation already', () => {
    spyOn(component, 'sendInvites');
    component.invitedList = [{
      token: '123', selected: true
    }, {
      token: '124'
    }, {
      token: '123', isInviteResent: true, selected: true
    }] as any;

    component.sendMultipleInvites();

    expect(component.sendInvites).toHaveBeenCalledWith([ '123' ]);
  });

  it('should mark invitee as invite resent after its token was submitted', () => {
    component.createTeamsViewModel();
    component.createInvitedList();

    component.markMembersWithInviteResent(['a3a61b10-3743-470a-918f-b2438a872602']);
    expect(component.invitedList[0].isInviteResent).toBe(true);

    let foundMember;
    component.seasonTeamsVM.forEach((i) => {
      const found = _.find(i.members, k => k.token === 'a3a61b10-3743-470a-918f-b2438a872602');
      if (found) foundMember = found;
    });

    expect(foundMember.isInviteResent).toBe(true);
  });

  // They should be only as team members
  it('should remove from team members users that already have been registered', () => {
    component.createTeamsViewModel();

    expect(component.seasonTeamsVM[1].members.length).toBe(4);
  });

  it('should remove user from invited list after he is registered', () => {
    component.createTeamsViewModel();
    component.createInvitedList();

    expect(component.invitedList.length).toBe(12);
  });
});
