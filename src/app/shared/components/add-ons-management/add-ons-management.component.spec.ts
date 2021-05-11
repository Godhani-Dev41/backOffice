import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnsManagementComponent } from './add-ons-management.component';

describe('AddOnsManagementComponent', () => {
  let component: AddOnsManagementComponent;
  let fixture: ComponentFixture<AddOnsManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOnsManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOnsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
