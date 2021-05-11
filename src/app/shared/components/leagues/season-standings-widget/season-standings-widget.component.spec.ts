import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonStandingsWidgetComponent } from './season-standings-widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SeasonStandingsWidgetComponent', () => {
  let component: SeasonStandingsWidgetComponent;
  let fixture: ComponentFixture<SeasonStandingsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonStandingsWidgetComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonStandingsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
