
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeagueSeason } from '@rcenter/core';
import { Subject } from 'rxjs';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rc-season-reports-page',
  templateUrl: './season-reports-page.component.html',
  styleUrls: ['./season-reports-page.component.scss']
})
export class SeasonReportsPageComponent implements OnInit, OnDestroy {
  season: RCLeagueSeason;
  destroy$ = new Subject<true>();
  constructor(
    private toastr: ToastrService,
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
    this.leaguesService.currentSeason$.pipe(
      takeUntil(this.destroy$))
      .subscribe((season) => {
        this.season = season;
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  downloadReport() {
    this.leaguesService.getSeasonQuestionsReport(this.season.leagueId, this.season.id).subscribe((response: any) => {
      FileSaver.saveAs(
        response,
        `${moment().format('MM-DD-YYYY')}-${this.season.seasonLeague.name}-${this.season.name}-questionnaire.xlsx`
      );
    }, () => {
      this.toastr.error('Error while generating report');
    });
  }

  downloadPlayersReport() {
    this.leaguesService.getSeasonParticipantsReport(this.season.leagueId, this.season.id).subscribe((response: any) => {
      FileSaver.saveAs(
        response,
        `${moment().format('MM-DD-YYYY')}-${this.season.seasonLeague.name}-${this.season.name}-players-report.xlsx`
      );
    }, () => {
      this.toastr.error('Error while generating report');
    });
  }
}
