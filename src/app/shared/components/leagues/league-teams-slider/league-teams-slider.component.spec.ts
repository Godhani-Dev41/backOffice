import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BackgroundImageDirective } from '@app/shared/directives/background-image/background-image.directive';
import { OwlCarouselModule } from '@app/shared/vendor/owl-carousel/owl-carousel.module';
import { TEST_PROVIDERS } from '@app/test.utils';

import { LeagueTeamsSliderComponent } from './league-teams-slider.component';

describe('LeagueTeamsSliderComponent', () => {
  let component: LeagueTeamsSliderComponent;
  let fixture: ComponentFixture<LeagueTeamsSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OwlCarouselModule],
      providers: [...TEST_PROVIDERS],
      declarations: [ LeagueTeamsSliderComponent, BackgroundImageDirective ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeagueTeamsSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
