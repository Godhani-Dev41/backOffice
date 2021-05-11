import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from "@angular/forms";
import { LocationService, RCParsedAddress } from "@app/shared/services/utils/location.service";
import { MapsAPILoader } from "@agm/core";
import * as moment from "moment-timezone";
import { TimeService } from "@app/shared/services/utils/time.service";

@Component({
  selector: "rc-location-search-input",
  templateUrl: "./location-search-input.component.html",
  styleUrls: ["./location-search-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationSearchInputComponent),
      multi: true,
    },
  ],
})
export class LocationSearchInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild("search") searchElementRef: ElementRef;
  @Input() placeholder = "";
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Output() onSelected = new EventEmitter<RCParsedAddress>();
  @Output() onTimezoneChange = new EventEmitter<string>();
  @Input() name: string;
  @Input() timeZoneSelector = false;
  @Input() timezone = moment.tz.guess();

  searchControl: FormControl;
  propagateChange = (_: any) => {};

  constructor(
    private timeService: TimeService,
    private ngZone: NgZone,
    private mapsAPILoader: MapsAPILoader,
    private locationService: LocationService,
  ) {}

  ngOnInit() {
    // create search FormControl
    this.searchControl = new FormControl();

    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: [],
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          const latitude = place.geometry.location.lat();
          const longitude = place.geometry.location.lng();

          const parsedAddress = this.locationService.parseGooglePlaceAddress(place.address_components, place.name);
          const address = Object.assign(parsedAddress, {
            lat: latitude,
            lon: longitude,
            name: place.name,
            poi: !place.types.includes("street_address"),
          });

          if (this.timeZoneSelector) {
            this.timeService.getTimezoneByLocation(latitude, longitude).subscribe((response) => {
              address.timezone = response;
              this.onTimezoneChange.emit(response);
              this.onSelected.emit(address);
              this.propagateChange(address.poi ? address.name : place.formatted_address);
            });
          } else {
            this.onSelected.emit(address);
            this.propagateChange(address.poi ? address.name : place.formatted_address);
          }
        });
      });
    });
  }

  writeValue(value: any): void {
    this.searchControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  onTextEnter(value) {
    this.propagateChange(value);
  }
}
