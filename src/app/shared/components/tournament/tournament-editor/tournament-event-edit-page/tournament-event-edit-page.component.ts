import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { RCLeagueSeason } from '@rcenter/core';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';

@Component({
  selector: 'rc-tournament-event-edit-page',
  templateUrl: './tournament-event-edit-page.component.html',
  styleUrls: ['./tournament-event-edit-page.component.scss']
})
export class TournamentEventEditPageComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() groupName: string;
  @Input() tournamentEvent: RCLeagueSeason;

  get activitiesArray(): FormArray {
    return this.form.get('activityTimes') as FormArray;
  };

  constructor(
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
  }

  addActivitiyItem() {
    this.activitiesArray.push(
      this.leaguesService.getActivityTimeGroupObject()
    );
  }
}
