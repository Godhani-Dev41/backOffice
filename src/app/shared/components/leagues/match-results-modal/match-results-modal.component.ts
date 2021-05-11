import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RCSeasonRoundMatch } from '@rcenter/core/models/Leagues';
import { ToastrService } from 'ngx-toastr';
import { EventsService, RCRequestUpdateMatch } from '@app/shared/services/events/events.service';


@Component({
  selector: 'rc-match-results-modal',
  templateUrl: './match-results-modal.component.html',
  styleUrls: ['./match-results-modal.component.scss'],
  exportAs: 'modal'
})
export class MatchResultsModalComponent implements OnInit {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() onUpdated = new EventEmitter<{ match: RCSeasonRoundMatch, roundId: number, divisionId: number }>();
  @Output() onEditClick = new EventEmitter<{ match: RCSeasonRoundMatch, roundId: number, divisionId: number }>();
  editMode: boolean;
  loading: boolean;
  matchResultsForm: FormGroup;
  match: RCSeasonRoundMatch;
  divisionId: number;
  roundId: number;
  constructor(
    private toastr: ToastrService,
    private eventsService: EventsService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.matchResultsForm = this.fb.group({
      teamAScore: 0,
      teamBScore: 0
    });
  }

  onSubmit(data) {
    const body: RCRequestUpdateMatch = {
      participants: []
    };

    if (this.match.match.participants[0]) {
      body.participants.push({
        score: data.teamAScore,
        participantId: this.match.match.participants[0].id
      });
    }

    if (this.match.match.participants[1]) {
      body.participants.push({
        score: data.teamBScore,
        participantId: this.match.match.participants[1].id
      });
    }

    this.loading = true;

    this.eventsService.updateMatch(this.match.id, body).subscribe(() => {
      this.toastr.success('Match updated');

      this.onUpdated.emit({
        match: this.match,
        roundId: this.roundId,
        divisionId: this.divisionId
      });

      this.modal.hide();
      this.matchResultsForm.reset();
      this.loading = false;
    }, () => {
      this.toastr.error('Error occurred while updating');
      this.loading = false;
    });
  }

  showModal(match: RCSeasonRoundMatch, divisionId?: number, roundId?: number) {
    this.divisionId = divisionId;
    this.roundId = roundId;
    this.match = match;
    this.modal.show();
    this.matchResultsForm.reset();

    if (match.match) {
      if (match.match.participants[0]) {
        this.matchResultsForm.get('teamAScore').setValue(match.match.participants[0].score || 0);
      }

      if (match.match.participants[1]) {
        this.matchResultsForm.get('teamBScore').setValue(match.match.participants[1].score || 0);
      }

      this.editMode = (match.match.participants[1].score !== null) || (match.match.participants[0].score !== null);
    }
  }

  editMatch() {
    this.onEditClick.emit({ match: this.match, roundId: this.roundId, divisionId: this.divisionId });
  }
}
