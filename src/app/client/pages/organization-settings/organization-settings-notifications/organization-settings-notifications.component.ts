import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "rxjs";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { ToastrService } from "ngx-toastr";
import { RCOrganization, RCVenue } from "@rcenter/core";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";

interface NotificationsForms {
  notificationSettings: {
    email: string;
    notificationType: string;
    venueId: string;
    id: number;
  }[];
}

@Component({
  selector: "rc-organization-settings-notifications",
  templateUrl: "./organization-settings-notifications.component.html",
  styleUrls: ["./organization-settings-notifications.component.scss"],
})
export class OrganizationSettingsNotificationsComponent implements OnInit {
  notificationsForm: FormGroup;
  destroy$ = new Subject<true>();
  organization: RCOrganization;
  loading: boolean;
  initialLoading: boolean = true;
  venues: RCVenue[] = [];
  toRemove = [];
  constructor(
    private organizationsService: OrganizationsService,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private venuesService: VenuesService,
  ) {
    this.notificationsForm = this.fb.group({
      notificationSettings: this.fb.array([
        this.fb.group({
          email: ["", Validators.compose([Validators.email, Validators.required])],
          notificationType: ["", Validators.required],
          venueId: [null, Validators.required],
          id: [null],
        }),
      ]),
    });
  }

  ngOnInit() {
    this.organization = this.authService.currentOrganization.getValue();
    this.venuesService.getOrganizationVenues(this.organization.id).subscribe((venues) => {
      if (venues.data && venues.data.length > 0) this.venues = [...venues.data];
    });
    this.organizationsService.getOrganizationNotificationsSubscriptions(this.organization.id).subscribe(
      (response: any) => {
        if (response.data && response.data.length) {
          this.clearArray();

          response.data.forEach((item) => {
            (this.notificationsForm.get("notificationSettings") as FormArray).push(
              this.fb.group({
                email: [item.email, Validators.required],
                notificationType: [item.notificationType, Validators.required],
                venueId: [item.resourceId, Validators.required],
                id: [item.id],
              }),
            );
          });
        }
        this.initialLoading = false;
      },
      (err) => {
        console.error("notification setting error", err);
        this.initialLoading = false;
      },
    );
  }

  submit(data: NotificationsForms) {
    const updateData = {
      subscriptions: [],
    };

    data.notificationSettings.forEach((item) => {
      updateData.subscriptions.push({
        resourceType: "venue",
        resourceId: item.venueId,
        notificationType: item.notificationType,
        email: item.email,
        id: item.id,
      });
    });

    this.toRemove.forEach((item) => {
      updateData.subscriptions.push({
        resourceType: "venue",
        resourceId: item.venueId,
        notificationType: item.notificationType,
        email: item.email,
        id: item.id,
        toRemove: true,
      });
    });

    this.loading = true;
    this.organizationsService.updateOrganizationNotificationsSubscriptions(this.organization.id, updateData).subscribe(
      () => {
        this.toastr.success("Memberships successfully added");
        this.loading = false;

        this.ngOnInit();
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while creating membership");
      },
    );
  }

  addSetting() {
    (this.notificationsForm.get("notificationSettings") as FormArray).push(
      this.fb.group({
        email: ["", Validators.required],
        notificationType: ["", Validators.required],
        venueId: [null, Validators.required],
      }),
    );
  }

  removeRow(index: number) {
    const itemAt = (this.notificationsForm.get("notificationSettings") as FormArray).at(index);
    if (itemAt.value.id) {
      this.toRemove.push(itemAt.value);
    }
    (this.notificationsForm.get("notificationSettings") as FormArray).removeAt(index);
  }

  clearArray() {
    const control = <FormArray>this.notificationsForm.controls["notificationSettings"];

    for (let i = control.length - 1; i >= 0; i--) {
      control.removeAt(i);
    }
  }
}
