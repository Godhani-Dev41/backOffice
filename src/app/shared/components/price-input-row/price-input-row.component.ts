import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RCProgramPricing, RCProgramPricingDisplay } from "@app/shared/services/programs/programs.service";

@Component({
  selector: "rc-price-input-row",
  templateUrl: "./price-input-row.component.html",
  styleUrls: ["./price-input-row.component.scss"],
})
export class PriceInputRowComponent implements OnInit {
  @Input() labelString: string;
  @Input() subLabelString: string;
  @Input() priceName: string;
  @Input() numValue: number;
  @Input() showDateRange?: boolean = false;
  @Input() showSwitch?: boolean = true;
  @Input() min?: number = 0;
  @Input() max?: number = 9999999;
  @Input() basePrice?: number;
  @Input() switchValue?: boolean = true;
  @Output() onChange = new EventEmitter<RCProgramPricingDisplay>();

  startDate: string;
  endDate: string;

  discountPercent: number = 0;

  constructor() {}

  ngOnInit() {
    if (this.numValue) this.discountPercent = (1 - Math.round(this.numValue / this.basePrice)) * 100;
  }

  onChangePrice = () => {
    this.basePrice > this.numValue
      ? (this.discountPercent = 100 - (this.numValue * 100) / this.basePrice)
      : (this.discountPercent = 0);

    this.onChange.emit({
      price: this.numValue,
      currency: "USD",
      name: this.priceName,
      startDate: this.startDate,
      endDate: this.endDate,
      active: this.switchValue,
    });
  };

  onChangeDate = (data: { startDate: string; endDate: string }) => {
    this.startDate = data.startDate;
    this.endDate = data.endDate;

    this.onChange.emit({
      price: this.numValue,
      currency: "USD",
      name: this.priceName,
      startDate: data.startDate,
      endDate: data.endDate,
      active: this.switchValue,
    });
  };

  onSwitchChange = () => {
    this.onChange.emit({
      price: this.numValue,
      currency: "USD",
      name: this.priceName,
      startDate: this.startDate,
      endDate: this.endDate,
      active: this.switchValue,
    });
  }
}
