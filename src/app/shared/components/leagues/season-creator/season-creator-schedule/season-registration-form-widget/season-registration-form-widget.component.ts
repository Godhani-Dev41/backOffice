import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "rc-season-registration-form-widget",
  templateUrl: "./season-registration-form-widget.component.html",
  styleUrls: ["./season-registration-form-widget.component.scss"],
})
export class SeasonRegistrationFormWidgetComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() referenceGroupName?: string;
  @Input() startMinDate: Date;
  @Input() startMaxDate: Date;
  @Input() endMinDate: Date;
  @Input() endMaxDate: Date;

  showingDiscounts: boolean = false;
  discountType: string;
  productPrice: number = 0;

  get groupControl() {
    return this.form.get("creatorSchedule").get(this.groupName);
  }

  get referenceGroupControl() {
    return this.form.get("creatorSchedule").get(this.referenceGroupName);
  }

  constructor(private zone: NgZone) {}

  ngOnInit() {}

  displayDiscount(type: string) {
    this.showingDiscounts = true;
    this.discountType = type;
    if (this.discountType === "individual") this.productPrice = this.groupControl.get("individualPrice").value;
    if (this.discountType === "teamPerPlayer") this.productPrice = this.groupControl.get("teamPerPlayerPrice").value;
    if (this.discountType === "team") this.productPrice = this.groupControl.get("teamPrice").value;
  }

  closeDiscounts() {
    this.showingDiscounts = false;
    this.discountType = "";
    this.productPrice = 0;
  }

  saveEntitlements(values) {
    if (this.discountType === "individual") this.groupControl.get("individualEntitlements").setValue(values);
    if (this.discountType === "teamPerPlayer") this.groupControl.get("teamPerPlayerEntitlements").setValue(values);
    if (this.discountType === "team") this.groupControl.get("teamEntitlements").setValue(values);
    this.showingDiscounts = false;
  }

  togglePriceItem(type: "individualActive" | "teamActive" | "teamPerPlayerActive") {
    const value = !!this.groupControl.get(type).value;

    if (type === "teamPerPlayerActive" && !value) {
      this.groupControl.get("teamActive").setValue(false);
    } else if (type === "teamActive" && !value) {
      this.groupControl.get("teamPerPlayerActive").setValue(false);
    }

    this.groupControl.get(type).setValue(!value);
  }

  toggleActive() {
    this.groupControl.get("active").setValue(!this.groupControl.get("active").value);
  }
}
