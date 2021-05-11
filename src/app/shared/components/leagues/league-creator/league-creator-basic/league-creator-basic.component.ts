import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { RCParsedAddress } from "@app/shared/services/utils/location.service";
import { RCLeague, RCMembership } from "@rcenter/core";
import { TimeService } from "@app/shared/services/utils/time.service";

@Component({
  selector: "rc-league-creator-basic",
  templateUrl: "./league-creator-basic.component.html",
  styleUrls: ["./league-creator-basic.component.scss"],
})
export class LeagueCreatorBasicComponent implements OnInit {
  @Input() groupName: string;
  @Input() form: FormGroup;
  @Input() league: RCLeague;
  @Input() GlCodes: any[];
  @Input() memberships: RCMembership[];

  constructor(private timeService: TimeService) {}

  ngOnInit() {}

  venueSelected(venue: RCParsedAddress) {
    if (venue.timezone) {
      this.form.get(this.groupName).get("timezone").setValue(venue.timezone);
    }

    this.form.get(this.groupName).get("address").setValue(venue);
  }

  mainImageAdded(file) {
    this.form.get(this.groupName).get("mainImage").setValue(file);
  }

  onMembershipChange() {}
}
