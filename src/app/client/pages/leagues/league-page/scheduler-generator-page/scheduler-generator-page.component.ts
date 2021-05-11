
import {catchError, switchMap, debounceTime, takeUntil} from 'rxjs/operators';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCLeague, RCLeagueDetailTypeEnum, RCLeagueSeason } from '@rcenter/core';
import { LeaguesFormService } from '@app/shared/services/leagues/leagues-form.service';
import { SeasonSchedulerService } from '@app/shared/services/leagues/season-scheduler.service';
import { Subject ,  Observable } from 'rxjs';
import * as moment from 'moment-timezone';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import * as _ from 'lodash';
import * as Holidays from 'date-holidays';
import { SchedulerGenerateBody } from '@app/shared/services/leagues/scheduler.interface';

@Component({
  selector: 'rc-scheduler-generator-page',
  templateUrl: './scheduler-generator-page.component.html',
  styleUrls: ['./scheduler-generator-page.component.scss']
})
export class SchedulerGeneratorPageComponent implements OnInit, OnDestroy {
  currentStep = 1;
  totalSteps = 2;
  schedulerForm: FormGroup;
  loading = false;
  season: RCLeagueSeason;
  league: RCLeague;
  simulatorObserver$ = new Subject<any>();
  schedulerData: {
    encounters: any[];
    percentageUse: number;
    numberOfEncountersCanOccur: number;
    numberOfEncountersNeeded: number;
  };
  constraintsCount = 0;
  teamConstraintsCount = 0;
  destroy$ = new Subject<true>();
  pageLoaded: boolean;
  get teamConstraintsArray() {
    return this.schedulerForm.get('schedulerRules').get('teamConstraints') as FormArray;
  }

