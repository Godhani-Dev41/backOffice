import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RCSeasonTeam } from '@rcenter/core';

@Component({
  selector: 'rc-league-teams-slider',
  templateUrl: './league-teams-slider.component.html',
  styleUrls: ['./league-teams-slider.component.scss']
})
export class LeagueTeamsSliderComponent implements OnChanges {
  @Input() teams: RCSeasonTeam[];
  images: string[];
  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {

  }
}
