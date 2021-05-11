import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { RCLeague, RCStanding } from '@rcenter/core';

@Component({
  selector: 'rc-season-standings-widget',
  templateUrl: './season-standings-widget.component.html',
  styleUrls: ['./season-standings-widget.component.scss']
})
export class SeasonStandingsWidgetComponent implements OnInit, OnChanges {
  @Input() standings: RCStanding[];
  @Input() league: RCLeague;
  @Input() border: boolean;
  @Input() zoom: boolean;
  @Input() serverGenerated: boolean;
  percentageOrPoints: 'points' | 'percentage' = 'points';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    if (changes.league) {
      try {
        this.percentageOrPoints = this.league.sportConfigData.standingsView.pointsOrPercentageView;
      } catch (e) {

      }
    }
  }

}
