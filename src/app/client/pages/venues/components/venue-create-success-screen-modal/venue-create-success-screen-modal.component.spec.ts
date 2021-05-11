import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueCreateSuccessScreenModalComponent } from './venue-create-success-screen-modal.component';

describe('VenueCreateSuccessScreenModalComponent', () => {
  let component: VenueCreateSuccessScreenModalComponent;
  let fixture: ComponentFixture<VenueCreateSuccessScreenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueCreateSuccessScreenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueCreateSuccessScreenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
