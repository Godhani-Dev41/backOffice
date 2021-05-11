import React from "react";
import ReactDOM from "react-dom";
import { RCOrganization } from '@rcenter/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
  Output,
  Input,
  EventEmitter,
} from "@angular/core";
import { ChargingModalExample, ISelectedPaymentDetail} from "@app/react/Example/ChargeExample";

@Component({
  selector: 'get-payment-v2',
  template: `<div #reactRoot></div>`,
  encapsulation: ViewEncapsulation.Emulated,
})
export class GetPaymentV2Component implements  OnChanges, OnDestroy, AfterViewInit {
  @ViewChild("reactRoot") containerRef: ElementRef;

  @Input() totalAmount: number;
  @Input() userId: number;
  
;
  @Output() onPaymentCollected = new EventEmitter<ISelectedPaymentDetail>();
  @Output() onModalShowingChange = new EventEmitter<boolean>();

  organization: RCOrganization;

  constructor(
    private authService: AuthenticationService,
  ) {
    this.organization = this.authService.currentOrganization.value;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render(this.organization);
  }

  ngAfterViewInit() {
    this.render(this.organization);
  }

  ngOnDestroy() {
    ReactDOM.unmountComponentAtNode(this.containerRef.nativeElement);
  }

  private render(organization: RCOrganization) {
    if (!this.containerRef) return;

    ReactDOM.render(
      React.createElement(ChargingModalExample, { 
              organizationId: organization.id, totalAmount: this.totalAmount , userId: this.userId,
              handleCharge: (val: ISelectedPaymentDetail) => this.onPaymentCollected.emit(val),
              onModalShowingChange: (isShowing: boolean) => this.onModalShowingChange.emit(isShowing)
      }),
      this.containerRef.nativeElement,
    );
  }
}
