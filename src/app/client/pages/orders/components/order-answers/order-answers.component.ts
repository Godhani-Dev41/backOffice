import { RCQuestionTypesEnum } from '@rcenter/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '@app/shared/services/orders/orders.service';
import { SportsService } from '@app/shared/services/utils/sports.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import * as moment from 'moment';

@Component({
  selector: 'rc-order-answers-component',
  templateUrl: './order-answers.component.html',
  styleUrls: ['./order-answers.component.scss']
})
export class OrderAnswersComponent implements OnInit {
  organization: any;
  order: any;
  answers = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private ordersService: OrdersService,
    private sportsService: SportsService,
    private authService: AuthenticationService
  ) {

  }

  ngOnInit(): void {
    const organization = this.authService.currentOrganization.getValue();
    this.organization = organization;

    this.ordersService.currentOrder$.subscribe((order) => {
      if (!order) return;

      this.ordersService.getOrderAnswers(organization.id, order.orderId).subscribe((response) => {
        this.order = response.data;
        if (this.order && this.order.answers && this.order.answers.length) this.answers = this.order.answers;
      });
    });
  }

    normalizeAnswer(answerValue: any, questionType: RCQuestionTypesEnum) {
    if (!answerValue || !questionType) return "";
    if (questionType === RCQuestionTypesEnum.BIRTH_DATE) {
      if (!answerValue && !answerValue.value) {
        return "";
      } else if (!answerValue.value) {
        return moment(answerValue).format("MM-DD-YYYY")
      } else {
        return moment(answerValue.value).format("MM-DD-YYYY");
      }
    } else if (questionType === RCQuestionTypesEnum.ADDRESS) {
      if (answerValue.city || answerValue.country || answerValue.street) {
        return `${answerValue.street || ""} ${answerValue.city + "," || ""} ${
          answerValue.country || ""
        }`;
      } else if (answerValue.value.city || answerValue.value.country || answerValue.value.street) {
        return `${answerValue.value.street || ""} ${answerValue.value.city + "," || ""} ${
          answerValue.value.country || ""
        }`;
      }
    }
    if (answerValue === true || answerValue.value === true) return "Yes";
    if (answerValue === false || answerValue.value === false) return "No";
    if (answerValue.value) return answerValue.value;
    if (answerValue) return answerValue;
    if (Array.isArray(answerValue)) return answerValue.toString();

    return "No Answer";
  }
}
