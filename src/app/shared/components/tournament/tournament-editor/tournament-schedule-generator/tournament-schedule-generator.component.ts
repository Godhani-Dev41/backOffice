import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RCSeasonTeam, RCTeam } from '@rcenter/core';
import * as moment from 'moment';

interface SeasonTeamVM extends RCSeasonTeam {
  active: boolean;
}

@Component({
  selector: 'rc-tournament-schedule-generator',
  templateUrl: './tournament-schedule-generator.component.html',
  styleUrls: ['./tournament-schedule-generator.component.scss']
})
export class TournamentScheduleGeneratorComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() teams: SeasonTeamVM[];
  @Output() onTeamsSelected = new EventEmitter();
  get activitiesArray(): FormArray {
    return this.form.get('activityTimes') as FormArray;
  };
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.selectAllTeams();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.selectAllTeams();
  }

  selectAllTeams() {
    if (this.teams) {
      this.teams = this.teams.map((team) => {
        team.active = true;
        return team;
      });

      this.onTeamsSelected.emit(this.teams);
    }
  }

  addActivityItem() {
    this.activitiesArray.push(
      this.fb.group({
        venueName: [''],
        venueAddress: [''],
        activityDates: this.fb.array([
          this.fb.group({
            concurrent: 1,
            sunday: '',
            monday: '',
            tuesday: '',
            wednesday: '',
            thursday: '',
            friday: '',
            saturday: '',

            startTime: moment().hour(18).minute(0),
            endTime: moment().hour(21).minute(0)
          })
        ])
      })
    );
  }

  getSelectedTeams() {
    return this.teams.filter(i => i['active']);
  }

}
