import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ScheduleXlsUploadModalComponent
  // tslint:disable-next-line
} from '@app/client/pages/leagues/league-page/league-page-season/season-matches-page/schedule-xls-upload-modal/schedule-xls-upload-modal.component';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { EventStatus, RCLeagueSeason, RCSeasonRoundMatch, RCSeasonScheduleStatusEnum } from '@rcenter/core';
import { MatchEditModalComponent } from '@app/shared/components/leagues/match-edit-modal/match-edit-modal.component';
import { EventsService } from '@app/shared/services/events/events.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConfirmationModalComponent } from '@app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { BulkChangeTimeModalComponent } from '@app/shared/components/time-select-modal/time-select-modal.component';
import { VenueSelectModalComponent } from '@app/shared/components/venue-select-modal/venue-select-modal.component';
import { SchedulerGeneratedData } from '@app/shared/services/leagues/scheduler.interface';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'rc-season-matches-page',
  templateUrl: './season-matches-page.component.html',
  styleUrls: ['./season-matches-page.component.scss']
})
export class SeasonMatchesPageComponent implements OnInit {
  season: RCLeagueSeason;
  rows: any[];
  temp: any[];
  matchesResponse: any[];
  selectedMatches: any[] = [];
  roundsVM: { name: string, ordinal: number, removable: boolean, id: number }[];
  @ViewChild('publishConfirmModal', { static: true }) publishConfirmModal: ConfirmationModalComponent;
  @ViewChild('cancelConfirmModal', { static: true }) cancelConfirmModal: ConfirmationModalComponent;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;
  @ViewChild('matchEditModal', { static: true }) matchEditModal: MatchEditModalComponent;
  @ViewChild('changeTimeModal', { static: true }) changeTimeModal: BulkChangeTimeModalComponent;
  @ViewChild('venueSelectModal', { static: true }) venueSelectModal: VenueSelectModalComponent;
  @ViewChild('scheduleUploaderModal', { static: true }) scheduleUploaderModal: ScheduleXlsUploadModalComponent;
  scoreUpdateProcessing = false;
  scoreDirty = false;
  RCSeasonScheduleStatusEnum = RCSeasonScheduleStatusEnum;
  scheduleDetailsOpen = false;
  scheduleData: SchedulerGeneratedData;
  currentView: 'list' | 'calendar' = 'list';
  loading = false;
  loadingStats = false;
  constructor(
    private toastr: ToastrService,
    private eventsService: EventsService,
    private leaguesService: LeaguesService
  ) {

  }

  toggleScheduleStats() {
    if (!this.scheduleData) this.loadStatistics();
    this.scheduleDetailsOpen = !this.scheduleDetailsOpen;
  }

  showExcelScheduleUpload() {
    this.scheduleUploaderModal.showModal();
  }

  ngOnInit() {
    this.leaguesService.currentSeason$.subscribe((response) => {
      this.season = response;

      if (response) {
        this.getMatches();
      }
    });
  }

