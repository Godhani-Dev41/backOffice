import { Component, Input, OnInit } from '@angular/core';
import { RCLeagueSeason } from '@rcenter/core';

@Component({
  selector: 'rc-league-seasons',
  templateUrl: './league-seasons.component.html',
  styleUrls: ['./league-seasons.component.scss']
})
export class LeagueSeasonsComponent implements OnInit {
  @Input() seasons: RCLeagueSeason[];
  constructor() { }

  ngOnInit() {
  }

}
