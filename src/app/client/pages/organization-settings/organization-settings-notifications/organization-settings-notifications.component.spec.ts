import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationSettingsNotificationsComponent } from './organization-settings-notifications.component';

describe('OrganizationSettingsNotificationsComponent', () => {
  let component: OrganizationSettingsNotificationsComponent;
  let fixture: ComponentFixture<OrganizationSettingsNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationSettingsNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationSettingsNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
