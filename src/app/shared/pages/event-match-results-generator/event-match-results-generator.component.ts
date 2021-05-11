
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RCSeasonRoundMatch } from '@rcenter/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rc-event-match-results-generator',
  templateUrl: './event-match-results-generator.component.html',
  styleUrls: ['./event-match-results-generator.component.scss']
})
export class EventMatchResultsGeneratorComponent implements OnInit {
  visible: boolean;
  match: RCSeasonRoundMatch;
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;
    const { matchId } = this.activeRoute.snapshot.queryParams;
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
    this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/events/${matchId}`).pipe(
      map(response => response))
      .subscribe((response: any) => {
        this.match = response.data;
        this.visible = true;
      });
  }

}
