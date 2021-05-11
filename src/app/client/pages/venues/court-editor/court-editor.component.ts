import { forkJoin } from "rxjs";
import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { RCOrganization, RCVenue, RCAmenitiesEnum } from "@rcenter/core";
import { RCSportItem } from "@app/shared/services/utils/sports.service";
import { ToastrService } from "ngx-toastr";
import { FileItem } from "ng2-file-upload";

@Component({
  selector: "rc-court-editor",
  templateUrl: "./court-editor.component.html",
  styleUrls: ["./court-editor.component.scss"],
})
export class CourtEditorComponent implements OnInit {
  loading: boolean = true;
  courtForm: FormGroup;
  updateMode = false;
  venue: RCVenue;
  organization: RCOrganization;
  venueId: number;
  court: any;
  courtEditingId: number;
  amenitiesList: any[] = [];
  isCopy: boolean;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private venuesService: VenuesService,
    private authService: AuthenticationService,
    private leaguesService: LeaguesService,
    private fb: FormBuilder,
  ) {
    for (const val in RCAmenitiesEnum) {
      if (typeof RCAmenitiesEnum[val] !== "string") this.amenitiesList.push(val);
    }
  }

  ngOnInit() {
    this.venueId = this.activeRoute.snapshot.params["venueId"];
    this.courtEditingId = this.activeRoute.snapshot.params["courtId"];
    this.isCopy = this.activeRoute.snapshot.params["isCopy"] === "true";
    if (this.courtEditingId && !this.isCopy) this.updateMode = true;

    this.venuesService.getVenueById(this.venueId).subscribe((response) => {
      this.venue = response.data;

      if (!this.courtEditingId) {
        if (this.venue.sports.length) {
          this.court = {
            sports: this.venue.sports,
          };

          this.courtForm.get("sports").setValue(this.venue.sports);
        }

        if (this.venue.openingTimes && !this.courtEditingId) {
          this.preloadActivityTimes(this.venue.openingTimes);
        }
        this.loading = false;
      } else {
        this.venuesService.getSpaceById(this.venue.id, this.courtEditingId).subscribe((spaceResponse) => {
          this.editCourtLoading(spaceResponse.data);
        });
      }
    });

    this.authService.currentOrganization.subscribe((organization) => {
      this.organization = organization;
    });

    this.courtForm = this.fb.group({
      name: ["", Validators.required],
      ordinal: 0,
      longDescription: "",
      description: "",
      indoorOutdoor: "indoor",
      spaceType: "court",
      surface: "hardwood",
      customSpaceName: "",
      customSurfaceName: "",
      width: "",
      length: "",
      mainImage: "",
      sports: [[]],
      amenities: this.fb.group({}),
      activityTimes: this.fb.array([]),
    });

    for (const singleType of this.amenitiesList) {
      (this.courtForm.get("amenities") as any).addControl(singleType, this.fb.control(""));
    }
  }

  get activitiesArray(): FormArray {
    return this.courtForm.get("activityTimes") as FormArray;
  }

  activityDatesArray(form) {
    return form.get("activityDates") as FormArray;
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

      (this.courtForm.get("activityTimes") as FormArray).push(itemGroup);
    });

    this.courtForm.get("activityTimes").patchValue(activityTimes);
  }

  editCourtLoading(court) {
    this.court = court;
    this.courtForm.patchValue({
      name: court.name,
      ordinal: court.ordinal,
      longDescription: court.longDescription,
      description: court.description,
      sports: court.sports,
      surface: court.surface,
      customSpaceName: court.spaceType,
      customSurfaceName: court.surface,
      width: court.width,
      length: court.length,
      spaceType: court.spaceType || "court",
    });

    if (
      ["grass", "turf", "fieldTurf", "astroTurf", "hardwood", "asphalt", "sand", "ice", "sportCourt"].indexOf(
        court.surface,
      ) === -1
    ) {
      this.courtForm.get("surface").setValue("custom");
    }

    if (court["properties"][0] === "indoor") {
      this.courtForm.get("indoorOutdoor").setValue("indoor");
    }

    if (court["properties"][0] === "outdoor") {
      this.courtForm.get("indoorOutdoor").setValue("outdoor");
    }

    if (court.amenities) {
      for (const item of court.amenities) {
        const name = RCAmenitiesEnum[item];
        const control = this.courtForm.get("amenities").get(name);
        if (control) control.setValue(true);
      }
    }

    this.preloadActivityTimes(court.activityTimes);
    this.loading = false;
  }

  submitData(data) {
    const court = {
      name: data.name,
      ordinal: data.ordinal,
      longDescription: data.longDescription,
      description: data.description,
      sports: data.sports,
      surface: data.surface === "custom" ? data.customSurfaceName : data.surface,
      spaceType: data.spaceType === "custom" ? data.customSpaceName : data.spaceType,
      activityTimes: this.parseActivityTimes(data.activityTimes[0].activityDates),
      width: data.width,
      length: data.length,
      properties: [data.indoorOutdoor],
      amenities: [],
      mainMediaId: null,
    };

    for (const item in data.amenities) {
      if (data.amenities.hasOwnProperty(item)) {
        if (data.amenities[item]) court.amenities.push(RCAmenitiesEnum[item]);
      }
    }

    if (!data.sports) return this.toastr.error("At least one sport must be selected");
    if (!court.activityTimes.length) return this.toastr.error("Activity times must be specified");

    if (this.updateMode) {
      return this.updateCourt(court, data.mainImage);
    }

    this.loading = true;

    if (this.isCopy && this.court.mainMediaId) {
      court.mainMediaId = this.court.mainMediaId;
    }

    this.venuesService.createSpace(this.venueId, court).subscribe(
      (response) => {
        this.court = response.data;
        this.updateImages(data.mainImage);
      },
      (err) => {
        console.error(err);
        alert("Error while creating space");
        this.loading = false;
      },
    );
  }

  updateCourt(court, image) {
    this.loading = true;

    this.venuesService.updateSpace(this.venueId, this.courtEditingId, court).subscribe(
      () => {
        this.updateImages(image);
      },
      (err) => {
        console.error(err);
        alert("Error while creating space");
        this.loading = false;
      },
    );
  }

  updateImages(image: FileItem) {
    const tasks = [];
    if (image) {
      tasks.push(this.venuesService.uploadCourtMedia(image, this.court, this.venue));
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

  finishSubmit(err?: string) {
    if (err) return;

    this.venuesService.getVenueById(this.venueId).subscribe(
      (response) => {
        this.venuesService.currentVenue.next(response["data"]);
        this.router.navigate(["/client/facilities/venue/" + this.venueId + "/details"]);
        this.loading = false;
      },
      () => {
        this.loading = false;
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

  sportsChanged(sports: RCSportItem[]) {
    this.courtForm.patchValue({
      sports: sports.map((i) => i.id),
    });
  }

  addTimeSlot(form) {
    // Should be an output call to container item instead of here.
    this.activityDatesArray(form).push(this.leaguesService.getActivityDateFormControl());
  }

  imageChanged(file) {
    this.courtForm.patchValue({
      mainImage: file,
    });
  }

  descInputChanged(newDesc) {
    this.courtForm.get("longDescription").setValue(newDesc);
  }

  descInputLengthChanged(newLength) {}

  shortDescInputChanged(newDesc) {
    this.courtForm.get("description").setValue(newDesc);
  }

  shortDescInputLengthChanged(newLength) {}
}
