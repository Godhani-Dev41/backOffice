
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SchedulerGenerateBody } from '@app/shared/services/leagues/scheduler.interface';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SeasonSchedulerService {

  constructor(
    private http: HttpClient
  ) { }

  simulateSchedule(leagueId: number, seasonId: number, body: SchedulerGenerateBody) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/suggest-simulate`, body).pipe(
      map((response) => response));
  }

  createScheduleSuggestion(leagueId: number, seasonId: number, body: SchedulerGenerateBody) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/suggest`, body).pipe(
      map((response) => response));
  }

  getSuggestedSchedule(leagueId: number, seasonId: number) {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/suggest`).pipe(
      map((response) => response));
  }

  discardSchedule(leagueId: number, seasonId: number) {
    return this.http
      .delete(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/suggest/answer`).pipe(
      map((response) => response));
  }

  publishSchedule(leagueId: number, seasonId: number) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/leagues/${leagueId}/season/${seasonId}/suggest/answer`, {}).pipe(
      map((response) => response));
  }
}
