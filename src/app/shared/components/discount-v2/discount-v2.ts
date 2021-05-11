import React from "react";
import ReactDOM from "react-dom";
import { RCOrganization } from "@rcenter/core";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
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
import { EntitlementDiscounts } from "app/react/components/shared/EntitlementDiscounts/EntitlementDiscounts";

export interface Entitlements {
  groupId: number;
  price: number;
}

@Component({
  selector: "discount-v2",
  template: `<div #reactRoot></div>`,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DiscountV2Component implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild("reactRoot") containerRef: ElementRef;
  @Input() totalAmount: number;
  @Output() onSave = new EventEmitter<Entitlements[]>();
  @Output() onClose = new EventEmitter<boolean>();

  organization: RCOrganization;

  constructor(private authService: AuthenticationService) {
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
      React.createElement(EntitlementDiscounts, {
        organizationId: organization.id,
        totalAmount: this.totalAmount,
        onSave: (v) => {
          this.onSave.emit(v);
        },
        onCancel: () => {
          this.onClose.emit();
        },
      }),
      this.containerRef.nativeElement,
    );
  }
}
