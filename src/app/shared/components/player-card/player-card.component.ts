import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RCGenderEnum, RCPaymentStatus, RCMediaObject, RCSeasonTeam } from "@rcenter/core";

interface RCSeasonTeamMembersVM {
  notRegistered?: boolean;
  paymentStatus?: RCPaymentStatus;
  canUnassign?: boolean;
  id?: number;
  type: "invite" | "member" | "poolMember";
  firstName: string;
  lastName?: string;
  gender?: RCGenderEnum;
  email?: string;
  phone?: string;
  picture?: RCMediaObject;
  token?: string;
  captain?: boolean;
  userId?: number;
  isRegistered: boolean;
  invitedUserId?: number;
  isInviteResent?: boolean;
  selected?: boolean;
  inviteStatus?: number;
}

@Component({
  selector: "rc-player-card",
  templateUrl: "./player-card.component.html",
  styleUrls: ["./player-card.component.scss"],
})
export class PlayerCardComponent implements OnInit {
  @Input() player: any;
  @Input() draggable: boolean;
  @Input() team: RCSeasonTeam;
  @Input() hideTopControls = false;
  @Output() onInviteSend: EventEmitter<RCSeasonTeamMembersVM> = new EventEmitter<RCSeasonTeamMembersVM>();
  @Output() onTransferTeamClick = new EventEmitter<{ player: RCSeasonTeamMembersVM }>();
  @Output() onTeamCaptainAssignClick = new EventEmitter<{ player: RCSeasonTeamMembersVM }>();
  @Output() onMemberUnassign = new EventEmitter<{ player: RCSeasonTeamMembersVM }>();
  @Output() onMoreDetailsClick = new EventEmitter();
  RCPaymentStatus = RCPaymentStatus;
  constructor() {}

  ngOnInit() {}

  getMemberGender(gender: RCGenderEnum): string {
    switch (gender) {
      case RCGenderEnum.MALE:
        return "male";
      case RCGenderEnum.FEMALE:
        return "female";
      case RCGenderEnum.OTHER:
        return "other";
    }
  }

  sendInvite() {
    if (this.player.isInviteResent) return;

    this.onInviteSend.emit(this.player);
    this.onInviteSend.subscribe(() => {});
    this.player.isInviteResent = true;
  }

  get visibleCardHeader(): "invite" | "normal" | "draggable" {
    if (this.hideTopControls) return;

    if ((!this.player.isRegistered || this.player.inviteStatus === 1) && !this.draggable) {
      return "invite";
    } else if (this.player.isRegistered && this.player.inviteStatus !== 1 && !this.draggable) {
      return "normal";
    } else if (this.draggable) {
      return "draggable";
    } else {
      return;
    }
  }

  getPaymentTooltipText(status: RCPaymentStatus) {
    if (status === RCPaymentStatus.ACCEPTED) {
      return "Valid payment";
    } else if (status === RCPaymentStatus.PENDING) {
      return "Payment Pending";
    } else if (status === RCPaymentStatus.CANCELLED) {
      return "Payment Canceled";
    } else if (status === RCPaymentStatus.FRAUD) {
      return "Fraud payment method";
    } else if (status === RCPaymentStatus.REJECTED) {
      return "Rejected";
    } else if (status === RCPaymentStatus.NOT_RELEVANT) {
      return "Not Relevant";
    } else {
      return "";
    }
  }
}
