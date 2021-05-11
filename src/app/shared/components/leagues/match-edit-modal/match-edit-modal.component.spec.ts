import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationSearchInputComponent } from '@app/shared/components/location-search-input/location-search-input.component';
import { TimepickerComponent } from '@app/shared/components/timepicker/timepicker.component';
import { APP_PROVIDERS } from '@app/shared/services/main';
import { TEST_HTTP_MOCK, TEST_PROVIDERS } from '@app/test.utils';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { DatepickerModule, ModalModule, TimepickerModule } from 'ngx-bootstrap';
import { SelectModule } from 'ng2-select';
import { environment } from '../../../../../environments/environment';
import { DatepickerComponent } from '../../datepicker/datepicker.component';

import { MatchEditModalComponent } from './match-edit-modal.component';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { VenueSearchInputComponent } from '@app/shared/components/venue-search-input/venue-search-input.component';

class MockActiveRoute {
  parent: any;
  constructor() {
    this.parent = {
        snapshot: { params: {seasonId: 1}},
        parent: {
          snapshot: { params: {id: 3}},
        }
      };
  }
}
describe('MatchEditModalComponent', () => {
  let component: MatchEditModalComponent;
  let fixture: ComponentFixture<MatchEditModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AgmCoreModule.forRoot({
          apiKey: environment.GOOGLE_API_KEY,
          libraries: ['places']
        }),
        SelectModule,
        FormsModule,
        DatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        ReactiveFormsModule,
        ModalModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        LocationSearchInputComponent,
        TimepickerComponent,
        DatepickerComponent,
        MatchEditModalComponent,
        VenueSearchInputComponent
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        ...APP_PROVIDERS,
        ...TEST_PROVIDERS,
        ...TEST_HTTP_MOCK,
        {
          provide: ActivatedRoute,
          useClass: MockActiveRoute
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show modal when triggered', () => {
    expect(fixture.debugElement.queryAll(By.css('.modal-backdrop')).length).toBe(0);
    expect(fixture.debugElement.queryAll(By.css('.rc-modal')).length).toBe(1);

    component.showModal(4);
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.rc-modal')).length).toBe(1);
    expect(fixture.debugElement.queryAll(By.css('.modal-backdrop')).length).toBe(1);
  });
});
