import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DatepickerModule } from 'ngx-bootstrap';

import { DatepickerComponent } from './datepicker.component';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DatepickerModule.forRoot(), CommonModule, FormsModule ],
      declarations: [ DatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should hide the datepicker on boot', () => {
    expect(fixture.debugElement.queryAll(By.css('.rc-datepicker')).length).toBe(0);

  });

  it('should toggle datepicker visibility', () => {
    expect(fixture.debugElement.queryAll(By.css('.rc-datepicker')).length).toBe(0);
    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.rc-datepicker')).length).toBe(1);

    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.rc-datepicker')).length).toBe(0);
  });

  it('should use default placeholder for input', () => {
    component.placeholder = 'test placeholder';
    component.togglePicker();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('input')[0].placeholder).toBe('test placeholder');
  });
});
