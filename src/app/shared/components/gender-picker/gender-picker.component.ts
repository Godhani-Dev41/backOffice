import { Component, forwardRef, OnInit } from '@angular/core';
import { RCGenderEnum } from '@rcenter/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rc-gender-picker',
  templateUrl: './gender-picker.component.html',
  styleUrls: ['./gender-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GenderPickerComponent),
    multi: true
  }]
})
export class GenderPickerComponent implements OnInit, ControlValueAccessor {
  selectedGender: RCGenderEnum;
  RCGenderEnum = RCGenderEnum;

  propagateChange = (_: any) => {};

  constructor() {
    this.selectedGender = RCGenderEnum.MALE;
  }

  ngOnInit() {

  }

  selectGender(type: RCGenderEnum) {
    this.selectedGender = type;

    this.propagateChange(type);
  }

  writeValue(value: any): void {
    this.selectedGender = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}
