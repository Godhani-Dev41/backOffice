import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  RCSeasonPoolParticipant, RCSeasonRound, RCSeasonRoundMatch, RCSeasonSeries, RCSeasonTeam,
  RCTeam
} from '@rcenter/core';
import { TournamentService } from '@app/shared/services/tournament/tournament.service';
import {
  LeaguesService, RCSeriesBulkUpdateObject,
  RCStandingFetchResult
} from '@app/shared/services/leagues/leagues.service';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { DragulaService } from 'ng2-dragula';
import { setTime } from 'ngx-bootstrap/timepicker/timepicker.utils';
import { RCMatchParticipants, RCSeasonDivision } from '@rcenter/core/models/Leagues';
import { RCStanding } from '@rcenter/core/models/Standings';

interface BracketsRoundSeries {
  matches: RCSeasonRoundMatch[];
  seriesParticipants: RCSeasonPoolParticipant[];
}

interface BracketsRoundVM {
  name: string;
  id: number;
  matchUps: BracketsRoundSeries[][];
}

@Component({
  selector: 'rc-tournament-brackets',
  templateUrl: './tournament-brackets.component.html',
  styleUrls: ['./tournament-brackets.component.scss']
})
export class TournamentBracketsComponent implements OnInit, OnChanges {
  @Input() rounds: RCSeasonRound[];
  @Input() switchTeams: RCSeasonTeam[];
  @Output() onUpdate = new EventEmitter();
  @Output() onTouched = new EventEmitter();
  @Input() set parentSeasonDivisions(divisions: RCStandingFetchResult[]) {
    if (divisions) {
      this.allDivisions = JSON.parse(JSON.stringify(divisions));
      this.divisions = divisions;
    }
  }
  divisions: RCStandingFetchResult[] = [];
  bracketsVM: BracketsRoundVM[] = [];
  loadingTeamsUpdate: boolean;
  bracketsWinner: RCTeam;
  allDivisions: RCStandingFetchResult[];
  formChangesDirty = false;
  assignTeamsBarVisible = true;
  currentAssignedTeams: number[] = [];
  constructor(
    private toastr: ToastrService,
    private leaguesService: LeaguesService,
    private tournamentService: TournamentService,
    private dragulaService: DragulaService
  ) { }

  ngOnInit() {
    const bag = this.dragulaService.find('participant-drag-bag');
    if (bag !== undefined) {
      this.dragulaService.destroy('participant-drag-bag');
    }

    this.dragulaService.setOptions('participant-drag-bag', {
      moves: (el, source, handle, sibling) => {
        return !(el.classList.contains('no-drag'));
      },
      accepts: function (el, target, source, sibling) {
        return !(target.classList.contains('no-drag-to'));
      }
    });

    this.dragulaService.drop.subscribe((value) => {
      const bagName = value[0];

      if (bagName === 'participant-drag-bag') {
        this.onTouched.emit();

        setTimeout(() => {
          this.handleParticipantsDrag(value);

          const scheduleAssignments = this.getAssignedStandingsPosition();

          this.onTouched.emit(scheduleAssignments);
        }, 0);
      }
    });
  }

  getAssignedStandingsPosition() {
    const scheduleAssignments = [];
    this.bracketsVM[0].matchUps.forEach(matchUp => {
      matchUp.forEach(series => {
        const updateObject = {
          id: series['id'],
          seriesParticipants: series.seriesParticipants.map(i => {
            if (!i['entity']) return undefined;

            return {
              entityType: 'team',
              entityId: i['entity'].id,
              name: i['entity'].name
            };
          })
        };

        if (updateObject) {
          scheduleAssignments.push(updateObject);
        }
      });
    });

    return scheduleAssignments;
  }

  private handleParticipantsDrag(value) {
    const entityId = Number(value[1].id.split('-')[1]);
    const draggedTo = value[2].id.split('-')[0];
    const draggedToId = Number(value[2].id.split('-')[1]);
    const draggedFrom = value[3].id.split('-')[0];
    const draggedFromId = Number(value[3].id.split('-')[1]);

    let foundFrom, foundTo;

    this.bracketsVM[0].matchUps.forEach((matchup) => {
      if (!foundFrom) {
        foundFrom = matchup.find(j => {
          return j['id'] === draggedFromId;
        });
      }

      if (!foundTo) {
        foundTo = matchup.find(j => {
          return j['id'] === draggedToId;
        });
      }
    });

    const foundWhereInserted = foundTo.seriesParticipants.find(i => {
      return i.id === entityId;
    });
    const insertedIndex = foundTo.seriesParticipants.indexOf(foundWhereInserted);

    if (draggedFrom === 'teamsPool') {
      this.handleDragFromPool(foundTo, insertedIndex, foundWhereInserted);
    } else {
      if (foundFrom && foundTo) {
        if (draggedToId !== draggedFromId) {
          this.handleDragBetweenMatches(insertedIndex, foundTo, foundFrom);
        }
      }
    }
  }

