import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { DatepickerComponent } from '@app/shared/components/datepicker/datepicker.component';
import { MatchEditModalComponent } from '@app/shared/components/leagues/match-edit-modal/match-edit-modal.component';
import { LocationSearchInputComponent } from '@app/shared/components/location-search-input/location-search-input.component';
import { TimepickerComponent } from '@app/shared/components/timepicker/timepicker.component';
import { BackgroundImageDirective } from '@app/shared/directives/background-image/background-image.directive';
import { TruncatePipe } from '@app/shared/pipes/truncate.pipe';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { OwlCarouselModule } from '@app/shared/vendor/owl-carousel/owl-carousel.module';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DatepickerModule, ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng2-select';
import { ToastModule } from 'ng2-toastr';
import { environment } from '../../../../../environments/environment';

import { SeasonRoundMatchesSliderComponent } from './season-round-matches-slider.component';
import { MomentDatePipe } from '@app/shared/pipes/moment-date.pipe';

describe('SeasonRoundMatchesSliderComponent', () => {
  let component: SeasonRoundMatchesSliderComponent;
  let fixture: ComponentFixture<SeasonRoundMatchesSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          ToastModule.forRoot(),
          AgmCoreModule.forRoot({
            apiKey: environment.GOOGLE_API_KEY,
            libraries: ['places']
          }),
          ReactiveFormsModule,
          RouterTestingModule,
          OwlCarouselModule,
          ModalModule.forRoot(),
          SelectModule,
          FormsModule,
          DatepickerModule.forRoot(),
          TimepickerModule.forRoot()
        ],
        providers: [...APP_PROVIDERS, ...TEST_PROVIDERS, ...TEST_HTTP_MOCK],
        declarations: [
          MomentDatePipe,
          MatchEditModalComponent,
          SeasonRoundMatchesSliderComponent,
          BackgroundImageDirective,
          TruncatePipe,
          LocationSearchInputComponent,
          TimepickerComponent,
          DatepickerComponent,
        ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonRoundMatchesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return true if the match has already happened', () => {
    const isPast = component.isPastMatch({ startDate: '2016-03-05T16:43:15.079Z' } as any);

    expect(isPast).toEqual(true);
  });

  it('should return false yet happened', () => {
    const isPast = component.isPastMatch({ startDate: '2040-03-05T16:43:15.079Z' } as any);

    expect(isPast).toEqual(false);
  });
});
