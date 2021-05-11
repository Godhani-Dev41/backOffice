import { Component, Input, OnInit } from '@angular/core';
import { RCLeague, RCStanding } from '@rcenter/core';

@Component({
  selector: 'rc-standings-table-small',
  templateUrl: './standings-table-small.component.html',
  styleUrls: ['./standings-table-small.component.scss'],
  exportAs: 'standingsTable'
})
export class StandingsTableSmallComponent implements OnInit {

  @Input() standings: RCStanding[];
  @Input() set league(league: RCLeague) {
    try {
      this.percentageOrPoints = league.sportConfigData.standingsView.pointsOrPercentageView;
    } catch (e) {

    }
  }
  percentageOrPoints: 'percentage' | 'points' = 'percentage';
  constructor() { }

  ngOnInit() {

  }

  getPercentage(percent) {
    if (!percent || Number(percent) === 0) return '0';

    return (percent).toFixed(3);
  }

}
