import { Component, Input, OnInit } from "@angular/core";
import { RCLeagueSeason } from "@rcenter/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "rc-season-creator-schedule",
  templateUrl: "./season-creator-schedule.component.html",
  styleUrls: ["./season-creator-schedule.component.scss"],
})
export class SeasonCreatorScheduleComponent implements OnInit {
  @Input() season: RCLeagueSeason;
  @Input() groupName: string;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
