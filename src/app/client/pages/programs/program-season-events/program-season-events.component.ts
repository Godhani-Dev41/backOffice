import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'rc-program-season-events',
  templateUrl: './program-season-events.component.html',
  styleUrls: ['./program-season-events.component.scss']
})
export class ProgramSeasonEventsComponent implements OnInit {
  seasonId: number;
  loading = false;
  loadingStats = false;
  constructor() { }
  ngOnInit() {}
}