  activate() {
    this.matchesResponse = this.matchesResponse.map((i) => {
      if (i.startDate) {
        i.isPastMatch = moment(i.startDate).isBefore(moment());
      }

      if (i.eventRound && i.eventRound.divisionId && this.season) {
        const found = this.season.seasonDivisions.find(division => {
          return division.id === i.eventRound.divisionId;
        });

        if (found) {
          i.divisionName = found.name;
          i.divisionColor = found.color;
        }
      }

      return i;
    });

    if (this.season.tournamentType || this.season.playoffType) {
      const grouppedRounds = _.groupBy(this.matchesResponse, (i) => i['eventRound'].ordinal);
      let lastFoundMatch;
      for (const key of Object.keys(grouppedRounds)) {
        const found = grouppedRounds[key].find(i => {
          if (!i.match) return false;
          if (!i.match.participants[1] || !i.match.participants[0]) return false;

          return i.match.participants[1].score || i.match.participants[0].score !== null;
        });

        if (found) {
          lastFoundMatch = found;
        }
      }

      if (lastFoundMatch && lastFoundMatch['eventRound']) {
        this.matchesResponse = this.matchesResponse.map(i => {
          i['disableScoreEdit'] = (i['eventRound'].ordinal < lastFoundMatch['eventRound'].ordinal);
          return i;
        });
      }
    }

    this.selectedMatches = [];
    this.rows = this.matchesResponse;
    this.temp = [...this.matchesResponse];

    const uncanceledMatches = this.rows.filter((i) => {
      return i.status !== 4;
    });
    const roundsGroup = _.groupBy(uncanceledMatches, (i) => {
      return i.eventRound.id;
    });

    if (this.season.rounds) {
      this.roundsVM = this.season.rounds.map((i) => {
        const round = {
          id: i.id,
          name: i.name,
          ordinal: i.ordinal,
          removable: true
        };

        if (roundsGroup[i.id] && roundsGroup[i.id].length) {
          round.removable = false;
        }

        return round;
      });
    }


    if (this.table) {
      this.table.recalculate();
    }
  }


  getMatches() {
    if (!this.season) return;

    this.loading = true;
    this.leaguesService.getSeasonMatches(this.season.leagueId, this.season.id).subscribe((response) => {
      this.matchesResponse = response.data;
      this.loading = false;
      this.activate();
    });
  }

  loadStatistics() {
    if (this.loadingStats) return;

    this.loadingStats = true;
    this.leaguesService.getSeasonStatistics(this.season.leagueId, this.season.id).subscribe((statistics) => {
      this.scheduleData = statistics.data;
      this.loadingStats = false;
    }, () => {
      this.loadingStats = false;
    });
  }

  onMatchSelect({ selected }) {
    this.selectedMatches.splice(0, this.selectedMatches.length);
    this.selectedMatches.push(...selected);
  }

  addMatch() {
    this.toastr.success('Match created successfully');
    this.getMatches();
  }

  removeMatch() {
    this.getMatches();
  }

  changeMatchesTime(dateObject) {
    const mappedMatches = this.selectedMatches
      .filter(i => i.status !== 4)
      .map((i) => {
        return {
          startDate: dateObject.startDate,
          endDate: dateObject.endDate,
          eventId: i.id,
          roundId: i.eventRound.id
        };
      });
    if (!mappedMatches.length) return this.toastr.warning('You must select at least one match to change');

    this.leaguesService.bulkMatchesUpdate(this.season.leagueId, this.season.id, mappedMatches).subscribe(() => {
      this.toastr.success('Matches successfully updated');
      this.getMatches();
    }, () => {
      this.toastr.error('Error occurred during matches update');
    });
  }

  editMatch(roundId: number, match: RCSeasonRoundMatch, divisionId: number) {
    this.matchEditModal.showModal(roundId, match, divisionId);
  }

  saveScoreChanges() {
    if (this.scoreUpdateProcessing) return;

    const notFinishedMatchEdit = this.rows.find((i) => {
      const [pt1, pt2] = i.match.participants;
      if (!pt1 || !pt2) return false;

      return (pt1.score === null && pt2.score !== null) || (pt1.score !== null && pt2.score === null);
    });

    if (notFinishedMatchEdit) {
      this.toastr.warning('You must complete editing match ' + notFinishedMatchEdit.title + ' scores');
      return;
    }
    const mappedScores = this.rows.filter(i => i['dirty'] && (i.status !== 4) && i.match.participants[0]).map((i) => {
      return {
        eventId: i.id,
        status: i.match.participants[0].score === null ? 2 : 4,
        participants: i.match.participants.map(j => ({ score: j.score, participantId: j.id }))
      };
    });

    this.scoreUpdateProcessing = true;

    this.leaguesService.bulkScoreUpdate(this.season.leagueId, this.season.id, mappedScores).subscribe(() => {
      this.scoreUpdateProcessing = false;
      this.toastr.success('Scores sccuesfully updated');
      this.scoreDirty = false;
      this.getMatches();
    }, () => {
      this.toastr.error('Error while updating scores');
      this.scoreUpdateProcessing = false;
    });
  }

