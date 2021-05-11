import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '../../../../test.utils';
import { APP_PROVIDERS } from '../../../services/main';

import { LeagueDetailStatsComponent } from './league-detail-stats.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('LeagueDetailStatsComponent', () => {
  let component: LeagueDetailStatsComponent;
  let fixture: ComponentFixture<LeagueDetailStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [ LeagueDetailStatsComponent ],
      providers: [APP_PROVIDERS, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueDetailStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
