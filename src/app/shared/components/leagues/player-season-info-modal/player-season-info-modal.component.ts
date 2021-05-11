import { ProgramsService } from "@app/shared/services/programs/programs.service";
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from "@angular/core";
import { ModalDirective } from "ngx-bootstrap";
import {
  LeaguesService,
  SeasonPlayerPaymentMethod,
  SeasonPlayerResponseObject,
} from "@app/shared/services/leagues/leagues.service";
import {
  RCLeagueSeason,
  RCSeasonPoolStatusEnum,
  RCSeasonTeam,
  RCGenderEnum,
  RCUser,
  RCPaymentStatus,
  RCQuestionTypesEnum,
  RCEvent,
  RCEventAttendee,
} from "@rcenter/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { EventsService } from "@app/shared/services/events/events.service";
import { NzModalService } from "ng-zorro-antd";

@Component({
  selector: "rc-player-season-info-modal",
  templateUrl: "./player-season-info-modal.component.html",
  styleUrls: ["./player-season-info-modal.component.scss"],
  exportAs: "modal",
})
export class PlayerSeasonInfoModalComponent implements OnInit {
  @Input() season?: RCLeagueSeason;
  @Input() event?: RCEvent;
  @Input() isProgramSeason?: boolean;
  @Output() onChange? = new EventEmitter();
  @Output() onPlayerRejectClick? = new EventEmitter<any>();
  @Output() onPlayerRestoreClick? = new EventEmitter<any>();
  @ViewChild("modal") public modal: ModalDirective;
  user: RCUser;
  userAnswers: any;
  data: SeasonPlayerResponseObject;
  eventData: RCEventAttendee;
  hasPaid: boolean;
  loading: boolean;
  paymentSettled = false;
  formDirty = false;
  RCPaymentStatus = RCPaymentStatus;
  seasonTeam: RCSeasonTeam;
  RCSeasonPoolStatusEnum = RCSeasonPoolStatusEnum;
  openChargeRemaining = false;
  amountToCharge: number;
  amountRemaining: number;
  orderId: number;
  // the actual user who paid for the order
  payingUserId: number;

