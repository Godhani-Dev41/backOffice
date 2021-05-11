import { Component, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenderPickerComponent } from '@app/shared/components/gender-picker/gender-picker.component';

@Component({
  selector: 'rc-level-of-play-selector',
  templateUrl: './level-of-play-selector.component.html',
  styleUrls: ['./level-of-play-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LevelOfPlaySelectorComponent),
    multi: true
  }]
})
export class LevelOfPlaySelectorComponent implements OnInit {
  propagateChange = (_: any) => {};

  selectedLevels: number[];
  constructor() { }

  ngOnInit() {
  }

  isSelected(id) {
    return this.selectedLevels.includes(id);
  }

  selectLevelOfPlay(level: number) {
    if (this.selectedLevels.includes(level)) {
      this.selectedLevels.splice( this.selectedLevels.indexOf(level), 1);
    } else {
      this.selectedLevels.push(level);
    }

    this.propagateChange(this.selectedLevels);
  }

  writeValue(value: any): void {
    this.selectedLevels = value || [];
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
