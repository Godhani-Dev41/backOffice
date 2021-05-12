import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validator, Validators } from '@angular/forms';
import { RCLeague, RCLeagueSeason, RCTeamSeason, RCLeagueDetailTypeEnum } from '@rcenter/core';
import * as moment from 'moment';
import { LeaguesService, RCTournamentScheduleSuggestCreate } from '@app/shared/services/leagues/leagues.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import { ToastrService } from 'ngx-toastr';
import { ActionSuccessModalComponent } from '@app/shared/components/action-success-modal/action-success-modal.component';
import { TimeService } from '@app/shared/services/utils/time.service';

@Component({
  selector: 'rc-playoff-creator',
  templateUrl: './playoff-creator.component.html',
  styleUrls: ['./playoff-creator.component.scss']
})
export class PlayoffCreatorComponent implements OnInit, OnDestroy {
  @ViewChild('actionSuccessModal', { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  loading: boolean;
  updateMode: boolean;
  playoffForm: FormGroup;
  currentLeague: RCLeague;
  currentSeason: RCLeagueSeason;
  teams: RCTeamSeason[];
  newPlayoffItem: RCLeagueSeason;
  private leagueSubscription$: Subscription;
  constructor(
    private timeService: TimeService,
    private fb: FormBuilder,
    private leagueService: LeaguesService,
    private activatedRoute: ActivatedRoute,
    private tournamentService: TournamentService,
    private toastr: ToastrService,
    private router: Router,
    private _route: ActivatedRoute
  ) {
    this.playoffForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      useCurrentSeasonWindows: true,
      useNewSeasonWindows: false,
      addConsolationRound: false,
      playoffType: ['season'],
      useTopTeams: true,
      useManualSelectTeams: false,
      activityTimes: this.fb.array([]),
      topTeamsCount: 8,
      selectedDivision: [''],
      gameDuration: ['', Validators.compose([Validators.required, Validators.minLength(1)])]
    });

    this.playoffForm.get('selectedDivision').valueChanges.subscribe((value) => {
      this.filterDivisionTeams(value);
    });

    this.playoffForm.get('playoffType').valueChanges.subscribe((value) => {
      const selectDivisionForm = this.playoffForm.get('selectedDivision');

      if (value === 'season') {
        this.playoffForm.get('selectedDivision').setValue(null);
        selectDivisionForm.setValidators(null);
      } else {
        selectDivisionForm.setValidators([Validators.required]);
      }

      selectDivisionForm.updateValueAndValidity();
    });

    const seasonId = this.activatedRoute.snapshot.queryParams['connectedSeason'];
    if (!seasonId) {
      this.toastr.error('connected season was not specified');
      return;
    }

    this.leagueSubscription$ = this.leagueService.currentLeague$.subscribe((league) => {
      this.currentLeague = league;

      if (league) {
        const gameDuration = league.leagueDetails.find(i => {
          return i.detailType === RCLeagueDetailTypeEnum.MATCHLENGTH;
        });

        if (gameDuration && gameDuration.data) {
          this.playoffForm.get('gameDuration').setValue(gameDuration.data);
        }

        this.leagueService.getSeasonById(league.id, seasonId).subscribe((response) => {
          this.currentSeason = response.data;

          this.teams = this.currentSeason.seasonTeams;

          if (this.teams) {
            this.teams = this.teams.map((i) => {
              i['active'] = true;

              return i;
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.leagueSubscription$.unsubscribe();
  }

  ngOnInit() {

  }

  filterDivisionTeams(divisionId: number) {
    if (divisionId) {
      this.teams = this.currentSeason.seasonTeams.filter(i => i.divisionId === divisionId);
    } else {
      this.teams = this.currentSeason.seasonTeams;
    }
  }

  submit(data) {

    const season: RCLeagueSeason = {
      name: data.name,
      status: 1,
      endDate: this.timeService.replaceTimeZone(moment(data.endDate).hour(22).minute(59).format(), this.currentLeague.timezone),
      startDate: this.timeService.replaceTimeZone(moment(data.startDate).hour(0).minute(1).format(), this.currentLeague.timezone),
      description: data.description,
      registrationStatus: 2,
      registrationOpen: null,
      priceRegularTeam: null,
      priceEarlyTeam: null,
      priceEarlySingle: null,
      priceRegularSingle: null,
      priceLateTeam: null,
      priceLateSingle: null,
      activityTimes: [],
      connectedSeasonId: this.currentSeason.id,
      connectedDivisionId: data.playoffType === 'division' ? data.selectedDivision : null,
      tournamentType: 'singleElimination',
      isPlayoff: true,
      tournamentConfig: {
        consolationMatch: data.addConsolationRound
      },
      seasonWindows: this.leagueService.createSeasonActivityWindowFromForm(data.activityTimes)
    } as any;

    if (data.useCurrentSeasonWindows) {
      season.seasonWindows = this.currentSeason.seasonWindows;
    }

    const participantList = this.teams.filter(i => i['active']).map((seasonTeam) => {
      return {
        divisionId: seasonTeam['divisionId'],
        participantId: seasonTeam.team.id,
        participantType: 'team',
        name: seasonTeam.team.name
      };
    }) as any;

    if (data.useTopTeams) {
      season.metaData = {
        playoff: {
          teamsToChoose: {
            amount: Number(data.topTeamsCount),
            orderType: 'top'
          }
        }
      };
    } else {
      const n = participantList.length;

      // make sure that the numbers is a power of 2
      // tslint:disable-next-line
      if (n < 4 || !(n && (n & (n - 1)) === 0)) {
        return this.toastr.error('You must select: 4, 8, 16, 32, 64 teams.');
      }
    }

    const timeSlots = this.leagueService.createSeasonActivityWindowFromForm(data.activityTimes);
    if (data.useNewSeasonWindows && !timeSlots.length) {
      return this.toastr.error('You must add time slots');
    }

    this.loading = true;

    this.tournamentService
      .createTournamentEvent(this.currentLeague.id, season)
      .subscribe((response) => {
        this.newPlayoffItem = response.data;

        const item: RCTournamentScheduleSuggestCreate = {
          timeSlots: this.leagueService.createSeasonActivityWindowFromForm(data.activityTimes),
          participantsCount: data.topTeamsCount,
          participantsList: participantList,
          endDate: moment(data.endDate).hour(22).minute(59).format(),
          startDate: moment(data.startDate).hour(0).minute(1).format(),
          matchLength: data.gameDuration
        } as any;

        if (data.useCurrentSeasonWindows) {
          item.timeSlots = this.currentSeason.seasonWindows;
        }

        if (data.useTopTeams) {
          item.participantsList = null;
        } else {
          item.participantsCount = null;
        }

        if (!data.useTopTeams) {
          const teamIds = participantList.map(i => i.participantId);

          this.leagueService
            .bulkSeasonTeamAssign(this.currentLeague.id, response.data.id, teamIds)
            .subscribe(() => {
              this.createBrackets(response.data.id, response.data.tournamentId, item);
            }, () => {
              this.loading = false;
              this.toastr.error('Error while assigning teams');
            });
        } else {
          this.createBrackets(response.data.id, response.data.tournamentId, item);
        }
      }, () => {
        this.loading = false;
        this.toastr.error('Unexpected error occurred while creating playoff');
      });
  }

  createBrackets(tournamentEventId: number, tournamentId: number, data) {
    this.leagueService
      .createTournamentSuggest(tournamentId, data, tournamentEventId)
      .subscribe(() => {
        this.loading = false;
        this.actionSuccessModal.showModal();
      }, (err) => {
        const errorObject = err;

        this.loading = false;
        this.toastr.error(errorObject.error || 'Error occurred while creating brackets');
      });
  }

  goToBrackets() {
    this.router.navigate([
      '/client/tournaments/view/' + this.currentLeague.id + '/item/' + this.newPlayoffItem.id + '/brackets'
    ]);
  }

  publishPlayOff() {
    this.loading = true;
    this.leagueService.publishSeason(this.currentLeague.id, this.newPlayoffItem.id).subscribe(() => {
        this.toastr.success('Playoff was successfully published!');
        this.loading = false;

        this.goToBrackets();
    }, () => {
      this.loading = false;

      this.goToBrackets();
      this.toastr.error('Error occurred while publishing');
    });
  }
}
