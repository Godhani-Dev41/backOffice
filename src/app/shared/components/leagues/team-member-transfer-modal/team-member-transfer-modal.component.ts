import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RCTeam, RCSeasonTeam } from '@rcenter/core';

@Component({
  selector: 'rc-team-member-transfer-modal',
  templateUrl: './team-member-transfer-modal.component.html',
  styleUrls: ['./team-member-transfer-modal.component.scss'],
  exportAs: 'modal'
})
export class TeamMemberTransferModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') public modal: ModalDirective;
  @Output() onSubmit = new EventEmitter();
  loading: boolean;
  seasonId: number;
  leagueId: number;
  userId: number;
  team: RCTeam;
  memberTransferForm: FormGroup;
  teams$: Subscription;
  teamsSelection: {id: number, text: string, disabled?: boolean}[];
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private leaguesService: LeaguesService
  ) { }

  ngOnInit() {
    this.memberTransferForm = this.fb.group({
      selectedTeam: ''
    });

    this.teams$ = this.leaguesService.currentTeams$.subscribe((teams) => {
      if (teams) {
        this.teamsSelection = teams
          .filter((i) => i.team)
          .map((i) => ({
            id: i.team.id,
            text: i.team.name
          }));
      } else {
        this.teamsSelection = [];
      }
    });
  }

  ngOnDestroy() {
    this.teams$.unsubscribe();
  }

  showModal(seasonTeam: RCSeasonTeam, userId: number, seasonId: number, leagueId: number) {
    this.modal.show();
    this.team = seasonTeam.team;
    this.seasonId = seasonId;
    this.leagueId = leagueId;
    this.userId = userId;
  }

  submit(data) {
    if (this.loading) return;
    const [ selectedTeam ] = data.selectedTeam;

    if (selectedTeam.id === this.team.id) {
      return this.toastr.error('Cannot select the same team');
    }

    this.onSubmit.emit({
      newTeamId: selectedTeam.id,
      oldTeamId: this.team.id,
      userId: this.userId
    });

    this.reset(true);

    /*this.loading = true;*/
/*    this.leaguesService.reAssignTeamMember(this.leagueId, this.seasonId, {
      userId: this.userId,
      oldTeamId: this.team.id,
      newTeamId: selectedTeam.id,
      creatorId: this.team.creatorId,
      creatorType: this.team.creatorType
    }).subscribe(() => {
      this.reset(true);
      this.onSubmit.emit();
      this.toastr.success('Player successfully transferred');
    }, (err) => {
      const response = err;
      this.loading = false;

      this.toastr.error(response.error || 'Error occurred while transferring to team');
    });*/
  }

  reset(closeModal?: boolean) {
    this.loading = false;
    this.seasonId = null;
    this.leagueId = null;
    this.userId = null;
    this.team = null;

    if (closeModal) {
      this.modal.hide();
    }
  }
}
