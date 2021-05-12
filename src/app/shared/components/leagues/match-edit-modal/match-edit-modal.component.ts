import {
  Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LeaguesService, RCCreateMatchBody } from '@app/shared/services/leagues/leagues.service';
import { RCParsedAddress } from '@app/shared/services/utils/location.service';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {
  EventStatus, RCLeague, RCLeagueSeason, RCSeasonDivision, RCSeasonRound, RCSeasonRoundMatch, RCSeasonTeam,
  RCVenue
} from '@rcenter/core';
import { TimeService } from '@app/shared/services/utils/time.service';
import { EventsService } from '@app/shared/services/events/events.service';
import { RCLeagueDetailTypeEnum } from '@rcenter/core';

const remainder = 30 - moment().minute() % 30;
const DEFAULT_MATCH = {
  startTime: null,
  endTime:  null
};

@Component({
  selector: 'rc-match-edit-modal',
  templateUrl: './match-edit-modal.component.html',
  styleUrls: ['./match-edit-modal.component.scss'],
  exportAs: 'modal'
})
export class MatchEditModalComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('modal', { static: true }) public modal: ModalDirective;
  @Input() league: RCLeague;
  @Input() season: RCLeagueSeason;
  @Input() rounds: RCSeasonRound[];
  @Input() divisions: RCSeasonDivision[];
  @Input() publishEvent: boolean;
  @Output() onMatchAdded = new EventEmitter<{ match: RCSeasonRoundMatch, divisionId?: number }>();
  @Output() onMatchRemoved = new EventEmitter<{ match: RCSeasonRoundMatch, divisionId?: number }>();
  @Output() onMatchUpdated = new EventEmitter();
  items: any[];
  match: RCSeasonRoundMatch;
  teams$: Subscription;
  teamsSelection: any[];
  roundsSelection: any[];
  divisionSelection: any[];
  matchForm: FormGroup;
  currentRoundId: number;
  loading: boolean;
  editMode: boolean;
  newRoundId: number;
  disableEdit: boolean;
  teams: RCSeasonTeam[];
  private seasonId: number;
  private leagueId: number;
  private divisionId: number;
  dateTimeOptions: any;
  reportDownloadLoading = false;
  constructor(
    private eventsService: EventsService,
    private toastr: ToastrService,
    private leaguesService: LeaguesService,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private timeService: TimeService
  ) {
    this.editMode = false;
    this.teams$ = this.leaguesService.currentTeams$.subscribe((teams) => {
      this.teams = teams;
    });

    this.roundsSelection = [];
    this.dateTimeOptions = {
      widgetPositioning: {
        vertical: 'bottom'
      },
      stepping: 5
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rounds && this.rounds) {
      this.roundsSelection = this.rounds.map((i) => {
        return {
          id: i.id,
          text: i.name
        };
      });
    }

    if (changes.divisions && this.divisions) {
      this.divisionSelection = this.divisions.map((i) => {
        return {
          id: i.id,
          text: i.name
        };
      });

      if (this.divisions.length === 1) {
        this.divisionSelected({
          id: this.divisions[0].id,
          text: this.divisions[0].name
        });
      }
    }
  }

  ngOnInit() {
    this.matchForm = this.fb.group({
      startTime: moment().hour(18).minute(0),
      endTime: '',
      teamA: '',
      teamB: '',
      address: '',
      venueName: '',
      venue: '',
      excludeStandings: false,
      description: '',
      roundId: ['', Validators.required],
      venueId: ''
    });

    this.matchForm.get('startTime').valueChanges.subscribe((date) => {
      let defaultMinutesToAdd = 60;

      if (this.leaguesService.currentLeagueObject && this.leaguesService.currentLeagueObject.leagueDetails) {
        const matchLength = this.leaguesService
          .currentLeagueObject.leagueDetails
          .find(i => i.detailType === RCLeagueDetailTypeEnum.MATCHLENGTH);

        if (matchLength && matchLength.data) {
          defaultMinutesToAdd = matchLength.data;
        }
      }

      this.matchForm.get('endTime').setValue(moment(date).add(defaultMinutesToAdd, 'minutes'));

    });
  }

  ngOnDestroy() {
    this.teams$.unsubscribe();
  }

  showModal(roundId?: number, seasonMatch?: RCSeasonRoundMatch, divisionId?: number) {
    this.currentRoundId = roundId;
    this.divisionId = divisionId;
    this.modal.show();

    this.seasonId = this.activeRoute.parent.snapshot.params['seasonId'] || this.activeRoute.parent.snapshot.params['itemId'];
    this.leagueId = this.activeRoute.parent.parent.snapshot.params['id'] || this.activeRoute.parent.parent.snapshot.params['tournamentId'];

    this.resetForm();
    this.match = seasonMatch;

    if (this.match) {
      this.disableEdit = (this.match.status === EventStatus.CANCELLED);
    }

    if (this.currentRoundId && this.divisions) {
      const foundDivision = this.divisions.find(i => i.id === divisionId);

      if (foundDivision) {
        this.divisionSelected({ id: foundDivision.id, text: foundDivision.name });
        const found = foundDivision.rounds.find(i => i.id === this.currentRoundId);

        if (found) {
          this.matchForm.get('roundId').setValue([{
            id: this.currentRoundId,
            text: found.name
          }]);
        }
      }
    }

    if (this.season) {
      if (this.season.seasonWindows) {
        const isFutureSeason = moment(this.season.startDate).isAfter(moment());
        let seasonWindows = JSON.parse(JSON.stringify(this.season.seasonWindows)).map((i: any) => {
          i.activityTime.dayOfWeek = i.activityTime.dayOfWeek - 1;
          if (i.activityTime.dayOfWeek === 7) i.activityTime.dayOfWeek = 0;
          return i;
        });
        seasonWindows = _.orderBy(seasonWindows, (i: any) => i.activityTime.dayOfWeek);

        const currentDay = isFutureSeason ? moment(this.season.startDate).day() : moment().day();
        const foundFuture = seasonWindows.find((i) => i.activityTime.dayOfWeek >= currentDay);
        const timeFrame = foundFuture || seasonWindows[0];
        const momentDay = timeFrame.activityTime.dayOfWeek;

        if (isFutureSeason) {
          const timeElements = timeFrame.activityTime.open.split(':');
          const newDate = moment(this.season.startDate)
            .hour(timeElements[0])
            .minute(Number(timeElements) === 24 ? 0 : timeElements[1])
            .day(momentDay);

          if (moment(this.season.startDate).isAfter(newDate)) newDate.add(1, 'week');
          this.matchForm.get('startTime').setValue(newDate);
        } else {
          if (timeFrame) {
            const newDate = moment(timeFrame.activityTime.open, 'HH:mm:ss').day(momentDay);
            if (moment().isAfter(newDate)) newDate.add(1, 'week');

            this.matchForm.get('startTime').setValue(newDate);
          }
        }
      }
    }

    if (seasonMatch) {
      this.editMode = true;
      this.prefillFormData(seasonMatch);
    } else {
      this.editMode = false;
    }
  }

  prefillFormData(seasonMatch: RCSeasonRoundMatch) {
    const startDate = this.timeService.prepareTZForDisplay(seasonMatch.startDate, seasonMatch.timezone);
    const endDate = this.timeService.prepareTZForDisplay(seasonMatch.endDate, seasonMatch.timezone);

    this.matchForm.get('startTime').setValue(startDate);
    this.matchForm.get('endTime').setValue(endDate);
    this.matchForm.get('venueName').setValue(seasonMatch.venueName);
    this.matchForm.get('address').setValue(seasonMatch.address);
    this.matchForm.get('description').setValue(seasonMatch.description);
    this.matchForm.get('venueId').setValue(seasonMatch.venueId);
    this.matchForm.get('excludeStandings').setValue(seasonMatch.match && seasonMatch.match['excludeStandings']);

    if (seasonMatch.match && seasonMatch.match.participants && seasonMatch.match.participants.length) {
      const teamA = seasonMatch.match.participants[0];
      const teamB = seasonMatch.match.participants[1];

      this.matchForm.get('teamA').setValue([{
        id: teamA.entity.id,
        text: teamA.entity.name
      }]);

      this.matchForm.get('teamB').setValue([{
        id: teamB.entity.id,
        text: teamB.entity.name
      }]);
    }
  }

  onSubmit(value): void {
    if (this.loading) return;

    const match = this.prepareMatchObject(value);

    if (!match) return;
    if (moment(match.startDate).isAfter(match.endDate)) {
      this.toastr.error('End time cannot be before start time');
      return;
    }

    if (!value.roundId || !value.roundId[0] || !value.roundId[0].id) {
      this.toastr.error('Round must be specified');
      return;
    }

    this.newRoundId = value.roundId[0].id;
    if (this.editMode) return this.updateMatch(match);

    this.loading = true;
    this.leaguesService
      .createSeasonMatch(this.newRoundId, match)
      .subscribe((response) => {
        if (response.data && response.data.id) {
          this.onMatchAdded.emit({ match: response.data, divisionId: this.divisionId });
        }

        this.resetModal();
      }, () => {
        this.loading = false;
    });
  }

  resetModal() {
    this.modal.hide();
    this.resetForm();
    this.loading = false;
  }

  resetForm() {
    this.matchForm.reset(DEFAULT_MATCH);
  }

  updateMatch(match: RCCreateMatchBody): void {
    if (!this.seasonId || !this.currentRoundId || !this.leagueId || !this.match) {
      throw new Error('Season id, round id, league id and match id must be provided');
    }

    this.loading = true;

    this.leaguesService
      .updateSeasonMatch(this.leagueId, this.seasonId, this.currentRoundId, this.match.id, {
        startDate: match.startDate,
        endDate: match.endDate,
        venueName: match.venueName,
        venueId: match.venueId,
        description: match.description,
        address: match.address,
        newRoundId: this.newRoundId,
        excludeStandings: match.excludeStandings
    }).subscribe(() => {
      this.onMatchUpdated.emit(this.divisionId);
      this.resetModal();
    }, () => {
      this.loading = false;
      this.toastr.error('Error occurred while updating user');
    });
  }

  prepareMatchObject(formData): RCCreateMatchBody {
    const matchObject: RCCreateMatchBody = {
      startDate: this.timeService.replaceTimeZone(formData.startTime, this.league.timezone),
      endDate: this.timeService.replaceTimeZone(formData.endTime, this.league.timezone),
      venueName: formData.venueName,
      venueId: formData.venueId,
      description: formData.description,
      address: formData.address,
      participants: [],
      excludeStandings: formData.excludeStandings
    } as any;

    const teamA = this.getTeamsFromSelect(formData.teamA);
    const teamB = this.getTeamsFromSelect(formData.teamB);

    if (teamA && teamB) {
      if (teamA.id === teamB.id) {
        this.toastr.error('You can\'t select identical teams.');
        return;
      }
      matchObject.title = teamA.name + ' vs ' + teamB.name;
    }

    if (teamA) {
      matchObject.participants.push({
        entityId: teamA.id,
        entityType: 'team'
      });
    }


    if (teamB) {
      matchObject.participants.push({
        entityId: teamB.id,
        entityType: 'team'
      });
    }

    return matchObject;
  }

  getTeamsFromSelect(teamSelection): { name: string, id: number } {
    if (!teamSelection || !teamSelection[0]) return;

    return {
      name: teamSelection[0].text,
      id: teamSelection[0].id
    };
  }

  cancelMatch() {
    if (this.loading) return;

    this.loading = true;
    this.leaguesService
      .cancelSeasonMatch(this.currentRoundId, this.match.id)
      .subscribe(() => {
        this.onMatchRemoved.emit({ match: this.match, divisionId: this.divisionId });
        this.resetModal();
        this.toastr.success('Match successfully canceled');
      }, () => {
        this.loading = false;
        this.toastr.error('Error occurred while canceling the match');
      });
  }

  cancel() {
    this.resetForm();
    this.modal.hide();
  }

  /**
   * Triggered after an option from google places is clicked
   * This will not be triggered after textual value is changed
   * @param address
   */
  onAddressSelect(address: RCParsedAddress) {
    if (address.poi) {
      this.matchForm.get('venueName').setValue(address.name);
    }

    this.matchForm.get('address').setValue(address);
    this.matchForm.get('venueId').setValue(null);
  }

  onVenueSelect(venue: RCVenue) {
    if (!venue) return;

    this.matchForm.get('venueName').setValue(venue.name);
    this.matchForm.get('address').setValue(venue.address);
    this.matchForm.get('venueId').setValue(venue.id);
  }


  /**
   * When time is selected from timepicker it is
   * assigned as the hour and the minute of the selected date
   * @param timeObject
   * @param date
   * @returns { Moment }
   */
  assignTimeToDate(timeObject: Date, date: Date): moment.Moment {
    const hour = Number(moment(timeObject).format('HH'));
    const minute = Number(moment(timeObject).format('mm'));

    return moment(date).hour(hour).minute(minute);
  }

  timeChanged(data: Date, type: 'start' | 'end') {
    if (type === 'start') {
      this.matchForm.get('endTime').setValue(moment(data).add(1, 'hour'));
    }
  }

  delete() {
    this.loading = true;
    this.eventsService.deleteEvent(this.leagueId, this.seasonId, this.currentRoundId, this.match.id).subscribe(() => {
      this.loading = false;
      this.onMatchRemoved.emit({ match: this.match, divisionId: this.divisionId });
      this.resetModal();
      this.toastr.success('Match successfully removed');
    }, () => {
      this.loading = false;
      this.toastr.error('Error while removing event');
    });
  }

  divisionSelected(val: { id: number, text: string }) {
    const foundDivision = this.divisions.find(i => {
      return i.id === val.id;
    });

    if (this.matchForm) {
      this.matchForm.get('roundId').setValue([]);
    }

    if (foundDivision) {
      this.setDivisionTeamOption(val.id);

      if (foundDivision.rounds && foundDivision.rounds.length) {
        this.roundsSelection = foundDivision.rounds.map((i) => {
          return {
            id: i.id,
            text: i.name
          };
        });
      } else {
        this.roundsSelection = [];
      }
    } else {
      this.roundsSelection = [];
    }
  }

  setDivisionTeamOption(divisionId: number) {
    if (!this.teams) return;

    this.teamsSelection = this.teams.filter(i => i.team && i.divisionId === divisionId).map((i) => ({
      id: i.team.id,
      text: i.team.name
    }));
  }

  get reportPrintVisible() {
    if (!this.league) return;

    const soccer = this.league.sports.find(i => i === 4);
    return !!soccer && this.editMode;
  }

  downloadPrintableReport() {
    this.reportDownloadLoading = true;

    this.eventsService.createMatchReport([this.match.id]).subscribe((response: any) => {
      this.reportDownloadLoading = false;
      FileSaver.saveAs(response, `${moment().format('MM-DD-YYYY')}-${this.match.title}-match-report.pdf`);

    }, () => {
      this.reportDownloadLoading = false;
      this.toastr.error('Error while generating report');
    });
  }
}
