import { Component, Input, EventEmitter, Output } from '@angular/core';
import { RCLeagueSeason } from '@rcenter/core';
import * as _ from 'lodash';
import { SchedulerGeneratedData } from '@app/shared/services/leagues/scheduler.interface';

@Component({
  selector: 'rc-schedule-statistics-sidebar',
  templateUrl: './schedule-statistics-sidebar.component.html',
  styleUrls: ['./schedule-statistics-sidebar.component.scss']
})
export class ScheduleStatisticsSidebarComponent {
  @Output() onScheduleClose = new EventEmitter();
  @Input() scheduleDetailsOpen = false;
  @Input() season: RCLeagueSeason;
  @Input() loading = false;
  @Input() set scheduleData(scheduleData: SchedulerGeneratedData) {
    this._scheduleData = scheduleData;

    if (scheduleData) {
      this.calculateGameTimesTable();

      if (this._scheduleData.seasonDivisions) {
        this._scheduleData.seasonDivisions.forEach(division => {
          division.opponentsTable = this.calculateOpponentsTable(division.participantStatistics);
        });
      }
    }
  }
  _scheduleData: SchedulerGeneratedData;

  gameTimesTable: any[];
  constructor() { }

  calculateGameTimesTable(): any[] {
    if (!this._scheduleData || !this._scheduleData.seasonDivisions) return;
    const allGamesTimes = _.flatten(this._scheduleData.seasonDivisions.map(i => i.participantStatistics));

    if (this._scheduleData.seasonDivisions) {
      this._scheduleData.seasonDivisions.forEach(division => {
        division.opponentsTable = this.calculateOpponentsTable(division.participantStatistics);
      });
    }

    const timesArray = _.flatten(allGamesTimes.map(i => {
      if (!i.times) i.times = [];
      return i.times.map(j => j.hour);
    }));

    // Extract all unique items for the statisitcs array
    // that will be used as our top header row and mapping index
    const uniqueTimes = _.orderBy(_.uniq(timesArray), (v) => v);

    // map the unique items for the table view
    const mappedUniqueTimes = uniqueTimes.map((i: any) => {
      if (i > 12) {
        i = (i - 12) + '-' + ((i - 12) + 1) + 'PM';
      } else {
        i += '-' + (i + 1) + 'AM';
      }

      return { title: i, type: 'top-header' };
    });

    // This  will host the entire table object mapping
    // first row the header row
    this.gameTimesTable = [
      [{ title: '', type: 'empty-top-header'}, ...mappedUniqueTimes]
    ];

    allGamesTimes.forEach((participant) => {
      // Find the team to extract it's name to be shown in the table
      // since the server doesn't return the team name inside current data store
      let foundTeam;
      if (this._scheduleData.seasonTeams) {
        foundTeam = this._scheduleData.seasonTeams.find(i => i.teamId === participant.participantId);
      }

      const participantsGames = [{
        title: foundTeam && foundTeam.team ? foundTeam.team.name : '',
        type: 'left-side-header'
      }];

      // Next we iterate over the unique times array and search if the team has this hour counted
      // if so we add it and if not we add an empty count
      uniqueTimes.forEach((i) => {
        const foundHour = participant.times.find(j => j.hour === i);

        participantsGames.push({
          title: foundHour ? foundHour.count : 0 as any,
          type: 'data-cell'
        });
      });

      this.gameTimesTable.push(participantsGames);
    });
  }

  calculateOpponentsTable(participantStatistics): any[] {
    if (!participantStatistics) return;

    const topHeader = participantStatistics.map(i => {
      let foundTeam;
      if (this._scheduleData.seasonTeams) {
        foundTeam = this._scheduleData.seasonTeams.find((j) => {
          return j.teamId === i.participantId;
        });
      }

      return {
        title: foundTeam && foundTeam.team ? foundTeam.team.name : '',
        type: 'top-header'
      };
    });

    const opponentsTable = [
      [{ title: '', type: 'empty-top-header' }, ...topHeader]
    ];

    participantStatistics.forEach((item) => {
      let foundTeam;

      if (this._scheduleData.seasonTeams) {
        foundTeam = this._scheduleData.seasonTeams.find((j) => {
          return j.teamId === item.participantId;
        });
      }


      const rowArray = [{
        title: foundTeam && foundTeam.team ? foundTeam.team.name : '',
        type: 'left-side-header'
      }];

      participantStatistics.forEach((p) => {
        if (item.encounters) {
          const foundEncounter = item.encounters
            .find(encounter => encounter.participantId === p.participantId);

          if (foundEncounter) {
            rowArray.push({
              title: foundEncounter.count,
              type: 'cell-data'
            });
          } else {
            rowArray.push({
              title: '',
              type: 'empty-slot'
            });
          }
        }
      });

      opponentsTable.push(rowArray);
    });

    return opponentsTable;
  }

}
