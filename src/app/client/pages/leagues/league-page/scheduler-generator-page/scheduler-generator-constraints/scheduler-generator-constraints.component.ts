import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { LeaguesFormService } from '@app/shared/services/leagues/leagues-form.service';

@Component({
  selector: 'rc-scheduler-generator-constraints',
  templateUrl: './scheduler-generator-constraints.component.html',
  styleUrls: ['./scheduler-generator-constraints.component.scss']
})
export class SchedulerGeneratorConstraintsComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() playOfWeeks: number;
  get constraintsArray() {
    return (this.form.get('constraints') as FormArray);
  }

  get teamConstraintsArray() {
    return this.form.get('teamConstraints') as FormArray;
  }

  constructor(
    private leagueFormService: LeaguesFormService
  ) { }

  ngOnInit() {
  }

  convertDayName(day: number) {
    let dayOfWeek;
    switch (day) {
      case 2:
        dayOfWeek = 'MON';
        break;
      case 3:
        dayOfWeek = 'TUE';
        break;
      case 4:
        dayOfWeek = 'WED';
        break;
      case 5:
        dayOfWeek = 'THU';
        break;
      case 6:
        dayOfWeek = 'FRI';
        break;
      case 7:
        dayOfWeek = 'SAT';
        break;
      case 8:
        dayOfWeek = 'SUN';
        break;
    }

    return dayOfWeek;
  }

  addCustomConstraint() {
    this.constraintsArray.push(this.leagueFormService.getConstraintItem('custom', true));
  }

  startDateSelected(date, control: FormGroup) {
    control.get('endDate').setValue(date);
  }

  selectContraintType(type: 'fullDay' | 'hours', control: FormGroup, event) {
    if (control.get('constraintDuration').value === type) {
      return event.preventDefault();
    }

    control.get('constraintDuration').setValue(type);
  }
}
