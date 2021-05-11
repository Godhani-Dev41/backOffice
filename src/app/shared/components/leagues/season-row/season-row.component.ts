import { Component, Input, OnInit } from '@angular/core';
import { RCLeagueSeason } from '@rcenter/core';


@Component({
  selector: 'rc-season-row',
  templateUrl: './season-row.component.html',
  styleUrls: ['./season-row.component.scss']
})
export class SeasonRowComponent implements OnInit {
  @Input() season: RCLeagueSeason;
  constructor() { }

  ngOnInit() {

  }


}
