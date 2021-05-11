import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeagueDateGamesComponent } from './league-date-games.component';

describe('LeagueDateGamesComponent', () => {
  let component: LeagueDateGamesComponent;
  let fixture: ComponentFixture<LeagueDateGamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeagueDateGamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueDateGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.activityTimes = [];
  });


  it('should transform activity times to VM structure', () => {
    component.transformActivityTimes([{
      close: '02:20:00',
      open: '04:20:00',
      dayOfWeek: 2,
      parentType: 'season',
      parentId: 0,
      id: 9
    }, {
      close: '02:20:00',
      open: '04:20:00',
      dayOfWeek: 3,
      parentType: 'season',
      parentId: 0,
      id: 9
    }, {
      close: '01:20:00',
      open: '18:20:00',
      dayOfWeek: 3,
      parentType: 'season',
      parentId: 0,
      id: 9
    }]);

    expect(component.activityTimesVM.length).toEqual(2);
    expect(component.activityTimesVM[0].hours).toEqual('04:20AM-02:20AM');
    expect(component.activityTimesVM[0].days).toEqual(['Monday', 'Tuesday']);
    expect(component.activityTimesVM[1].hours).toEqual('06:20PM-01:20AM');
  });
});
