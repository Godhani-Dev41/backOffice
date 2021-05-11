import { Component, Input, OnInit } from '@angular/core';
import { RCSeasonRound } from '@rcenter/core';

@Component({
  selector: 'rc-round-results-widget',
  templateUrl: './round-results-widget.component.html',
  styleUrls: ['./round-results-widget.component.scss']
})
export class RoundResultsWidgetComponent implements OnInit {
  @Input() round: RCSeasonRound;
  @Input() border: boolean;
  @Input() zoom: boolean;
  @Input() serverGenerated: boolean;
  constructor() {

  }

  ngOnInit() {

  }
}
