import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePageScheduleAllComponent } from './venue-page-schedule-all.component';

describe('VenuePageScheduleAllComponent', () => {
  let component: VenuePageScheduleAllComponent;
  let fixture: ComponentFixture<VenuePageScheduleAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuePageScheduleAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuePageScheduleAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
