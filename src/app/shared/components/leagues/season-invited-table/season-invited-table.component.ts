import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  RCSeasonTeamMembersVM
} from '@app/client/pages/leagues/league-page/league-page-season/season-teams-page/season-teams-page.component';
import { RCInviteeObject } from '@app/shared/services/teams/teams.service';
import { InvitationService } from '@app/shared/services/utils/invitation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'rc-season-invited-table',
  templateUrl: './season-invited-table.component.html',
  styleUrls: ['./season-invited-table.component.scss']
})
export class SeasonInvitedTableComponent implements OnInit {
  @Input() invitedList: RCSeasonTeamMembersVM[];
  @Output() onPlayerCardResendInvite = new EventEmitter<RCInviteeObject>();
  @Output() onSendMultipleInvites = new EventEmitter();
  @Output() onRemoveInvite = new EventEmitter<number>();
  showSendAllInvitesBtn: boolean;
  constructor(
    private toastr: ToastrService,
    private inviteService: InvitationService
  ) { }

  ngOnInit() {
  }

  /**
   * When a checkbox of invitee item is clicked
   * we want to toggle the showing button of send all vs send selected
   * @param $event
   */
  inviteeSelected($event) {
    let selectedCount = this.invitedList.reduce((h, i) => {
      if (i.selected) h++;

      return h;
    }, 0);

    selectedCount = ($event.target.checked) ? ++selectedCount : --selectedCount;

    this.showSendAllInvitesBtn = !selectedCount;
  }

  removeInvite(inviteId: number) {
    this.inviteService.removeInvite(inviteId).subscribe(() => {
      this.onRemoveInvite.emit(inviteId);
      this.toastr.success('Invite Canceled');
      this.invitedList = this.invitedList.filter(i => i.id !== inviteId);
    }, () => {
      this.toastr.error('Error while canceling the invite');
    });
  }
}
