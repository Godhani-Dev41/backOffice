import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramSeasonSpacesPageComponent } from './program-season-spaces-page.component';

describe('ProgramSeasonSpacesPageComponent', () => {
  let component: ProgramSeasonSpacesPageComponent;
  let fixture: ComponentFixture<ProgramSeasonSpacesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramSeasonSpacesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramSeasonSpacesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
