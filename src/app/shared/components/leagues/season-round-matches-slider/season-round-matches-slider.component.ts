import { Component, EmbeddedViewRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatchEditModalComponent } from '@app/shared/components/leagues/match-edit-modal/match-edit-modal.component';
import * as moment from 'moment';
import { RCSeasonRoundMatch, RCSeasonRound, RCSeasonDivision } from '@rcenter/core';

export interface RCMatchSliderOnClickEvent {
  roundId: number;
  match?: RCSeasonRoundMatch;
  isPast?: boolean;
}

@Component({
  selector: 'rc-season-round-matches-slider',
  templateUrl: 'season-round-matches-slider.component.html',
  styleUrls: ['season-round-matches-slider.component.scss']
})
export class SeasonRoundMatchesSliderComponent implements OnInit {
  @Output() onClick = new EventEmitter<RCMatchSliderOnClickEvent>();
  @Output() onShareClick = new EventEmitter<RCSeasonRoundMatch>();
  @Input() matches: RCSeasonRoundMatch[];
  @Input() round: RCSeasonRound;
  @Input() tournament: boolean;
  @Input() division: RCSeasonDivision;
  @ViewChild('modal', { static: false }) modal: MatchEditModalComponent;
  constructor() { }

  ngOnInit() {

  }

  /**
   * Checks if the match has already happened in order to show on the UI relevant status
   * @param match
   * @returns {boolean}
   */
  isPastMatch(match: RCSeasonRoundMatch): boolean {
    if (!match.startDate) return false;

    return moment(match.startDate).isBefore(moment());
  }
}
