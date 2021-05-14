import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RCLeagueSeason, RCSeasonTeam, RCSeasonTeamRequest } from '@rcenter/core';
import { SeasonSchedulerService } from '@app/shared/services/leagues/season-scheduler.service';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rc-teams-constraints-modal',
  templateUrl: './teams-constraints-modal.component.html',
  styleUrls: ['./teams-constraints-modal.component.scss'],
  exportAs: 'modal'
})
export class TeamsConstraintsModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  teamConstraintsForm: FormGroup;
  loading: boolean;
  seasonTeam: RCSeasonTeam;
  season: RCLeagueSeason;
  seasonSubscription$: Subscription;
  get constraintsArray() {
    return this.teamConstraintsForm.get('constraints') as FormArray;
  }

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private seasonSchedulerService: SeasonSchedulerService,
    private leagueService: LeaguesService
  ) {
    this.teamConstraintsForm = this.fb.group({
      constraintType: ['doesntWant'],
      constraints: this.fb.array([])
    });

    this.seasonSubscription$ = this.leagueService.currentSeason$.subscribe((response) => {
      this.season = response;
    });
  }

  ngOnDestroy(): void {
    this.seasonSubscription$.unsubscribe();
  }

  ngOnInit() {

  }

  onSubmit(data) {
    const teamRequests: RCSeasonTeamRequest[] = _.flatten<RCSeasonTeamRequest>(data.constraints.map((i) => {
      const requests = [];
      const requestItem: RCSeasonTeamRequest = {
        requestType: data.constraintType === 'doesntWant' ? 'cant' : 'can',
        open: moment(i.startTime).format('HH:mm'),
        close: moment(i.endTime).format('HH:mm'),
      } as any;

      if (i.constraintDuration === 'fullDay') {
        requestItem.open = '00:00';
        requestItem.close = '23:59';
      }

      if (i.days.mon) requests.push({...requestItem, dayOfWeek: 2});
      if (i.days.tue) requests.push({...requestItem, dayOfWeek: 3});
      if (i.days.wed) requests.push({...requestItem, dayOfWeek: 4});
      if (i.days.thu) requests.push({...requestItem, dayOfWeek: 5});
      if (i.days.fri) requests.push({...requestItem, dayOfWeek: 6});
      if (i.days.sat) requests.push({...requestItem, dayOfWeek: 7});
      if (i.days.sun) requests.push({...requestItem, dayOfWeek: 8});

      return requests;
    }));

    this.loading = true;
    this.leagueService
      .updateSeasonTeamScheduleRequests(this.season.leagueId, this.season.id, this.seasonTeam.teamId, teamRequests)
      .subscribe(() => {
        this.loading = false;
        this.toastr.success('Team requests updated');

        if (!this.seasonTeam.metaData) this.seasonTeam.metaData = {};
        this.seasonTeam.metaData.scheduleRequests = teamRequests;
        this.modal.hide();
      }, () => {
        this.loading = false;
        this.toastr.error('Error occurred while updating');
      });
  }

  getConstraintItem(dayOfWeek?: number, duration?: 'fullDay' | 'hours', startTime?: Date, endTime?: Date) {
    return this.fb.group({
      days: this.fb.group({
        sun: [(dayOfWeek === 8)],
        mon: [(dayOfWeek === 2)],
        tue: [(dayOfWeek === 3)],
        wed: [(dayOfWeek === 4)],
        thu: [(dayOfWeek === 5)],
        fri: [(dayOfWeek === 6)],
        sat: [(dayOfWeek === 7)]
      }),
      constraintDuration: duration || 'fullDay',
      startTime: [startTime || moment().minutes(0).toDate()],
      endTime: [endTime || '']
    });
  }

  showModal(seasonTeam: RCSeasonTeam) {
    this.teamConstraintsForm = this.fb.group({
      constraintType: ['doesntWant'],
      constraints: this.fb.array([])
    });

    this.seasonTeam = seasonTeam;

    if (this.seasonTeam.metaData && this.seasonTeam.metaData.scheduleRequests && this.seasonTeam.metaData.scheduleRequests.length) {
      this.seasonTeam.metaData.scheduleRequests.forEach((i) => {
        this.teamConstraintsForm.get('constraintType').setValue(i.requestType === 'can' ? 'want' : 'doesntWant');

        let duration: 'hours' | 'fullDay' = 'hours';
        if (i.open === '00:00' && i.close === '23:59') {
          duration = 'fullDay';
        }

        this.constraintsArray.push(
          this.getConstraintItem(i.dayOfWeek, duration, moment(i.open, 'HH:mm').toDate(), moment(i.close, 'HH:mm').toDate())
        );
      });
    }

    this.modal.show();
  }

  addCustomConstraint() {
    this.constraintsArray.push(this.getConstraintItem());
  }

  removeConstraint(index: number) {
    this.constraintsArray.removeAt(index);
  }

  selectContraintType(type: 'fullDay' | 'hours', control: FormGroup, event) {
    if (control.get('constraintDuration').value === type) {
      return event.preventDefault();
    }

    control.get('constraintDuration').setValue(type);
  }

  timeChanged(control: FormControl, time: any) {

    control.get('endTime').setValue(moment(time).add(1, 'hour').toDate());
  }
}
