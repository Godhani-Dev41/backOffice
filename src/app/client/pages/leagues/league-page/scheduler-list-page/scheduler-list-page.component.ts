import { Component, OnInit, ViewChild } from '@angular/core';
import { SeasonSchedulerService } from '@app/shared/services/leagues/season-scheduler.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  RCActivityTime, RCLeagueSeason, RCSeasonRound, RCSeasonRoundMatch, RCSeasonTeam,
  RCVenueActivityItem
} from '@rcenter/core';
import * as _ from 'lodash';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from '@app/shared/components/confirmation-modal/confirmation-modal.component';
import { SchedulerGeneratedData } from '@app/shared/services/leagues/scheduler.interface';

interface RSMatchVM extends RCSeasonRoundMatch {
  divisionId: number;
  divisionName: string;
  divisionColor: string;
}

@Component({
  selector: 'rc-scheduler-list-page',
  templateUrl: './scheduler-list-page.component.html',
  styleUrls: ['./scheduler-list-page.component.scss']
})
export class SchedulerListPageComponent implements OnInit {
  filteredRounds: any[] = [];
  scheduleDetailsOpen = false;
  scheduleData: SchedulerGeneratedData;
  schedulerStats: {
    matchesCount?: number;
  };
  matchesList: RSMatchVM[];
  currentView: 'list' | 'calendar' = 'list';
  season: RCLeagueSeason;
  loading: boolean;
  discardLoading: boolean;
  @ViewChild('publishConfirmModal', { static: true }) publishConfirmModal: ConfirmationModalComponent;
  activeDivisions: number[];
  constructor(
    private activatedRoute: ActivatedRoute,
    private seasonScheduleService: SeasonSchedulerService,
    private leaguesService: LeaguesService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    const seasonId = this.activatedRoute.snapshot.params['seasonId'];
    const leagueId = this.activatedRoute.snapshot.parent.params['id'];
    this.loading = true;

    this.seasonScheduleService.getSuggestedSchedule(leagueId, seasonId).subscribe((response) => {
      this.leaguesService.getSeasonById(leagueId, seasonId).subscribe((seasonResponse) => {
        this.season = seasonResponse.data;
        this.scheduleData = response.data;

        if (this.season && this.season.seasonDivisions) {
          this.activeDivisions = this.season.seasonDivisions.map(i => i.id);
        } else {
          this.activeDivisions = [];
        }

        this.loading = false;

        const matchesCount = this.scheduleData.rounds.reduce((h, i) => {
          if (i.matches) {
            h += i.matches.length;
          }

          return h;
        }, 0);

        this.schedulerStats = {
          matchesCount
        };

        this.scheduleData.rounds.forEach(round => {
          round.matches = round.matches.map((i) => {
            if (!this.season.seasonDivisions) return;

            const found = this.season.seasonDivisions.find(division => {
              return division.id === round.divisionId;
            });

            i['divisionId'] = round.divisionId;

            if (found) {
              i['divisionName'] = found.name;
              i['divisionColor'] = found.color;
            }

            return i;
          });
        });

        this.matchesList = _.flatten(this.scheduleData.rounds.map(i => {
          return i.matches;
        })) as RSMatchVM[];

        this.filterMatches();
      });
    }, () => {
      this.loading = false;
      this.toastr.error('Error occurred while fetching the schedule suggestions');
    });
  }

  discardSchedule() {
    this.discardLoading = true;
    this.seasonScheduleService
      .discardSchedule(this.season.leagueId, this.season.id)
      .subscribe(() => {
        this.discardLoading = false;
        this.toastr.success('Schedule discarded');
        this.router.navigate(['/client/leagues/view/' + this.season.leagueId + '/season/' + this.season.id]);
      }, () => {
        this.discardLoading = false;
        this.toastr.error('Error while discarding');
      });
  }

  promptPublish() {
    if (this.season.rounds && this.season.rounds.length) {
      this.publishConfirmModal.showModal();
    } else {
      this.publishSchedule();
    }
  }

  publishSchedule() {
    this.loading = true;
    this.seasonScheduleService
      .publishSchedule(this.season.leagueId, this.season.id)
      .subscribe(() => {
        this.loading = false;
        this.toastr.success('Schedule saved');
        this.router.navigate(['/client/leagues/view/' + this.season.leagueId + '/season/' + this.season.id + '/matches']);
      }, () => {
        this.loading = false;
        this.toastr.error('Error while publishing');
      });
  }

  toggleActiveDivision(id: number) {
    if (this.activeDivisions.indexOf(id) !== -1) {
      this.activeDivisions = this.activeDivisions.filter((i) => i !== id);
    } else {
      this.activeDivisions.push(id);
    }

    this.filterMatches();
  }

  filterMatches() {
    this.filteredRounds = JSON.parse(JSON.stringify(this.scheduleData)).rounds.reduce((h, round) => {
      const foundRound = h.find((r) => r.name === round.name);

      if (!foundRound) {
        h.push(round);
      } else {
        foundRound.matches = foundRound.matches.concat(round.matches);
      }

      return h;
    }, []).map((round) => {
      round.matches = _.sortBy(round.matches.filter(i => {
        return this.activeDivisions.indexOf(i['divisionId']) !== -1;
      }), 'startDate');

      return round;
    });
  }

  isDivisionSelected(id: number) {
    return this.activeDivisions.indexOf(id) !== -1;
  }
}