  matchScoreChanged(event: RCSeasonRoundMatch) {
    event['dirty'] = true;

    if (this.season.tournamentType || this.season.playoffType) {
      this.rows = this.rows.map((i) => {
        if (i.eventRound) {
          if (i.eventRound.id !== event['eventRound'].id) {
            i['disableScoreEdit'] = true;
          } else {
            i['disableScoreEdit'] = false;
          }
        }
        return i;
      });

      this.temp = [...this.rows];
    }

    this.scoreDirty = true;
  }

  updateTextFilter(event) {
    const val = event.target.value.toLowerCase();

    // update the rows
    this.rows = this.temp.filter(function (d) {
      return (d.title && d.title.toLowerCase().indexOf(val) !== -1) ||
        (d.venueName && d.venueName.toLowerCase().indexOf(val) !== -1) ||
        (d.eventRound && d.eventRound.name.toLowerCase().indexOf(val) !== -1) ||
        (d.divisionName && d.divisionName.toLowerCase().indexOf(val) !== -1) ||
        !val;
    });

    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  promptToCancelMatches() {
    this.cancelConfirmModal.showModal();
  }

  promptToPublishMatches() {
    this.publishConfirmModal.showModal();
  }

  cancelSelectedMatches() {
    const idsToPublish = this.selectedMatches.map(i => {
      return {
        eventId: i.id,
        roundId: i.eventRound.id
      };
    });
    if (!idsToPublish.length) return this.toastr.warning('You must select at least one match to cancel');

    this.leaguesService
      .bulkCancelSeasonMatches(this.season.leagueId, this.season.id, idsToPublish)
      .subscribe(() => {
        this.toastr.success('Matches successfully canceled');
        this.getMatches();
      }, () => {
        this.toastr.error('Error occurred during matches cancel');
      });
  }

  publishSelectedMatches() {
    const idsToPublish = this.selectedMatches.map(i => i.id);
    if (!idsToPublish.length) return this.toastr.warning('You must select at least one match to publish');

    this.leaguesService
      .bulkPublishSeasonMatches(this.season.leagueId, this.season.id, idsToPublish)
      .subscribe(() => {
        this.toastr.success('Matches successfully published');
        this.getMatches();
      }, () => {
        this.toastr.error('Error occurred during matches update');
      });
  }

  openChangeTimeModal() {
    this.changeTimeModal.showModal();
  }

  changeMatchesVenue(data) {
    const mappedMatches = this.selectedMatches
      .filter(i => i.status !== EventStatus.CANCELLED && i.status !== EventStatus.DELETED)
      .map((i) => {
        return {
          address: data.address,
          venueName: data.venueName,
          venueId: data.venueId,
          eventId: i.id,
          roundId: i.eventRound.id
        };
      });
    if (!mappedMatches.length) return this.toastr.warning('You must select at least one match to change');

    this.leaguesService.bulkMatchesUpdate(this.season.leagueId, this.season.id, mappedMatches).subscribe(() => {
      this.toastr.success('Matches successfully updated');
      this.getMatches();
    }, () => {
      this.toastr.error('Error occurred during matches update');
    });
  }

  roundsUpdated() {
    this.leaguesService.getSeasonById(this.season.leagueId, this.season.id).subscribe((response) => {
      this.leaguesService.setCurrentSeason(response.data);
      this.season = response.data;
    });
  }

  downloadSchedule() {
    this.leaguesService.getScheduleReport(this.season.leagueId, this.season.id).subscribe((response: any) => {
      FileSaver.saveAs(
        response,
        `${moment().format('MM-DD-YYYY')}-${this.season.seasonLeague.name}-${this.season.name}-schedule.xlsx`
      );
    }, () => {
      this.toastr.error('Error while generating report');
    });
  }
}
