import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceAllocationManagementComponent } from './space-allocation-management.component';

describe('SpaceAllocationManagementComponent', () => {
  let component: SpaceAllocationManagementComponent;
  let fixture: ComponentFixture<SpaceAllocationManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpaceAllocationManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpaceAllocationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
