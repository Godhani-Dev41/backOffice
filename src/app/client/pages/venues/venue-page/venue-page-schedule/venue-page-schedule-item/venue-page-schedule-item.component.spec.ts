import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePageScheduleItemComponent } from './venue-page-schedule-item.component';

describe('VenuePageScheduleItemComponent', () => {
  let component: VenuePageScheduleItemComponent;
  let fixture: ComponentFixture<VenuePageScheduleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuePageScheduleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuePageScheduleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
