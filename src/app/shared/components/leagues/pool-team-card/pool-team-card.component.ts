import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RCTeam, RCTeamMember } from '@rcenter/core';

@Component({
  selector: 'rc-pool-team-card',
  templateUrl: './pool-team-card.component.html',
  styleUrls: ['./pool-team-card.component.scss']
})
export class PoolTeamCardComponent implements OnInit {
  @Input() team: RCTeam;
  @Input() restoreToPoolMode: boolean;
  @Output() onRestoreClicked = new EventEmitter();
  @Output() onAssignedClicked = new EventEmitter();
  visibleMembers: RCTeamMember[];
  moreCount: number;
  loading: boolean;

  constructor() { }

  ngOnInit() {
    if (this.team && this.team.teamMembers) {
      const members = this.team.teamMembers.filter((i) => i.status === 2);
      this.visibleMembers = members.slice(0, 4);

      this.moreCount = (members.length - this.visibleMembers.length);
      if (this.moreCount < 0) this.moreCount = 0;
    }
  }

  assignTeam() {
    if (this.loading) return;

    this.loading = true;
    this.onAssignedClicked.emit(this.team.id);
  }

  restoreTeam() {
    if (this.loading) return;

    this.loading = true;
    this.onRestoreClicked.emit(this.team.id);
  }
}
