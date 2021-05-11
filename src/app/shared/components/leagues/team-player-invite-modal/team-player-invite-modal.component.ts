import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { RCInviteeObject, TeamsService } from '@app/shared/services/teams/teams.service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RCSeasonTeam, RCUserInvite } from '@rcenter/core';

@Component({
  selector: 'rc-team-player-invite-modal',
  templateUrl: './team-player-invite-modal.component.html',
  styleUrls: ['./team-player-invite-modal.component.scss'],
  exportAs: 'modal'
})
export class TeamPlayerInviteModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') public modal: ModalDirective;
  inviteForm: FormGroup;
  currentTeamId: number;
  teams: RCSeasonTeam[];
  currentTeams$: Subscription;
  loading: boolean;
  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private teamsService: TeamsService,
    private leaguesService: LeaguesService
  ) {

  }

  ngOnInit() {
    this.inviteForm = this.fb.group({
      firstName: '',
      lastName: '',
      asCaptain: false,
      phoneNumber: [''],
      email: ['', Validators.compose([  ])]
    });

    this.currentTeams$ = this.leaguesService.currentTeams$.subscribe((teams) => {
      this.teams = teams;
    });
  }

  ngOnDestroy() {
    this.currentTeams$.unsubscribe();
  }

  showModal(teamId: number) {
    if (!teamId) throw new Error('Must specify team id when opening modal');

    this.currentTeamId = teamId;

    this.modal.show();
  }

  submit(formData) {
    if (!this.inviteForm.valid || this.loading) return;

    if (!formData.email && !formData.phoneNumber) return this.toastr.warning('Please provide email or phoneNumber');

    const invites: RCInviteeObject[] = [{
      source: 'phone',
      data: {
        isCaptain: formData.asCaptain
      },
      name: (formData.firstName || formData.lastName) ? `${formData.firstName || ''} ${formData.lastName || ''}` : null,
      emails: formData.email ? [formData.email] : null,
      phoneNumbers: formData.phoneNumber ? [formData.phoneNumber] : null
    } as any];

    this.loading = true;

    this.teamsService
      .sendTeamInvite(this.currentTeamId, invites)
      .subscribe((response) => {
        if (response.data && response.data[0]) {
          this.addInviteeToTeam(response.data);
        } else {
          this.toastr.info('User already have an invite to this team. Invite was resent.');
        }

        this.inviteForm.reset();
        this.modal.hide();
        this.loading = false;
      }, () => {
        this.loading = false;
        this.toastr.error('Please check you provided correct information');
      });
  }

  /**
   * After the user has been invite we want to update the UI
   * with the newly created invitation received from the server.
   * @param invitees
   */
  addInviteeToTeam(invitees: RCUserInvite[]) {
    if (!this.teams || !this.teams.length) return;

    this.teams.forEach((seasonTeam) => {
      // we want to update only the currently select team
      if (seasonTeam.team && seasonTeam.team.id === this.currentTeamId) {

        seasonTeam.userInvites = seasonTeam.userInvites.concat(invitees);
      }
    });

    // we want to notify the other components about the changes made to the teams
    // after event is broadcasted they will recalculate the relevant ViewModels
    this.leaguesService.setCurrentTeams(this.teams);
  }
}
