import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'rc-season-creator-form-activity-row',
  templateUrl: './season-creator-form-activity-row.component.html',
  styleUrls: ['./season-creator-form-activity-row.component.scss']
})
export class SeasonCreatorFormActivityRowComponent implements OnInit {
  @Input() title: string;
  @Input() groupName: string;
  @Input() form;
  @Output() onRemove = new EventEmitter();
  get formArray(): FormArray {
    return this.form.get('activityTime').get(this.groupName) as FormArray;
  };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {

  }

  addSlot() {
    this.formArray.push(this.fb.group({
      startTime: moment().hour(18).minute(0),
      endTime: moment().hour(21).minute(0),
    }));
  }

  remove(i) {
    this.formArray.removeAt(i);
  }
}
