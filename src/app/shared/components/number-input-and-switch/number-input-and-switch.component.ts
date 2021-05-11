import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "rc-number-input-and-switch",
  templateUrl: "./number-input-and-switch.component.html",
  styleUrls: ["./number-input-and-switch.component.scss"],
})
export class NumberInputAndSwitchComponent implements OnInit {
  @Input() labelString: string;
  @Input() numValue: number;
  @Input() min: number;
  @Input() max: number;
  @Output() onNumChange = new EventEmitter<number>();

  switchValue: boolean;

  constructor() {}

  ngOnInit() {
    if (this.numValue) this.switchValue = true;
  }

  onSwitchChange = () => {
    if (!this.switchValue) {
      this.onNumChange.emit(null);
    } else {
      if (this.numValue) {
        this.onNumChange.emit(this.numValue);
      }
    }
  };

  onNumberChange = () => {
    this.onNumChange.emit(this.numValue);
  };
}
