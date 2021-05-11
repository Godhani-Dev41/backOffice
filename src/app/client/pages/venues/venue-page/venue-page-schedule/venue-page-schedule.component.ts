import { Component, OnInit } from '@angular/core';
import { VenuesService } from '@app/shared/services/venues/venues.service';

@Component({
  selector: 'rc-venue-page-details',
  templateUrl: './venue-page-schedule.component.html',
  styleUrls: ['./venue-page-schedule.component.scss']
})
export class VenuePageScheduleComponent implements OnInit {
  venue: any;
  loading: any;
  constructor(
    private venuesService: VenuesService
  ) {

  }

  ngOnInit() {
    this.venuesService.currentVenue.subscribe((venue) => {
      this.venue = venue;
    });
  }

}
