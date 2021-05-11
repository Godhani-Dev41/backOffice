import { Component, Input, OnInit } from "@angular/core";

export interface Membership {
  id: number;
  name: string;
  price: number;
  active: boolean;
}

@Component({
  selector: "rc-membership-prices",
  templateUrl: "./membership-prices.component.html",
  styleUrls: ["./membership-prices.component.scss"],
})
export class MembershipPricesComponent implements OnInit {
  @Input() labelString: string;
  @Input() subLabelString: string;
  @Input() memberships?: Membership[] = [];

  addPrice: boolean = false;
  blankMembership: Membership;
  tempMembership: Membership;

  constructor() {
    this.blankMembership = {
      id: this.memberships.length + 1,
      name: "",
      price: 400,
      active: true,
    };
  }

  ngOnInit() {
    this.clearTempMembership();
  }

  addPriceBtn = () => {
    this.addPrice = true;
  };

  savePriceBtn = () => {
    this.memberships.push(this.tempMembership);
    this.addPrice = false;
    this.clearTempMembership();
  };

  cancelMembershipBtn = () => {
    this.addPrice = false;
    this.clearTempMembership();
  };

  clearTempMembership = () => {
    this.tempMembership = { ...this.blankMembership };
    this.tempMembership.name = "";
  };
}
