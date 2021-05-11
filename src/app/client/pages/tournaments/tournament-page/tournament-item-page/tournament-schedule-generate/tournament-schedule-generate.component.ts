import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaguesService, RCTournamentScheduleSuggestCreate } from '@app/shared/services/leagues/leagues.service';
import { RCLeagueSeason, RCSeasonTeam, RCTeam } from '@rcenter/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'rc-tournament-schedule-generate',
  templateUrl: './tournament-schedule-generate.component.html',
  styleUrls: ['./tournament-schedule-generate.component.scss']
})
export class TournamentScheduleGenerateComponent implements OnInit, OnDestroy {

  scheduleForm: FormGroup;
  teams: RCSeasonTeam[] = [];
  teamsSubscribe$: Subscription;
  seasonSubscription$: Subscription;
  season: RCLeagueSeason;
  loading: boolean;
  constructor(
    private _route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private leaguesService: LeaguesService,
    private fb: FormBuilder
  ) {
    this.scheduleForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      emptyGenerate: [''],
      emptyGenerateNumber: [16],
      activityTimes: this.fb.array([
      ])
    });
  }

  ngOnDestroy(): void {
    this.teamsSubscribe$.unsubscribe();
    this.seasonSubscription$.unsubscribe();
  }

  ngOnInit() {
    this.seasonSubscription$ = this.leaguesService.currentSeason$.subscribe((season) => {
      this.season = season;

      if (season) {
        this.scheduleForm.patchValue({
          startDate: season.startDate,
          endDate: season.endDate
        });

        if (season.seasonWindows && season.seasonWindows.length) {
          const activityTimes = this.leaguesService.convertSeasonWindowsToVM(season.seasonWindows);

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

            (this.scheduleForm.get('activityTimes') as FormArray).push(itemGroup);
          });

          this.scheduleForm.get('activityTimes').patchValue(activityTimes);
        } else {
          (this.scheduleForm.get('activityTimes') as FormArray).push(this.leaguesService.getActivityTimeGroupObject());
        }
      }
    });

    this.teamsSubscribe$ = this.leaguesService.currentTeams$.subscribe((response) => {
      this.teams = response;

      if (!this.teams || !this.teams.length) {
        this.scheduleForm.get('emptyGenerate').setValue(true);
      }
    });
  }

  getSelectedTeams() {
    return this.teams.filter(i => i['active']);
  }

  submit(data) {
    const selectedTeams = this.getSelectedTeams();
    const participantList = selectedTeams.map((seasonTeam) => {
      return {
        participantId: seasonTeam.team.id,
        participantType: 'team',
        name: seasonTeam.team.name
      };
    }) as any;

    const item: RCTournamentScheduleSuggestCreate = {
      timeSlots: this.leaguesService.createSeasonActivityWindowFromForm(data.activityTimes),
      participantsList: participantList,
      startDate: data.startDate,
      endDate: data.endDate
    };

    if (data.emptyGenerate) {
      item.participantsList = null;
      item.participantsCount = data.emptyGenerateNumber;
    } else {
      const n = item.participantsList.length;

      // make sure that the numbers is a power of 2
      // tslint:disable-next-line
      if (!(n && (n & (n - 1)) === 0)) {
        return this.toastr.error('You must select: 4, 8, 16, 32, 64 teams.');
      }
    }

    if (!item.timeSlots.length) {
      return this.toastr.error('You must add time slots');
    }

    if (!this.season.tournament) {
      return alert('No connected tournament found');
    }

    this.loading = true;

    this.leaguesService.createTournamentSuggest(this.season.tournament.id, item).subscribe((response) => {
      this.loading = false;
      this.router.navigate([
        '../brackets'
      ], { relativeTo: this._route });
      this.toastr.success('Suggestion successfully created');
    }, (err) => {
      const errorObject = err;
      console.error(errorObject);
      this.loading = false;
      this.toastr.error('Error occurred while creating suggestions');
    });
  }
}

