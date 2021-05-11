import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "rc-season-creator-basic",
  templateUrl: "./season-creator-basic.component.html",
  styleUrls: ["./season-creator-basic.component.scss"],
})
export class SeasonCreatorBasicComponent implements OnInit {
  @Input() groupName: string;
  @Input() form: FormGroup;

  description_clean_text: string;
  longDescription_clean_text: string;

  constructor() {
    this.description_clean_text = "";
    this.longDescription_clean_text = "";
  }

  ngOnInit() {}

  descInputChanged(newDesc) {
    this.longDescription_clean_text = newDesc;
    this.form.get(this.groupName).get("longDescription").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {}

  shortDescInputChanged(newDesc) {
    this.description_clean_text = newDesc;
    this.form.get(this.groupName).get("description").setValue(newDesc);
  }

  shortDescInputLengthChanged(newLength) {}
}