  private handleDragFromPool(foundTo, insertedIndex: number, foundWhereInserted) {
    const removedItem = foundTo.seriesParticipants.splice(insertedIndex, 1);

    const changeIndex = (insertedIndex === 0) ? 0 : 1;
    if (!foundTo.seriesParticipants[changeIndex]) return;
    const previousTeam = foundTo.seriesParticipants[changeIndex].entity;

    if (previousTeam) {
      let foundSeasonTeam;
      this.allDivisions.forEach(d => {
        if (!foundSeasonTeam) {
          foundSeasonTeam = d.seasonTeams.find(seasonTeam => seasonTeam.team.id === previousTeam.id);
        }
      });

      this.currentAssignedTeams = this.currentAssignedTeams
        .filter(i => i !== previousTeam.id);

      if (foundSeasonTeam) {
        this.divisions.forEach(division => {

          if (division.id === foundSeasonTeam['divisionId']) {
            const alreadyExist = division.seasonTeams.find(j => j.team.id === foundSeasonTeam.team.id);
            if (!alreadyExist) {
              division.seasonTeams.push(foundSeasonTeam as any);
            }
          }
        });
      }
    }

    this.currentAssignedTeams.push(foundWhereInserted.team.id);
    foundTo.seriesParticipants[changeIndex].entity = foundWhereInserted.team;
  }

  private handleDragBetweenMatches(insertedIndex: number, foundTo, foundFrom) {
    let removedParticipant;
    if (insertedIndex === 0) {
      removedParticipant = foundTo.seriesParticipants.splice(1, 1);
    } else if (insertedIndex === 1) {
      removedParticipant = foundTo.seriesParticipants.splice(2, 1);
    } else if (insertedIndex === 2) {
      removedParticipant = foundTo.seriesParticipants.splice(1, 1);
    }

    foundFrom.seriesParticipants.push(removedParticipant[0]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.rounds) {
      this.bracketsVM = this.calculateBracketsVM(this.rounds);
      if (this.bracketsVM.length) {
        this.currentAssignedTeams = _.flatten(this.getAssignedStandingsPosition().map((i) => i.seriesParticipants))
          .filter(i => i).map(i => i.entityId);
      }

      if (this.rounds.length) {
        const finalRound = this.rounds[this.rounds.length - 1];

        if (finalRound.series && finalRound.series.length && finalRound.series[0]['status'] === 3) {
          if (finalRound.series[0].seriesParticipants[1]) {
            if (finalRound.series[0].seriesParticipants[0].outcomeOrdinal < finalRound.series[0].seriesParticipants[1].outcomeOrdinal) {
              this.bracketsWinner = finalRound.series[0].seriesParticipants[0]['entity'];
            } else {
              this.bracketsWinner = finalRound.series[0].seriesParticipants[1]['entity'];
            }
          } else {
            this.bracketsWinner = finalRound.series[0].seriesParticipants[0]['entity'];
          }
        }
      }
    }
  }

  calculateBracketsVM(rounds): BracketsRoundVM[] {
    const roundsVM: BracketsRoundVM[] = [];
    rounds.forEach((round) => {
      const roundObject: BracketsRoundVM = {
        name: round.name,
        id: round.id,
        matchUps: []
      };

      const seriesGroups = [];

      if (!round.series) {
        console.error('No round series found');
        return;
      }
      const seriesClone = JSON.parse(JSON.stringify(round.series));

      // split the array in to 2 groups per matchup for ui purposes
      while (seriesClone.length > 0) {
        seriesGroups.push(seriesClone.splice(0, 2));
      }

      seriesGroups.forEach((series) => {
        roundObject.matchUps.push(series);
      });
      roundsVM.push(roundObject);
    });

    return roundsVM;
  }

