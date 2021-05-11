import { Injectable } from '@angular/core';

interface RCGoogleParsedAddress {
  country?: string;
  route?: string;
  street_number?: string;
  postal_code?: string;
  locality?: string;
  sublocality?: string;
  administrative_area_level_1?: string;
}

export interface RCParsedAddress {
  poi?: boolean;
  name?: string;
  country: string;
  street: string;
  streetNum: string;
  state?: string;
  zip: string;
  city: string;
  lat?: number;
  lon?: number;
  timezone?: string;
}

@Injectable()
export class LocationService {
  parseGooglePlaceAddress(address: google.maps.GeocoderAddressComponent[], name?: string): RCParsedAddress {
    const parsedAddress: RCGoogleParsedAddress = {};
    address.forEach((item) => {
      item.types.forEach((value) => {
        // if it's the state we want to use the short name of it. i.e NY
        if (value === 'administrative_area_level_1') {
          parsedAddress[value] = item.short_name;
        } else {
          parsedAddress[value] = item.long_name;
        }
      });
    });

    const addressObject =  {
      state: parsedAddress.administrative_area_level_1,
      country: parsedAddress.country,
      street: parsedAddress.route,
      streetNum: parsedAddress.street_number,
      zip: parsedAddress.postal_code,
      city: parsedAddress.locality || parsedAddress.sublocality || parsedAddress.administrative_area_level_1,
    };

    if (addressObject.city === addressObject.street) {
      addressObject.street = '';
    }

    return addressObject;
  }
}
