import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleStatisticsSidebarComponent } from './schedule-statistics-sidebar.component';

describe('ScheduleStatisticsSidebarComponent', () => {
  let component: ScheduleStatisticsSidebarComponent;
  let fixture: ComponentFixture<ScheduleStatisticsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleStatisticsSidebarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleStatisticsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
