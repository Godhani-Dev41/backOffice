import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsComingSoonComponent } from './widgets-coming-soon.component';

describe('WidgetsComingSoonComponent', () => {
  let component: WidgetsComingSoonComponent;
  let fixture: ComponentFixture<WidgetsComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
