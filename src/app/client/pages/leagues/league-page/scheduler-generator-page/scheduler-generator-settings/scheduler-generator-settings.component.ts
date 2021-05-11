import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { RCActivityTime, RCLeagueSeason, RCSeasonTeam } from '@rcenter/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';

@Component({
  selector: 'rc-scheduler-generator-settings',
  templateUrl: './scheduler-generator-settings.component.html',
  styleUrls: ['./scheduler-generator-settings.component.scss']
})
export class SchedulerGeneratorSettingsComponent implements OnInit {
  private _season: RCLeagueSeason;
  @Output() onFormChange = new EventEmitter();
  @Input() form: FormGroup;
  @Input() set season(season: RCLeagueSeason) {
    this._season = season;
  };

  get season() {
    return this._season;
  }

  get selectedTeams(): RCSeasonTeam[] {
    if (!this._season || !this._season.seasonTeams) return [];

    return this._season.seasonTeams.filter(i => i['active']);
  }

  get activitiesArray() {
    return this.form.get('activityTimes') as FormArray;
  }

  constructor(
    private leaguesService: LeaguesService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
  }

  getTimeRange(activityTime: RCActivityTime): string {
    if (!activityTime) return '';

    return moment(activityTime.open, 'HH:mm:ss').format('h:mmA') + ' - ' +
      moment(activityTime.close, 'HH:mm:ss').format('h:mmA');
  }

  getDayOfWeek(dayOfWeek: number) {
    let day;

    switch (dayOfWeek) {
      case 8:
        day = 'SUN';
        break;
      case 2:
        day = 'MON';
        break;
      case 3:
        day = 'TUE';
        break;
      case 4:
        day = 'WED';
        break;
      case 5:
        day = 'THU';
        break;
      case 6:
        day = 'FRI';
        break;
      case 7:
        day = 'SAT';
        break;
    }

    return day;
  }

  toggleTeamSelection(seasonTeam: RCSeasonTeam, $event) {
    seasonTeam['active'] = !seasonTeam['active'];

    if (this.selectedTeams.length < 2) {
      $event.preventDefault();
      seasonTeam['active'] = true;
      return this.toastr.warning('At least two teams must be selected');
    }

    this.onFormChange.emit();
  }

  addActivityTime() {
    this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
  }
}
