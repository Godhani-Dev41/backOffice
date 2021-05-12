
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { RCLeague, RCStanding } from '@rcenter/core';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'rc-standings-generator',
  templateUrl: './standings-generator.component.html',
  styleUrls: ['./standings-generator.component.scss']
})
export class StandingsGeneratorComponent implements OnInit {
  standings: RCStanding[];
  league: RCLeague;
  visible: boolean;
  constructor(
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (this.activeRoute.snapshot.queryParams['token'] !== '2G0tr78eD8fQDFhzOfL8qXPw99bPb4Zu') return;
    if (window['Intercom']) {
      window['Intercom']('shutdown');
    }

    this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${
        this.activeRoute.snapshot.queryParams['leagueId']
      }/season/${this.activeRoute.snapshot.queryParams['seasonId']}/standings`).pipe(
      map(response => response))
      .subscribe((response: any) => {
        const divisionId = this.activeRoute.snapshot.queryParams['divisionId'];

        if (divisionId) {
          const found = response.data.find(i => Number(divisionId) === i.id);

          if (found) {
            this.standings = found.seasonTeams;
          }
        } else {
          this.standings = response.data[0].seasonTeams;
        }
        // get league object
        this.http.get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${this.activeRoute.snapshot.queryParams['leagueId']}`).pipe(
          map((leagueResponse) => leagueResponse)).subscribe((leagueData: any) => {
            this.visible = true;

            this.league = leagueData.data;
          });
      });
  }
}
