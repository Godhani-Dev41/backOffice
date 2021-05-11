import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LocationService } from '@app/shared/services/utils/location.service';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { environment } from '../../../../environments/environment';

import { LocationSearchInputComponent } from './location-search-input.component';

describe('LocationSearchInputComponent', () => {
  let component: LocationSearchInputComponent;
  let fixture: ComponentFixture<LocationSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AgmCoreModule.forRoot({
          apiKey: environment.GOOGLE_API_KEY,
          libraries: ['places']
        }),
        ReactiveFormsModule
      ],
      providers: [LocationService],
      declarations: [
        LocationSearchInputComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
