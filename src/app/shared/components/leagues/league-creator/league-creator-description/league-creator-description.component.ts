import { RCQuestionnaireObject } from "@rcenter/core";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { RCOrganization, RCLeagueBookingStateEnum, RCLinkedAccountStatus } from "@rcenter/core";

declare var tinymce: any;
@Component({
  selector: "rc-league-creator-description",
  templateUrl: "./league-creator-description.component.html",
  styleUrls: ["./league-creator-description.component.scss"],
})
export class LeagueCreatorDescriptionComponent implements OnInit {
  @Input() groupName: string;
  @Input() form: FormGroup;
  @Input() organization: RCOrganization;
  @Input() orgQuestionnaires: RCQuestionnaireObject[];
  RCLeagueBookingStateEnum = RCLeagueBookingStateEnum;
  RCLinkedAccountStatus = RCLinkedAccountStatus;

  constructor() {}

  ngOnInit() {}

  descInputChanged(newDesc) {
    this.form.get(this.groupName).get("description").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {
    this.form.get(this.groupName).get("description_length").setValue(newLength);
  }

  descShortInputChanged(newDesc) {
    this.form.get(this.groupName).get("shortDescription").setValue(newDesc);
  }

  descShortInputLengthChanged(newLength) {
    this.form.get(this.groupName).get("shortDescription_length").setValue(newLength);
  }
}
