import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LoadingBtnComponent } from './loading-btn.component';

describe('LoadingBtnComponent', () => {
  let component: LoadingBtnComponent;
  let fixture: ComponentFixture<LoadingBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingBtnComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show loading only when loading', () => {
    expect(fixture.debugElement.queryAll(By.css('span')).length).toBe(0);

    component.loading = true;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('span')).length).toBe(1);
  });

  it('should hide text when loading', () => {
    component.text = 'Hello World';
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.innerText).toBe('Hello World');
    component.loading = true;
    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('button'))[0].nativeElement.innerText).toBe('');
  });
});
