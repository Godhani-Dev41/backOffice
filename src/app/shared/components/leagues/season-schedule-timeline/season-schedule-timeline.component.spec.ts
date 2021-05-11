import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonScheduleTimelineComponent } from './season-schedule-timeline.component';

describe('SeasonScheduleTimelineComponent', () => {
  let component: SeasonScheduleTimelineComponent;
  let fixture: ComponentFixture<SeasonScheduleTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonScheduleTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonScheduleTimelineComponent);
    component = fixture.componentInstance;
    component.season = {

    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
