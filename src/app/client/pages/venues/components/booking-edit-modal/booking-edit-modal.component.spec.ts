import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEditModalComponent } from './booking-edit-modal.component';

describe('BookingEditModalComponent', () => {
  let component: BookingEditModalComponent;
  let fixture: ComponentFixture<BookingEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingEditModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
