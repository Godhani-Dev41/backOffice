import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TimeList, TimeService } from "@app/shared/services/utils/time.service";
import { TranslationEn } from "../../../../assets/i18n/en";

export interface DaysOfWeek {
  index: number;
  active: boolean;
  startTimeValue: string;
  finishTimeValue: string;
}

@Component({
  selector: "rc-week-days-hours-select",
  templateUrl: "./week-days-hours-select.component.html",
  styleUrls: ["./week-days-hours-select.component.scss"],
})
export class WeekDaysHoursSelectComponent implements OnInit {
  @Input() weekData: DaysOfWeek[];
  @Input() labelString?: string = "";
  @Input() disabled?: boolean = false;
  @Output() onChange = new EventEmitter<DaysOfWeek[]>();

  daysOfWeekNames: string[] = TranslationEn.daysOfWeek;

  timeList: TimeList[];
  startTimeValue: string;
  finishTimeValue: string;
  dangerousUpdateCss: boolean = false;

  constructor(timeService: TimeService) {
    this.timeList = timeService.getTimeSelectList();
  }

  ngOnInit() {
    if (this.disabled) this.dangerousUpdateCss = true;
  }

  onChangeHandle = () => {
    this.onChange.emit(this.weekData);
  };
}
