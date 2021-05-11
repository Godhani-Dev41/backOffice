import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { RCVenue } from '@rcenter/core';

@Component({
  selector: 'rc-venue-page',
  templateUrl: './venue-page.component.html',
  styleUrls: ['./venue-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VenuePageComponent implements OnInit {
  venue: RCVenue;
  constructor(
    private activeRoute: ActivatedRoute,
    private venuesService: VenuesService
  ) { }

  ngOnInit() {
    const venueId = this.activeRoute.snapshot.params['venueId'];
    this.venuesService.getVenueById(venueId).subscribe((response) => {
      this.venue = response.data;

      this.venuesService.currentVenue.next(this.venue);
    });
  }

}
