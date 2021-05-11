import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AccessorConverter } from "typedoc/dist/lib/converter/nodes";

@Component({
  selector: "rc-range-age-picker",
  templateUrl: "./range-age-picker.component.html",
  styleUrls: ["./range-age-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeAgePickerComponent),
      multi: true,
    },
  ],
})
export class RangeAgePickerComponent implements OnInit, ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() minInterval = 1;
  fromNumber: number;
  toNumber: number;
  isMonth: boolean;

  propagateChange = (_: any) => {};
  constructor() {}

  ngOnInit() {}

  writeValue(value: [number, number, boolean]): void {
    if (!value) value = [this.min, this.max, true];
    this.fromNumber = value[0];
    this.toNumber = value[1];
    this.isMonth = value[2];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  onOptionsSelected(val) {
    let value = val == "true";
    this.writeValue([this.min, this.max, value]);
  }

  onRangeChange(data) {
    this.propagateChange([data.from, data.to, this.isMonth]);
  }

  get minVal() {
    return this.min;
  }

  set minVal(value) {
    if (value >= 1 && value <= 100) {
      this.min = value;
    }
  }

  setMaxVal(value: number) {
    if (value >= 1 && value <= 100) {
      this.max = value;
      this.onRangeChange({ from: this.min, to: value });
      this.writeValue([this.min, value, this.isMonth]);
    }
  }

  setMinVal(value: number) {
    if (value >= 1 && value <= 100) {
      this.min = value;
      this.onRangeChange({ from: value, to: this.max });
      this.writeValue([value, this.max, this.isMonth]);
    }
  }

  decrement() {
    this.minVal--;
    this.onRangeChange({ from: this.minVal, to: this.maxVal });
    this.writeValue([this.minVal, this.maxVal, this.isMonth]);
  }

  increment() {
    this.minVal++;
    this.onRangeChange({ from: this.minVal, to: this.maxVal });
    this.writeValue([this.minVal, this.maxVal, this.isMonth]);
  }

  get maxVal() {
    return this.max;
  }

  set maxVal(value) {
    if (value <= 100) {
      this.max = value;
    }
  }

  decrement_max() {
    this.maxVal--;
    this.onRangeChange({ from: this.minVal, to: this.maxVal });
    this.writeValue([this.minVal, this.maxVal, this.isMonth]);
  }

  increment_max() {
    this.maxVal++;
    this.onRangeChange({ from: this.minVal, to: this.maxVal });
    this.writeValue([this.minVal, this.maxVal, this.isMonth]);
  }
}
