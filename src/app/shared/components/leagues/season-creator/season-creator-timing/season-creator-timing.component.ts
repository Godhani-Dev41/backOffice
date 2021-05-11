import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';

@Component({
  selector: 'rc-season-creator-timing',
  templateUrl: './season-creator-timing.component.html',
  styleUrls: ['./season-creator-timing.component.scss']
})
export class SeasonCreatorTimingComponent implements OnInit {
  @Input() groupName: string;
  @Input() form: FormGroup;
  @Input() orgVenues: any[];
  get activitiesArray(): FormArray {
    return this.form.get('activityTimes') as FormArray;
  };

  constructor(
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {
  }

  addActivitiyItem() {
    this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
  }


}
