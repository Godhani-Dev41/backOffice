import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeagueSeason, RCSeasonTeam } from '@rcenter/core';

@Component({
  selector: 'rc-playoff-creator-form',
  templateUrl: './playoff-creator-form.component.html',
  styleUrls: ['./playoff-creator-form.component.scss']
})
export class PlayoffCreatorFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() season: RCLeagueSeason;
  @Input() teams: RCSeasonTeam[];
  get activitiesArray(): FormArray {
    return this.form.get('activityTimes') as FormArray;
  };

  constructor(
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
  }

  useCustomSeasonWindowsToggle() {
    if (!this.activitiesArray.controls.length) {
      this.addActivitiyItem();
    }

    this.form.get('useNewSeasonWindows').setValue(true);
    this.form.get('useCurrentSeasonWindows').setValue(false);
  }

  addActivitiyItem() {
    this.activitiesArray.push(
      this.leaguesService.getActivityTimeGroupObject()
    );
  }

  useCurrentSeasonWindowsToggle() {
    this.form.get('useNewSeasonWindows').setValue(false);
    this.form.get('useCurrentSeasonWindows').setValue(true);
  }

  selectManualyTeamsToggle() {
    this.form.get('useManualSelectTeams').setValue(true);
    this.form.get('useTopTeams').setValue(false);
  }

  selectTopTeamsToggle() {
    this.form.get('useManualSelectTeams').setValue(false);
    this.form.get('useTopTeams').setValue(true);
  }

  getSelectedTeams() {
    return this.teams.filter(i => i['active']);
  }

  changePlayoffType(type: 'division' | 'season') {
    this.form.get('playoffType').setValue(type);
  }
}
