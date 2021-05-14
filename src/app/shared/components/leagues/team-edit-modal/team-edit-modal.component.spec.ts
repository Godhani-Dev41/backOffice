import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastModule } from 'ng2-toastr';

import { TeamEditModalComponent } from './team-edit-modal.component';

class MockActiveRoute {
  parent: any;
  constructor() {
    this.parent = {
      snapshot: { params: {seasonId: 1}},
      parent: {
        snapshot: { params: {id: 3}},
      }
    };
  }
}

describe('TeamEditModalComponent', () => {
  let component: TeamEditModalComponent;
  let fixture: ComponentFixture<TeamEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          ToastModule.forRoot(),
          ReactiveFormsModule,
          ModalModule.forRoot(),
          RouterTestingModule
        ],
        declarations: [ TeamEditModalComponent ],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          ...APP_PROVIDERS,
          ...TEST_PROVIDERS,
          ...TEST_HTTP_MOCK,
          {
            provide: ActivatedRoute,
            useClass: MockActiveRoute
          }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should reset form state', () => {
    component.loading = true;
    component.team = { id: 1, name: 'Hello World' };
    component.mainImage = 'asdasdas';
    component.logoImage = 'ddfdf';
    component.editMode = true;

    component.reset();

    expect(component.loading).toBe(false);
    expect(component.mainImage).toBeFalsy();
    expect(component.logoImage).toBeFalsy();
    expect(component.team).toBeFalsy();
    expect(component.editMode).toBeFalsy();
  });
});
