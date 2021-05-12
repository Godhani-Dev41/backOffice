import { take } from "rxjs/operators";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { PackageCreatorModalComponent } from "@app/client/pages/venues/components/package-creator-modal/package-creator-modal.component";
import { RCVenue } from "@rcenter/core";

@Component({
  selector: "rc-venue-page-addons",
  templateUrl: "./venue-page-addons.component.html",
  styleUrls: ["./venue-page-addons.component.scss"],
})
export class VenuePageAddonsComponent implements OnInit {
  venue: RCVenue;
  spaces: any[];
  loading = false;
  addons: any[];
  @ViewChild("packageCreatorModal", { static: false }) packageCreatorModal: PackageCreatorModalComponent;
  constructor(private authService: AuthenticationService, private venuesService: VenuesService) {}

  ngOnInit() {
    this.loading = true;

    this.venuesService.currentVenue.subscribe((venue) => {
      this.venue = venue;

      if (venue) {
        this.venuesService.getVenueSpaces(this.venue.id).subscribe((spacesResponse) => {
          this.spaces = spacesResponse.data;

          this.loadAddons();
        });
      }
    });
  }

  loadAddons() {
    this.authService.currentOrganization
      .pipe(take(1))
      .toPromise()
      .then((organization) => {
        this.venuesService
          .getAddons(organization.id, this.venue.id)
          .toPromise()
          .then((response) => {
            this.addons = response.data;
            this.loading = false;
          });
      });
  }
}
