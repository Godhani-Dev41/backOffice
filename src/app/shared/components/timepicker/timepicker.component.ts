import {
  ApplicationRef,
  ChangeDetectorRef,
  Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, NgZone, OnChanges,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'rc-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimepickerComponent),
    multi: true
  }]
})
export class TimepickerComponent implements OnChanges, ControlValueAccessor {
  @Input() inline: boolean;
  @Input() name: string;
  @Input() required: boolean;
  @Input() placeholder: string;
  @Output() onChange = new EventEmitter<Date>();
  @Input() selectedValue: Date;
  @Input() minTime: Date;

  selectedTime: Date;
  showDatePicker: boolean;
  propagateChange = (_: any) => { };
  constructor(
    private appRef: ApplicationRef,
    private _eref: ElementRef
  ) {
    this.showDatePicker = false;

    if (!this.placeholder) this.placeholder = '';
  }

  writeValue(value: any): void {
    if (value)
      this.selectedTime = moment(value).toDate();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() { }


  ngOnChanges(changes) {
    if (changes['selectedValue']) {
      this.selectedTime = this.selectedValue;
    }
  }

  togglePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  @HostListener('document:click', ['$event'])
  onClick(ev: any) {
    if (!this._eref.nativeElement.contains(ev.target)) {
      this.showDatePicker = false;
    }
  }

  onSelect(data) {
    let timeToSet = data;
    if (this.minTime && data < this.minTime) {
      timeToSet = moment(this.minTime).toDate();
      this.selectedTime = timeToSet;
    }
    this.propagateChange(timeToSet);
    this.onChange.emit(timeToSet);
  }

  changeTriggered() {
    this.selectedTime = moment(this.selectedTime).toDate();
    this.onSelect(this.selectedTime);
  }
}
