import { Component, OnInit, Output, EventEmitter, Input, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rc-preset-color-picker',
  templateUrl: './preset-color-picker.component.html',
  styleUrls: ['./preset-color-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PresetColorPickerComponent),
    multi: true
  }],
  exportAs: 'colorPicker'
})
export class PresetColorPickerComponent implements ControlValueAccessor {
  @Output() onSelect = new EventEmitter<string>();
  @Input() currentColor = '#4990e2';

  propagateChange = (_: any) => {};
  visible = false;
  constructor(
    private _eref: ElementRef
  ) { }

  toggleVisibility(): void {
    this.visible = !this.visible;
  }

  hidePicker() {
    this.visible = false;
  }

  selectColor(color: string): void {
    this.setColor(color);
    this.hidePicker();

    this.propagateChange(color);
    this.onSelect.emit(color);
  }

  setColor(color: string): void {
    this.currentColor = color;
  }

  /**
   * Responsible to close the widget when clicked outside of it
   * @param ev
   */
  @HostListener('document:click', ['$event'])
  onClick(ev: any) {
    if (!this._eref.nativeElement.contains(ev.target)) {
      this.hidePicker();
    }
  }

  get colors(): string[] {
    return [
      '#ff323b',
      '#50e3c2',
      '#9012fe',
      '#4990e2',
      '#4A90E2',
      '#24c875',
      '#005786',
      '#612398',
      '#feaa00',
      '#ff547d',
      '#008d74',
      '#9012fe',
      '#e38aff',
      '#bd0fe1',
      '#cd0000',
      '#4ac4e6',
      '#89B5C8',
      '#67c301',
      '#f38238',
      '#ffcf00',
      '#b7e013'
    ];
  }

  writeValue(value: any): void {
    this.setColor(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

}
