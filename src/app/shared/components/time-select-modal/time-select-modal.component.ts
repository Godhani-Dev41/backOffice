import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TimeService } from '@app/shared/services/utils/time.service';
import { RCLeagueSeason } from '@rcenter/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment-timezone';

@Component({
  selector: 'rc-bulk-change-time-modal',
  templateUrl: './time-select-modal.component.html',
  styleUrls: ['./select-time-modal.component.scss'],
  exportAs: 'modal'
})
export class BulkChangeTimeModalComponent implements OnInit {
  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  @Output() onSubmit = new EventEmitter();
  @Input() season: RCLeagueSeason;
  matchForm: FormGroup;
  constructor(
    private timeService: TimeService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.matchForm = this.fb.group({
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  showModal() {
    this.modal.show();
  }

  submit(data) {

    const dateObject = {
      startDate: this.timeService.replaceTimeZone(this.assignTimeToDate(data.startTime, data.startDate), this.season.seasonLeague.timezone),
      endDate: this.timeService.replaceTimeZone(this.assignTimeToDate(data.endTime, data.startDate), this.season.seasonLeague.timezone),
    };

    this.onSubmit.emit(dateObject);
    this.modal.hide();
  }



  /**
   * When time is selected from timepicker it is
   * assigned as the hour and the minute of the selected date
   * @param timeObject
   * @param date
   * @returns { Moment }
   */
  assignTimeToDate(timeObject: Date, date: Date): moment.Moment {
    const hour = Number(moment(timeObject).format('HH'));
    const minute = Number(moment(timeObject).format('mm'));

    return moment(date).hour(hour).minute(minute);
  }

  timeChanged(data: Date, type: 'start' | 'end') {
    if (type === 'start') {
      this.matchForm.get('endTime').setValue(moment(data).add(1, 'hour'));
    }
  }
}