  showDepositError: boolean = false;
  constructor(
    private toastr: ToastrService,
    private leaguesService: LeaguesService,
    private eventService: EventsService,
    private programsService: ProgramsService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {}

  showModal(userId: number, seasonTeam?: RCSeasonTeam, orderId?: number, remainingAmount?: number) {
    if (!userId) return this.toastr.warning("No info found to display. Player is not registered.");

    this.seasonTeam = seasonTeam;
    this.loading = true;
    this.user = null;
    this.data = null;

    if (this.season) {
      if (!this.isProgramSeason) {
        this.leaguesService.getSeasonPlayer(this.season.leagueId, this.season.id, userId).subscribe(
          (response) => {
            this.user = response.data.user;
            this.data = response.data;
            this.orderId = orderId;
            this.amountRemaining = remainingAmount;
            this.payingUserId = this.user.id;
            this.loading = false;

            if (this.data.paymentStatus === RCPaymentStatus.ACCEPTED) {
              this.paymentSettled = !Boolean(this.amountRemaining > 0);
            }

            /* if (this.data.paymentStatus === RCPaymentStatus.ACCEPTED) {
              this.paymentSettled = true;
            }*/
          },
          () => {
            this.loading = false;
          },
        );
      } else {
        this.programsService.getRegisteredUserInfo(userId).subscribe(
          (response) => {
            this.user = response.data.user;
            this.data = response.data;
            const order = response.data.order;
            this.amountRemaining = order.price - (order.paidAmount ? order.paidAmount : 0);
            this.orderId = order.id;
            this.payingUserId = order.payingUserId;

            /*
            other interesting stuff on order:
            "paymentMethodId": "pm_1I6IIUEFbijCyGAacnliPzN2",
            "paymentType": "card",
            */

            this.loading = false;

            if (this.data.paymentStatus === RCPaymentStatus.ACCEPTED) {
              this.paymentSettled = true;
            }
          },
          () => {
            this.loading = false;
          },
        );
      }
    } else if (this.event) {
      this.eventData = this.event.eventAttendees.filter((attendee) => attendee.attendeeId === userId)[0];

      this.user = this.eventData.user;
      this.hasPaid = this.eventData.hasPaid;

      this.eventService.getEventAnswersByUser(this.event.id, this.user.id).subscribe((res) => {
        this.userAnswers = res.data[0];
      });

      this.loading = false;
    }

    this.modal.show();
  }

  get userAge() {
    if (!this.user || !this.user.birthDate) return "Unknown";

    return moment().diff(this.user.birthDate, "year");
  }

  get userGender() {
    if (!this.user || !this.user.gender) return "Unknown";

    if (this.user.gender === RCGenderEnum.MALE) return "M";
    if (this.user.gender === RCGenderEnum.FEMALE) return "F";
    if (this.user.gender === RCGenderEnum.OTHER) return "O";
  }

  get paymentMethod() {
    if (!this.data || !this.data.paymentMethod) return "Unknown";

    if (
      this.data.paymentMethod === SeasonPlayerPaymentMethod.BRAINTREE ||
      this.data.paymentMethod === SeasonPlayerPaymentMethod.STRIPE
    ) {
      return "Online Payment";
    } else if (this.data.paymentMethod === SeasonPlayerPaymentMethod.CASH) {
      return "Cash";
    } else if (this.data.paymentMethod === SeasonPlayerPaymentMethod.PAYPALEMAIL) {
      return "Paypal";
    } else {
      return "Unknown";
    }
  }

  normalizeAnswer(answer: any, questionType: RCQuestionTypesEnum) {
    if (!answer) return "";
    if (questionType === RCQuestionTypesEnum.BIRTH_DATE) {
      if (!answer.value) return "";

      return moment(answer.value).format("MM-DD-YYYY");
    }

    if (answer.city || answer.country || answer.street) {
      return `${answer.street || ""} ${answer.city + "," || ""} ${answer.country || ""}`;
    } else if (answer.value.city || answer.value.country || answer.value.street) {
      return `${answer.value.street || ""} ${answer.value.city + "," || ""} ${answer.value.country || ""}`;
    }
    if (answer.value === true) return "Yes";
    if (answer.value === false) return "No";
    if (answer.value) return answer.value;
    if (Array.isArray(answer)) return answer.toString();

    return "No Answer";
  }

  settledStatusChanged(event) {
    this.formDirty = true;
  }

  saveForm() {
    if (!this.formDirty) return this.modal.hide();
    if (!this.data || !this.data.seasonPool) return this.toastr.error("No season pool found");
    this.loading = true;

    if (this.paymentSettled) {
      this.leaguesService.markPaymentAsSettled(this.season.leagueId, this.season.id, this.data.seasonPool.id).subscribe(
        () => {
          this.finishUpdate();
        },
        () => {
          this.loading = false;
          this.toastr.error("Error while settling the payment");
        },
      );
    } else {
      this.leaguesService
        .markPaymentAsUnSettled(this.season.leagueId, this.season.id, this.data.seasonPool.id)
        .subscribe(
          () => {
            this.finishUpdate();
          },
          () => {
            this.loading = false;
            this.toastr.error("Error while settling the payment");
          },
        );
    }
  }

  finishUpdate() {
    this.onChange.emit();
    this.modal.hide();
    this.loading = false;
    this.toastr.success("Successfully updated");
  }

  openChargeDialog() {
    this.openChargeRemaining = true;
  }

  closeChargeDialog() {
    this.amountToCharge = null;
    this.showDepositError = false;
    this.openChargeRemaining = false;
  }

  submitRemainCharge() {
    if (!this.amountToCharge || this.amountToCharge <= 0 || this.amountToCharge > this.amountRemaining) {
      this.showDepositError = true;
      return;
    }

    this.loading = true;

    this.openChargeRemaining = false;
    const orgId = this.programsService.getOrgId();
    this.programsService
      .payPartialBalance(this.payingUserId, this.orderId, this.amountToCharge, orgId)
      .subscribe(() => {
        // reload data
        this.showModal(this.user.id, this.seasonTeam);
      });
  }
}
