
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { IRCFeedPost, RCFeedItem } from '@rcenter/core';
import { environment } from '../../../../environments/environment';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { Observable } from 'rxjs';
import { RCServerResponse } from '@app/shared/services/main';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FeedService {

  constructor(
    private noAuthHttp: HttpClient,
    private http: HttpClient,
    private leagueService: LeaguesService
  ) {
  }

  getFeedByIdNonAuth(feedId: number) {
    return this.noAuthHttp
      .get(`${environment.CS_URLS.API_ROOT}/feed/${feedId}`).pipe(
      map((response) => response));
  }

  getFeedById(feedId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/feed/${feedId}`).pipe(
      map(response => response));
  }

  postFeed(feedItem: IRCFeedPost): Observable<RCServerResponse<RCFeedItem>> {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/feed`, feedItem).pipe(
      map(response => response));
  }

  postSeasonStandings(feedItem: IRCFeedPost, divisionId: number): Observable<RCServerResponse<RCFeedItem>> {
    return this.http
      .post<any>(
        // tslint:disable-next-line:max-line-length
        `${environment.CS_URLS.API_ROOT}/leagues/${this.leagueService.currentLeagueId}/season/${this.leagueService.currentSeasonId}/divisions/${divisionId}/standings/publish`,
        feedItem
      ).pipe(map(response => response));
  }
}
