import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonRowComponent } from './season-row.component';

describe('SeasonRowComponent', () => {
  let component: SeasonRowComponent;
  let fixture: ComponentFixture<SeasonRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonRowComponent);
    component = fixture.componentInstance;
    component.season = {

    } as any;
    fixture.detectChanges();
  });

});
