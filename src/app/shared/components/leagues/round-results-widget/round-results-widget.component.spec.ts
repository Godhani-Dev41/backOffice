import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundResultsWidgetComponent } from './round-results-widget.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RoundResultsWidgetComponent', () => {
  let component: RoundResultsWidgetComponent;
  let fixture: ComponentFixture<RoundResultsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoundResultsWidgetComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundResultsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
