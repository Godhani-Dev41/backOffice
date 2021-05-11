import { forkJoin } from "rxjs";
import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSuccessModalComponent } from "@app/shared/components/action-success-modal/action-success-modal.component";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { RCParsedAddress } from "@app/shared/services/utils/location.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCAmenitiesEnum, RCOrganization, RCVenue } from "@rcenter/core";
import { ToastrService } from "ngx-toastr";
import { RCSportItem } from "@app/shared/services/utils/sports.service";
import { FileItem } from "ng2-file-upload";

export interface Venue extends RCVenue {
  shortDescription?: string;
}

@Component({
  selector: "rc-venue-creator",
  templateUrl: "./venue-creator.component.html",
  styleUrls: ["./venue-creator.component.scss"],
})
export class VenueCreatorComponent implements OnInit {
  venueForm: FormGroup;
  updateMode = false;
  loading = false;
  venue: Venue;
  organization: RCOrganization;
  editingVenueId: number;
  savedVenue: Venue;
  amenitiesList: any[] = [];
  description_length: number;
  shortDescription_length: number;
  @ViewChild("actionSuccessModal") actionSuccessModal: ActionSuccessModalComponent;
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private venuesService: VenuesService,
    private authService: AuthenticationService,
    private leaguesService: LeaguesService,
    private fb: FormBuilder,
  ) {
    this.loading = true;
    this.editingVenueId = this.activeRoute.snapshot.params["venueId"];

    this.authService.currentOrganization.subscribe((organization) => {
      this.organization = organization;
    });
    for (const val in RCAmenitiesEnum) {
      if (typeof RCAmenitiesEnum[val] !== "string") this.amenitiesList.push(val);
    }
    this.description_length = 0;
    this.venueForm = this.fb.group({
      name: "",
      description: "",
      shortDescription: "",
      sports: [[]],
      addressString: "",
      address: "",
      timezone: "",
      rules: "",
      info: "",
      amenities: this.fb.group({}),
      mainImage: "",
      activityTimes: this.fb.array([]),
    });

    for (const singleType of this.amenitiesList) {
      (this.venueForm.get("amenities") as any).addControl(singleType, this.fb.control(""));
    }
  }

  ngOnInit() {
    if (this.editingVenueId) {
      this.updateMode = true;
      this.venuesService.getVenueById(this.editingVenueId).subscribe((response) => {
        this.venue = response.data;
        this.loadVenueData(this.venue);
      });
    } else {
      this.loading = false;
      this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
    }
  }

  loadVenueData(venue: Venue) {
    this.venueForm.patchValue({
      name: venue.name,
      description: venue.description,
      shortDescription: venue.shortDescription,
      sports: venue.sports,
      rules: venue.rules,
      info: venue.info,
    });

    if (venue.address) {
      this.venueForm.patchValue({
        addressString: `${venue.address.street || ""} ${venue.address.city || ""}, ${venue.address.state || ""}`,
        address: venue.address,
      });
    }

    if (venue.amenities) {
      for (const item of venue.amenities) {
        const name = RCAmenitiesEnum[item];
        const control = this.venueForm.get("amenities").get(name);
        if (control) control.setValue(true);
      }
    }

    this.preloadActivityTimes(venue["openingTimes"]);
    this.loading = false;
  }

  get activitiesArray(): FormArray {
    return this.venueForm.get("activityTimes") as FormArray;
  }

  activityDatesArray(form) {
    return form.get("activityDates") as FormArray;
  }

  submitData(data) {
    const venue = {
      ...data,
      amenities: [],
      organizationId: this.organization.id,
      openingTimes: this.parseActivityTimes(data.activityTimes[0].activityDates),
    };

    delete venue.mainImage;
    delete venue.activityTimes;

    for (const item in data.amenities) {
      if (data.amenities.hasOwnProperty(item)) {
        if (data.amenities[item]) venue.amenities.push(RCAmenitiesEnum[item]);
      }
    }

    if (this.updateMode) {
      return this.updateVenue(data.mainImage, venue);
    }

    this.loading = true;

    this.venuesService.createVenue(venue).subscribe(
      (response) => {
        this.savedVenue = response.data;
        this.updateImages(data.mainImage, this.savedVenue);
      },
      () => {
        this.finishSubmit("Error while creating venue");
      },
    );
  }

  updateImages(media: FileItem, venueData) {
    const tasks = [];
    if (media) {
      tasks.push(this.venuesService.uploadVenueMedia(media, venueData));
    }

    if (!tasks.length) return this.finishSubmit();
    forkJoin(tasks).subscribe(
      () => {
        this.finishSubmit();
      },
      () => {
        this.finishSubmit("Error while uploading images");
      },
    );
  }

  updateVenue(media: FileItem, venueDataToUpdate) {
    this.loading = true;
    this.venuesService.updateVenue(this.editingVenueId, venueDataToUpdate).subscribe(
      (response) => {
        this.savedVenue = response.data;
        this.updateImages(media, this.savedVenue);
      },
      () => {
        this.loading = false;
        this.toastr.error("Error while updating venue");
      },
    );
  }

  parseActivityTimes(formActivities: any) {
    const activities = [];

    formActivities.forEach((date) => {
      const parsedDaysActivities = this.leaguesService.getActivityTimeObject(date);
      if (!parsedDaysActivities) return;

      parsedDaysActivities.forEach((i) => {
        if (!i || !i.dayOfWeek || !i.open || !i.close) return;
        activities.push(i);
      });
    });

    return activities;
  }

  goToCreateCourt() {
    this.router.navigate(["/client/facilities/venue-creator/" + this.savedVenue.id + "/court"]);
  }

  goToVenuePage() {
    this.router.navigate(["/client/facilities/venue/" + this.savedVenue.id]);
  }

  finishSubmit(error?: string) {
    this.loading = false;
    if (error) return;

    this.venueForm.reset();

    if (this.savedVenue) {
      this.actionSuccessModal.showModal();
    } else {
      this.router.navigate(["/client/facilities/venue/" + this.editingVenueId]);
    }
  }

  addTimeSlot(form) {
    // Should be an output call to container item instead of here.
    this.activityDatesArray(form).push(this.leaguesService.getActivityDateFormControl());
  }

  onAddressSelect(address: RCParsedAddress) {
    this.venueForm.patchValue({
      addressString: `${address.street || ""} ${address.city}, ${address.state}`,
      address,
    });
  }

  sportsChanged(sports: RCSportItem[]) {
    this.venueForm.patchValue({
      sports: sports.map((i) => i.id),
    });
  }

  imageChanged(file) {
    this.venueForm.patchValue({
      mainImage: file,
    });
  }

  timezoneChanged(timezone) {
    this.venueForm.get("timezone").setValue(timezone);
  }

  preloadActivityTimes(times) {
    const activityTimes = this.leaguesService.convertCourtWindowsToVM(times);

    if (!activityTimes.length) {
      this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
      return;
    }
    /**
     * Hack for supporting patching value of n length array
     * currently angular doesn't support this.
     * and we need to create the form groups beforehand
     */
    activityTimes.forEach((i) => {
      const itemGroup = this.leaguesService.getActivityTimeGroupObject();

      if (i.activityDates && i.activityDates.length > 1) {
        i.activityDates.forEach((date, dateIndex) => {
          // we want to skip the first item since it's already exist there
          if (dateIndex === 0) return;

          (itemGroup.get("activityDates") as FormArray).push(this.leaguesService.getActivityDateFormControl());
        });
      }

      (this.venueForm.get("activityTimes") as FormArray).push(itemGroup);
    });

    this.venueForm.get("activityTimes").patchValue(activityTimes);
  }

  descInputChanged(newDesc) {
    this.venueForm.get("description").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {
    this.description_length = newLength;
  }

  shortDescInputChanged(newDesc) {
    this.venueForm.get("shortDescription").setValue(newDesc);
  }

  shortDescInputLengthChanged(newLength) {
    this.shortDescription_length = newLength;
  }
}
