import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { VenuesService } from '@app/shared/services/venues/venues.service';

@Injectable()
export class LeaveVenueGuard implements CanDeactivate<any> {
  constructor(
    private venueService: VenuesService
  ) {

  }

  canDeactivate() {
    this.venueService.currentVenue.next(null);

    return true;
  }
}
