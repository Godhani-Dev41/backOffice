import { ProgramTypeEnum } from './../../../services/programs/programs.service';
import { Component, Input, OnInit } from '@angular/core';
import { RCLeague } from '@rcenter/core';

@Component({
  selector: 'rc-leagues-viewer',
  templateUrl: './leagues-viewer.component.html',
  styleUrls: ['./leagues-viewer.component.scss']
})
export class LeaguesViewerComponent implements OnInit {
  @Input() leagues: RCLeague[];
  @Input() tournament: boolean;
  @Input() type: ProgramTypeEnum;
  constructor() { }

  ngOnInit() {
  }
}
