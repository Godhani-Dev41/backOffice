import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { RCVenue } from '@rcenter/core';

@Component({
  selector: 'rc-venues-page',
  templateUrl: './venues-page.component.html',
  styleUrls: ['./venues-page.component.scss']
})
export class VenuesPageComponent implements OnInit {
  loading = true;
  venues: RCVenue[];
  constructor(
    private authService: AuthenticationService,
    private venuesService: VenuesService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.authService.currentOrganization.subscribe((org) => {
      this.venuesService.getOrganizationVenues(org.id).subscribe((response) => {
        this.venues = response.data;
        this.loading = false;
      });
    });
  }
}
