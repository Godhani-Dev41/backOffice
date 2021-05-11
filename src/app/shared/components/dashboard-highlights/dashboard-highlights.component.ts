import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "rc-dashboard-highlights",
  templateUrl: "./dashboard-highlights.component.html",
  styleUrls: ["./dashboard-highlights.component.scss"],
})
export class DashboardHighlightsComponent implements OnInit {
  @Input() title: string;
  @Input() titleIcon: string;
  @Input() value?: string = "";
  @Input() desc?: string = "";

  constructor() {}

  ngOnInit() {}
}
