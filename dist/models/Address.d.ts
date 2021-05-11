export declare type Lat = number;
export declare type Lon = number;
export declare type GeoArray = [Lat, Lon];
export interface RCAddress {
    id?: number;
    city?: string;
    street?: string;
    streetNum?: string;
    geo?: GeoArray;
    lat?: number;
    lon?: number;
    state?: string;
    aptNum?: string;
    country?: string;
    zip?: string;
}
