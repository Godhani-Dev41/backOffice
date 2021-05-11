import { Component, Input, OnInit } from '@angular/core';
import { RCSeasonRoundMatch } from '@rcenter/core';
import * as _ from 'lodash';
import { SportsService } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-match-result-widget',
  templateUrl: './match-result-widget.component.html',
  styleUrls: ['./match-result-widget.component.scss']
})
export class MatchResultWidgetComponent implements OnInit {
  @Input() match: RCSeasonRoundMatch;
  constructor(private sportsService: SportsService) { }

  ngOnInit() {
  }

  getSportName(sportNum: number) {
    const sport = this.sportsService.getSport(sportNum);

    if (sport) {
      return _.capitalize(sport.name);
    }
  }
}
