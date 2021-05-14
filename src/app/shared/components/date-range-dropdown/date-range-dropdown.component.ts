import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DatePipe } from "@angular/common";
import en from "@angular/common/locales/en";
import { en_US, NzI18nService } from "ng-zorro-antd/i18n";

@Component({
  selector: "rc-date-range-dropdown",
  templateUrl: "./date-range-dropdown.component.html",
  styleUrls: ["./date-range-dropdown.component.scss"],
})
export class DateRangeDropdownComponent implements OnInit {
  @Input() labelString: string;
  @Input() size?: string;
  @Input() startDate?: string;
  @Input() endDate?: string;
  @Input() restrictedRange?: string[];
  @Input() disabled?: boolean = false;

  @Output() onSelectChange = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();

  date = new Date();
  dateRange: Date[] = [];
  isEnglish = en;
  dangerousUpdateCss: boolean;

  constructor(private i18n: NzI18nService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.i18n.setLocale(en_US);
    if (this.disabled) this.dangerousUpdateCss = true;
    if (this.startDate) this.dateRange.push(new Date(`${this.startDate}T00:00:00`));
    if (this.endDate) this.dateRange.push(new Date(`${this.endDate}T00:00:00`));
  }

  onChange(result: Date[]): void {
    this.dateRange.splice(0, this.dateRange.length, ...result);
    this.onSelectChange.emit({
      startDate: this.datePipe.transform(this.dateRange[0], "MM/dd/yyyy"),
      endDate: this.datePipe.transform(this.dateRange[1], "MM/dd/yyyy"),
    });
  }
}
