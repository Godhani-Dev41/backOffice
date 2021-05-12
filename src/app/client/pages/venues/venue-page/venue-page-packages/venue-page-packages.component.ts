
import {take} from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PackageCreatorModalComponent } from '@app/client/pages/venues/components/package-creator-modal/package-creator-modal.component';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { RCVenue } from '@rcenter/core';

@Component({
  selector: 'rc-venue-page-packages',
  templateUrl: './venue-page-packages.component.html',
  styleUrls: ['./venue-page-packages.component.scss']
})
export class VenuePagePackagesComponent implements OnInit {
  venue: RCVenue;
  spaces: any[];
  loading = false;
  packages: any[];
  @ViewChild('packageCreatorModal', { static: false }) packageCreatorModal: PackageCreatorModalComponent;
  constructor(
    private authService: AuthenticationService,
    private venuesService: VenuesService
  ) {

  }

  ngOnInit() {
    this.venuesService.currentVenue.subscribe((venue) => {
      this.venue = venue;

      if (venue) {
        this.venuesService.getVenueSpaces(this.venue.id).subscribe((spacesResponse) => {
          this.spaces = spacesResponse.data;

          this.loadPackages();
        });
      }
    });
  }

  async loadPackages() {
    this.loading = true;
    const organization = await this.authService.currentOrganization.pipe(take(1)).toPromise();
    const response = await this.venuesService.getPackages(organization.id, this.venue.id).toPromise();

    this.packages = response.data;
    this.loading = false;
  }
}
