import {
  Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';

@Component({
  selector: 'rc-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
  }],
  exportAs: 'picker'
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() required: boolean;
  @Input() name: string;
  @Input() selectedValue: Date;
  @Input() placeholder: string;
  @Input() hideInput: boolean;
  @Input() minDate: Date;
  @Input() maxDate: Date;
  @Output() onDateSelected = new EventEmitter();
  @ViewChild(NgModel) model: NgModel;

  showDatePicker: boolean;
  selectedDate: Date;
  propagateChange = (_: any) => {};

  constructor(
    private _eref: ElementRef
  ) {
    this.showDatePicker = false;

    if (!this.placeholder) this.placeholder = '';
  }

  ngOnInit() {
    this.selectedDate = this.selectedValue;
  }

  writeValue(value: any): void {
    this.selectedDate = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  togglePicker($event?: any) {
    if ($event) $event.stopPropagation();

    this.showDatePicker = !this.showDatePicker;

  }

  @HostListener('document:click', ['$event'])
  onClick(ev: any) {
    if (this.showDatePicker && !this._eref.nativeElement.contains(ev.target)) {
      this.showDatePicker = false;
    }
  }

  onSelected(ev) {
    this.propagateChange(ev);
    this.onDateSelected.emit(ev);
    this.showDatePicker = false;
  }
}
