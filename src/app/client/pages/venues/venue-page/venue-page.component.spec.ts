import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePageComponent } from './venue-page.component';

describe('VenuePageComponent', () => {
  let component: VenuePageComponent;
  let fixture: ComponentFixture<VenuePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