  @ViewChild('scrollArea') scrollArea: ElementRef;
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private leaguesService: LeaguesService,
    private leaguesFormService: LeaguesFormService,
    private seasonSchedulerService: SeasonSchedulerService
  ) {
    this.schedulerForm = this.fb.group({
      schedulerSettings: this.fb.group({
        activityTimes: this.fb.array([]),
        teamsNumber: [8, Validators.compose([CustomValidators.min(2), CustomValidators.max(32), Validators.required])],
        roundNumber: [1, Validators.compose([CustomValidators.min(1), CustomValidators.max(10), Validators.required])],
        gameMinutes: ['', Validators.compose([CustomValidators.min(1), CustomValidators.max(200), Validators.required])],
        breakMinutes: [0, CustomValidators.min(0)],
        playOfWeeks: [0, CustomValidators.min(0)],
        useSeasonTeams: [false]
      }),
      schedulerRules: this.fb.group({
        notMoreThanNAWeek: [1, CustomValidators.min(0)],
        constraints: this.fb.array([]),
        teamConstraints: this.fb.array([]),
        teamOnceAWeek: [true],
        matchesWithinSeasonRange: [true]
      })
    });
  }

  getTeamConstraint(
    teamId: number,
    teamName: string,
    weekDay: number,
    startTime: Date,
    endTime: Date,
    fullDay = false,
    type: 'can' | 'cant'
  ) {
    return this.fb.group({
      teamName: [teamName],
      weekDay: [weekDay],
      startTime: [startTime],
      endTime: [endTime],
      fullDay: [fullDay],
      active: [true],
      teamId: teamId,
      constraintType: [type]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit() {
    const seasonId = this.activatedRoute.snapshot.params['seasonId'];
    const leagueId = this.activatedRoute.snapshot.parent.params['id'];

    this.schedulerForm
      .get('schedulerSettings')
      .get('useSeasonTeams')
      .valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (value) {
          this.schedulerForm.get('schedulerSettings').get('teamsNumber').disable();
        } else {
          this.schedulerForm.get('schedulerSettings').get('teamsNumber').enable();
        }
      });

    this.schedulerForm
      .get('schedulerSettings')
      .get('playOfWeeks')
      .valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        const matchesWithinSeasonCheckbox = this.schedulerForm.get('schedulerRules').get('matchesWithinSeasonRange');

        if (value) {
          matchesWithinSeasonCheckbox.disable();
          matchesWithinSeasonCheckbox.setValue(true);
        } else {
          matchesWithinSeasonCheckbox.enable();
          matchesWithinSeasonCheckbox.setValue(false);
        }
    });

    this.schedulerForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const data = this.schedulerForm.value;
      if (!this.season || !data) return;

      this.triggerSimulateRequest(data);
    });

    this.loading = true;
    this.leaguesService.getSeasonById(leagueId, seasonId).subscribe((response) => {
      this.season = response.data;
      this.loading = false;

      if (this.season.seasonWindows) {
        const activityTimes = this.leaguesService.convertSeasonWindowsToVM(this.season.seasonWindows);

        /**
         * Hack for supporting patching value of n length array
         * currently angular doesn't support this.
         * and we need to create the form groups beforehand
         */
        activityTimes.forEach((i) => {
          const itemGroup = this.leaguesService.getActivityTimeGroupObject();

          if (i.activityDates && i.activityDates.length > 1) {
            i.activityDates.forEach((date, dateIndex) => {
              // we want to skip the first item since it's already exist there
              if (dateIndex === 0) return;

              (itemGroup.get('activityDates') as FormArray).push(this.leaguesService.getActivityDateFormControl());
            });
          }

          (this.schedulerForm.get('schedulerSettings').get('activityTimes') as FormArray).push(itemGroup);
        });

        this.schedulerForm.get('schedulerSettings').get('activityTimes').patchValue(activityTimes);
      }

      if (this.season && this.season.seasonTeams && this.season.seasonTeams.length) {
        this.season.seasonTeams = _.sortBy(this.season.seasonTeams.map(i => {
          if (i.divisionId) {
            i['active'] = true;
          } else  {
            i['disabled'] = true;
          }

          return i;
        }), 'active');

        this.season.seasonTeams.forEach(i => {
          if (i.metaData && i.metaData.scheduleRequests && i.metaData.scheduleRequests) {
            i.metaData.scheduleRequests.forEach(request => {
              const fullDay = (request.open === '00:00' && request.close === '23:59');

              this.teamConstraintsArray.push(
                this.getTeamConstraint(
                  i.teamId,
                  i.team.name,
                  request.dayOfWeek,
                  moment(request.open, 'HH:mm').toDate(),
                  moment(request.close, 'HH:mm').toDate(),
                  fullDay,
                  request.requestType
                )
              );
            });
          }
        });

        this.schedulerForm.get('schedulerSettings').get('teamsNumber').setValue(this.season.seasonTeams.length);
        this.schedulerForm.get('schedulerSettings').get('teamsNumber').disable();
        this.schedulerForm.get('schedulerSettings').get('useSeasonTeams').setValue(true);
      } else {
        this.schedulerForm.get('schedulerSettings').get('useSeasonTeams').disable();
      }

      this.pageLoaded = true;
      this.triggerSimulateRequest(this.schedulerForm.value);

      this.populateHolidaysData();
    });

    this.leaguesService.currentLeague$.pipe(takeUntil(this.destroy$)).subscribe((response) => {
      this.league = response;

      if (this.league && this.league.leagueDetails) {
        const foundGameLength = this.league.leagueDetails.find((i) => {
          return i.detailType === RCLeagueDetailTypeEnum.MATCHLENGTH;
        });

        if (foundGameLength) {
         this.schedulerForm.get('schedulerSettings').get('gameMinutes').setValue(foundGameLength.data);
        }
      }
    });

    this.simulatorObserver$.pipe(
      debounceTime(300),
      switchMap((data) => this.seasonSchedulerService.simulateSchedule(leagueId, seasonId, data).pipe(catchError(err => {
        return Observable.create((obj) => {
          return obj.next(null);
        });
      }))),
      takeUntil(this.destroy$),)
      .subscribe((response: any) => {
        this.schedulerData = response.data;
      });
  }

  triggerSimulateRequest(data) {
    if (!this.pageLoaded || !this.schedulerForm.valid) return;

    this.constraintsCount = data.schedulerRules.constraints.filter((i) => i.active).length;
    this.teamConstraintsCount = data.schedulerRules.teamConstraints.filter((i) => i.active).length;

    this.simulatorObserver$.next(this.prepareSchedulerFormData(data));
  }

  populateHolidaysData() {
    const hd = new Holidays('US');
    const holidayDates = hd.getHolidays().filter((i) => {
      if (moment(this.season.startDate).isBefore(moment(i.start)) && moment(this.season.endDate).isAfter(moment(i.start))) {
        const dayOfWeek = moment(i.start).day(); // 0 sunday
        const foundDayOfWeek = _.cloneDeep(this.season.seasonWindows).find(j => {
          if (j.activityTime.dayOfWeek === 8) {
            j.activityTime.dayOfWeek = 1;
          }
          return (j.activityTime.dayOfWeek - 1) === dayOfWeek;
        });

        if (foundDayOfWeek) {
          return true;
        }
      }
    });

    if (holidayDates.length) {
      holidayDates.forEach((i) => {
        (this.schedulerForm.get('schedulerRules').get('constraints') as FormArray).push(
          this.leaguesFormService.getConstraintItem('holiday', false, i.name, i.start, i.end)
        );
      });
    }
  }

  prepareSchedulerFormData(data): SchedulerGenerateBody {
    const constraints = data.schedulerRules.constraints
      .filter(i => i.active)
      .map((i) => {
        return {
          startDate: i.startDate,
          endDate: i.endDate,
          isCustom: i.type === 'custom',
          name: i.title,
          fullDay: i.constraintDuration === 'fullDay'
        };
      });

    const teamConstraints: any = _.groupBy(data.schedulerRules.teamConstraints.filter(i => i.active), 'teamId');
    const parsedRequests = [];

    for (const key of Object.keys(teamConstraints)) {
      const item = teamConstraints[key];
      const entityRequest = {
        priority: 1,
        participantId: Number(key),
        participantType: 'team',
        requestData: item.map(i => {
          return {
            open: moment(i.startTime).format('HH:mm'),
            close: moment(i.endTime).format('HH:mm'),
            dayOfWeek: i.weekDay,
            requestType: i.constraintType
          };
        })
      };

      parsedRequests.push(entityRequest);
    }

    let seasonTeams;
    if (data.schedulerSettings.useSeasonTeams && this.season.seasonTeams) {
      const filteredTeams = this.season.seasonTeams.filter(i => i['active']);

      if (filteredTeams && filteredTeams.length) {
        seasonTeams = filteredTeams.map(i => {
          return {
            divisionId: i.divisionId,
            participantId: i.teamId,
            participantType: 'team',
            name: i.team.name
          };
        });

        data.schedulerSettings.teamsNumber = null;
      } else if (!data.schedulerSettings.teamsNumber) {
        data.schedulerSettings.teamsNumber = 4;
      }
    }

    return {
      participantsRequests: parsedRequests,
      timeSlots: this.leaguesService.createSeasonActivityWindowFromForm(data.schedulerSettings.activityTimes),
      startDate: this.season.startDate,
      endDate: this.season.endDate,
      numberOfRounds: data.schedulerSettings.roundNumber,
      stopAtEndDate: data.schedulerRules.matchesWithinSeasonRange,
      notMoreThanNAWeek: data.schedulerRules.notMoreThanNAWeek,
      eventGapLength: data.schedulerSettings.breakMinutes,
      matchLength: data.schedulerSettings.gameMinutes,
      participantsCount: data.schedulerSettings.teamsNumber,
      participantsList: seasonTeams,
      playoffWeeks: data.schedulerSettings.playOfWeeks,
      skipDates: constraints,
      timezone: this.league ? this.league.timezone || moment.tz.guess() : moment.tz.guess()
    };
  }

  submit(data) {
    const body = this.prepareSchedulerFormData(data);

    this.loading = true;
    this.seasonSchedulerService.createScheduleSuggestion(this.season.leagueId, this.season.id, body).subscribe(() => {
      this.loading = false;
      this.toastr.success('Schedule successfully generated');
      this.router.navigate([`/client/leagues/view/${this.season.leagueId}/schedule-list/${this.season.id}`]);
    }, () => {
      this.toastr.error('Error occurred while generating schedule');
      this.loading = false;
    });
  }

  nextStep() {
    if (this.totalSteps > this.currentStep) {
      this.scrollArea.nativeElement.scrollTop = 0;
      this.currentStep = ++this.currentStep;
    }
  }

  goBack() {
    if (this.currentStep > 1) {
      this.currentStep = --this.currentStep;
    }
  }

  canGoNext() {
    if (this.currentStep === 1) {
      return this.schedulerForm.get('schedulerSettings').valid;
    } else if (this.currentStep === 2) {
      return this.schedulerForm.get('schedulerRules').valid;
    }
  }

  formChangeTrigger() {
    this.triggerSimulateRequest(this.schedulerForm.value);
  }
}
