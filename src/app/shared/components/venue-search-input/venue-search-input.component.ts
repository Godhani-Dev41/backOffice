import { switchMap, distinctUntilChanged, debounceTime } from "rxjs/operators";
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { VenuesService } from "@app/shared/services/venues/venues.service";
// import { SelectItem } from 'ng2-select';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { RCVenue } from "@rcenter/core";
import { LeaguesService } from "@app/shared/services/leagues/leagues.service";
import { Subscription, Subject } from "rxjs";

@Component({
  selector: "rc-venue-search-input",
  templateUrl: "./venue-search-input.component.html",
  styleUrls: ["./venue-search-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VenueSearchInputComponent),
      multi: true,
    },
  ],
})
export class VenueSearchInputComponent implements OnInit, ControlValueAccessor, OnDestroy {
  @ViewChild("venuesInput", { static: true }) venuesInput: any;
  @Input() seasonVenuesOnly: boolean;
  @Output() onSelect = new EventEmitter<RCVenue>();
  items: any[];
  active: any[];
  searchControl: FormControl;
  propagateChange = (_: any) => {};
  private venues: RCVenue[];
  private seasonSubscription: Subscription;
  private subscriptionObserver: Subscription;
  typedObservable$ = new Subject<string>();

  constructor(private zone: NgZone, private leaguesService: LeaguesService, private venuesService: VenuesService) {}

  ngOnInit() {
    this.items = [];

    this.loadSeasonVenues();

    this.subscriptionObserver = this.typedObservable$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => this.venuesService.searchVenues(term)),
      )
      .subscribe((result) => {
        this.zone.run(() => {
          this.venuesInput.items = result.data.map((i) => {
            return {
              text: i.name,
              id: i.id,
            };
          });

          this.items = this.venuesInput.items;
          this.venues = result.data;
          this.venuesInput.open();
        });
      });
  }

  loadSeasonVenues() {
    if (this.seasonVenuesOnly) {
      this.seasonSubscription = this.leaguesService.currentSeason$.subscribe((response) => {
        if (!response || !response.seasonVenues) {
          this.seasonVenuesOnly = false;
          return;
        }

        this.zone.run(() => {
          const newVenues = response.seasonVenues.map((i) => {
            return {
              text: i.name,
              id: i.id,
            };
          }) as any;
          this.venuesInput.items = newVenues;

          this.items = newVenues;
          this.venues = response.seasonVenues;
          if (!this.active || (!this.active.length && response.seasonVenues.length === 1)) {
            this.active = [
              {
                text: response.seasonVenues[0] ? response.seasonVenues[0].name : "",
                id: response.seasonVenues[0] ? String(response.seasonVenues[0].id) : "",
              },
            ] as any;
            this.itemSelected(this.active[0]);
          }
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.seasonSubscription) {
      this.seasonSubscription.unsubscribe();
    }

    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
  }

  onTextInput(searchQuery: string) {
    if (!this.seasonVenuesOnly) {
      this.typedObservable$.next(searchQuery);
    }
  }

  itemSelected(selectedItem: any) {
    const venue = this.venues.find((i) => i.id === Number(selectedItem.id));

    this.propagateChange(venue);
    this.onSelect.emit(venue);
  }

  writeValue(value: any): void {
    if (value && value.creatorId) {
      this.active = [
        {
          text: value.name,
          id: value.id,
        },
      ] as any;
    } else {
      this.active = value ? [value] : [];
    }

    this.loadSeasonVenues();
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}
}