  transferTeams(series: RCSeasonSeries, firstTeam: RCTeam, secondTeam: RCTeam, position = 'first') {
    const currentSeriesTeams: any[] = series.seriesParticipants
      .filter(i => i['entity'] && i['entity'].id !== firstTeam.id)
      .map((i) => {
        return {
          entityType: 'team',
          entityId: i['entity'].id,
          name: i['entity'].name
        };
      });

    if (!currentSeriesTeams.length) {
      currentSeriesTeams.push(null);
    }

    if (position === 'first') {
      currentSeriesTeams.unshift({
        entityType: 'team',
        entityId: secondTeam.id,
        name: secondTeam.name
      });
    } else {
      currentSeriesTeams.push({
        entityType: 'team',
        entityId: secondTeam.id,
        name: secondTeam.name
      });
    }

    const secondTeamFoundSeries = this.getSecondTeamSeries(secondTeam);

    let secondTeamSeriesTeams = [];
    if (secondTeamFoundSeries && secondTeamFoundSeries.seriesParticipants) {
      secondTeamSeriesTeams = secondTeamFoundSeries.seriesParticipants
        .filter(i => i['entity'] && i['entity'].id !== secondTeam.id)
        .map((i) => {
          return {
            entityType: 'team',
            entityId: i['entity'].id,
            name: i['entity'].name
          };
        });
    }

    secondTeamSeriesTeams.push({
      entityType: 'team',
      entityId: firstTeam.id,
      name: firstTeam.name
    });

    this.loadingTeamsUpdate = true;
    this.tournamentService
      .updateSeriesParticipants(
        this.leaguesService.currentLeagueId,
        this.leaguesService.currentSeasonId,
        series.id,
        currentSeriesTeams
      ).subscribe(() => {

        if (secondTeamFoundSeries) {
          // if we are moving a single item from a single item series
          // we want to remove the participants list on that series
          secondTeamSeriesTeams = secondTeamSeriesTeams.filter((i) => i.entityId && i.name);

          this.tournamentService
            .updateSeriesParticipants(
              this.leaguesService.currentLeagueId,
              this.leaguesService.currentSeasonId,
              secondTeamFoundSeries.id,
              secondTeamSeriesTeams
            ).subscribe(() => {
              this.loadingTeamsUpdate = false;
              this.toastr.success('Teams successfully switched');
              this.onUpdate.emit();
            }, () => {
              this.loadingTeamsUpdate = false;

              this.toastr.error('Error occurred while updating participants');
            });
          } else {
            this.loadingTeamsUpdate = false;
            this.onUpdate.emit();
          }
        }, () => {
          this.loadingTeamsUpdate = false;
          this.toastr.error('Error occurred while updating participants');
        });
  }

  /**
   * We want to find the series in which the second team exist
   * in order to update it's participants with the switched team participant
   * @param secondTeam
   * @returns {any}
   */
  getSecondTeamSeries(secondTeam: RCTeam) {
    if (!this.rounds || !this.rounds.length) return;
    let foundSeries;

    this.rounds[0].series.forEach((seriee) => {
      const foundParticipant = seriee.seriesParticipants.find(participant => {
        return participant['entity'] && participant['entity'].id === secondTeam.id;
      });

      if (foundParticipant) {
        foundSeries = seriee;
      }
    });

    return foundSeries;
  }

  /**
   * We want to extract only teams that are not in a finished rounds currently.
   * you cannot re-assign team when the series is finished
   * @param excludeId
   * @returns {RCSeasonTeam[]}
   */
  getValidTeamsArray(excludeId: number) {
    const filteredSeriesTeams = this.rounds[0].series.filter(i => i['status'] === 3).map(series => {
      return series.seriesParticipants.map((i) => i['entity'].id);
    });
    const allowedTeamsArray = _.flatten(filteredSeriesTeams);

    return this.switchTeams
      .filter(i => {
        return !allowedTeamsArray.includes(i.team.id) && i.team.id !== excludeId;
      });
  }

  /**
   * Bug fix for server not generating empty participants items
   */
  getSeriesParticipants(participants) {
    if (!participants || !participants.length) return [{ score: null }, { score: null }];
    if (participants.length === 1) return [participants[0], { score: null }];

    return participants;
  }

  getVisibleAssignTeams(teams: RCStanding[]): RCStanding[] {
    return teams.filter(i => i.team).filter(i => {
      return !this.currentAssignedTeams.includes(i.team.id);
    });
  }
}
