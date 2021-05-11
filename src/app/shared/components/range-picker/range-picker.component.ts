import { Component, forwardRef, Input, OnInit } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AccessorConverter } from "typedoc/dist/lib/converter/nodes";

@Component({
  selector: "rc-range-picker",
  templateUrl: "./range-picker.component.html",
  styleUrls: ["./range-picker.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangePickerComponent),
      multi: true,
    },
  ],
})
export class RangePickerComponent implements OnInit, ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() minInterval = 1;
  fromNumber: number;
  toNumber: number;

  propagateChange = (_: any) => {};
  constructor() {}

  ngOnInit() {}

  writeValue(value: [number, number]): void {
    if (!value) value = [this.min, this.max];
    this.fromNumber = value[0];
    this.toNumber = value[1];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  onRangeChange(data) {
    this.propagateChange([data.from, data.to]);
  }
}
