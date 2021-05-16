import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastModule } from 'ng2-toastr';

import { TeamMemberTransferModalComponent } from './team-member-transfer-modal.component';
import { NgSelectModule } from '@ng-select/ng-select';

describe('TeamMemberTransferModalComponent', () => {
  let component: TeamMemberTransferModalComponent;
  let fixture: ComponentFixture<TeamMemberTransferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ToastModule.forRoot(),
        ModalModule.forRoot(),
        NgSelectModule,
        RouterTestingModule
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TeamMemberTransferModalComponent
      ],
      providers: [
        ...APP_PROVIDERS,
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberTransferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reset form state', () => {
    component.loading = true;
    component.team = {id: 1} as any;
    component.userId = 1;
    component.leagueId = 2;
    component.seasonId = 4;

    component.reset();

    expect(component.loading).toBe(false);
    expect(component.leagueId).toBeFalsy();
    expect(component.seasonId).toBeFalsy();
    expect(component.team).toBeFalsy();
  });
});
