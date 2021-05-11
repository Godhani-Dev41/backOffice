import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuesComingSoonComponent } from './venues-coming-soon.component';

describe('VenuesComingSoonComponent', () => {
  let component: VenuesComingSoonComponent;
  let fixture: ComponentFixture<VenuesComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuesComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuesComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
