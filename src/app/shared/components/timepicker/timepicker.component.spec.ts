import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TimepickerModule } from 'ngx-bootstrap';

import { TimepickerComponent } from './timepicker.component';

describe('TimepickerComponent', () => {
  let component: TimepickerComponent;
  let fixture: ComponentFixture<TimepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TimepickerModule.forRoot()],
      declarations: [ TimepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should hide the timepicker on boot', () => {
    expect(fixture.debugElement.queryAll(By.css('.timepicker-wrapper')).length).toBe(0);

  });

  it('should toggle timepicker visibility', () => {
    expect(fixture.debugElement.queryAll(By.css('.timepicker-wrapper')).length).toBe(0);
    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.timepicker-wrapper')).length).toBe(1);

    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.timepicker-wrapper')).length).toBe(0);
  });

  it('should use default placeholder for input', () => {
    component.placeholder = 'test placeholder';
    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input')[0].placeholder).toBe('test placeholder');
  });
});
