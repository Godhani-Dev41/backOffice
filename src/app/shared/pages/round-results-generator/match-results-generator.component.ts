
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { RCSeasonRound } from '@rcenter/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rc-match-results-generator',
  templateUrl: './match-results-generator.component.html',
  styleUrls: ['./match-results-generator.component.scss']
})
export class MatchResultsGeneratorComponent implements OnInit {
  visible: boolean;
  round: RCSeasonRound;
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;
    const { leagueId, seasonId, roundId } = this.activeRoute.snapshot.queryParams;
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }
    this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/rounds/${roundId}`).pipe(
      map(response => response))
      .subscribe((response: any) => {
        this.round = response.data;
        this.visible = true;
      });
  }

}
