import { switchMap, distinctUntilChanged, debounceTime, takeUntil } from "rxjs/operators";
import { Component, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { VenuesService } from "@app/shared/services/venues/venues.service";
import { Subject, Subscription } from "rxjs";
import { RCOrganization, RCVenue } from "@rcenter/core";
import { BookingEditModalComponent } from "@app/client/pages/venues/components/booking-edit-modal/booking-edit-modal.component";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";

@Component({
  selector: "rc-venue-page-reservations",
  templateUrl: "./venue-page-reservations.component.html",
  styleUrls: ["./venue-page-reservations.component.scss"],
})
export class VenuePageReservationsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  venue: RCVenue;
  organization: RCOrganization;
  loading = false;
  customerSubscriptionObserver: Subscription;
  typedObservable$ = new Subject<string>();
  customers: any[];
  reservations: any[] = [];
  spaces = [];
  filters = {
    customerId: "",
    spaceId: "",
    orderStatus: "",
  };

  @ViewChild("bookingEditModal", { static: true }) bookingEditModal: BookingEditModalComponent;

  constructor(
    private venuesService: VenuesService,
    private organizationService: OrganizationsService,
    private authService: AuthenticationService,
    private zone: NgZone,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.loading = true;

    this.initCustomerSearchListeners();

    this.authService.currentOrganization.subscribe((response) => {
      this.organization = response;
    });

    this.venuesService.currentVenue.pipe(takeUntil(this.destroy$)).subscribe((venue) => {
      this.venue = venue;

      if (venue) {
        this.getEvents();
      }
    });
  }

  initCustomerSearchListeners() {
    this.customerSubscriptionObserver = this.typedObservable$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.organizationService.searchCustomers(this.organization.id, term)),
      )
      .subscribe((result) => {
        this.zone.run(() => {
          this.customers = result.data.map((i) => {
            return {
              text: i.name,
              id: i.id,
            };
          });
        });
      });
  }

  async getEvents() {
    this.loading = true;

    const { id: organizationId } = this.authService.currentOrganization.getValue();
    const { data } = await this.organizationService
      .getOrganizationVenueReservations(organizationId, this.venue.id, this.filters)
      .toPromise();
    this.reservations = data;

    this.loading = false;

    this.venuesService.getVenueSpaces(this.venue.id).subscribe((spacesResponse) => {
      this.spaces = spacesResponse.data;
    });
  }

  editBooking(reservation) {
    const item = {
      id: reservation.id,
      resourceId: reservation.space.id,
      start: reservation.startDate,
      end: reservation.endDate,
      bookingSize: reservation.percentage,
      title: reservation.name,
      reservation: reservation,
    };

    this.bookingEditModal.showModal(item);
  }

  async selectSpace(val) {
    this.filters.spaceId = val;

    await this.getEvents();
  }

  async selectStatus(val) {
    this.filters.orderStatus = val;

    await this.getEvents();
  }

  onCustomerTyped(event: { term: string; items: any[] }) {
    this.typedObservable$.next(event.term);
  }

  async customerSelected(event) {
    if (event) {
      this.filters.customerId = event.id;

      await this.getEvents();
    }
  }
}
