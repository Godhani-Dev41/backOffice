import { RCMediaObject } from './Media';
import { RCUser } from './User';
import { RCAddress } from './Address';
import { RCAmenitiesEnum } from './rc.enums';
import { RCActivityTime } from './Leagues';
export interface RCVenueSpace {
    id: string;
    name: string;
    description?: string;
    mainMedia: RCMediaObject;
    spaces: RCVenueSpace[];
    amenities?: RCAmenitiesEnum[];
    sports: number[];
    surface: string;
    activityTimes: RCActivityTime[];
    properties: string[];
    length: string;
    width: string;
    packages?: any[];
    sessions?: any[];
}
export interface RCOpeningTimes {
    id: number;
    open: string;
    close: string;
    dayOfWeek: number;
}
export interface RCVenue {
    id: number;
    name: string;
    mainMedia: RCMediaObject;
    creator: RCUser;
    address: RCAddress;
    openingTimes: any;
    description?: string;
    openingTime: any[];
    sports: number[];
    following?: boolean;
    mapIcon?: any;
    spaces: RCVenueSpace[];
    amenities?: RCAmenitiesEnum[];
    organizationCreator: any;
    rules?: string;
    info?: string;
    questionnaireId?: number;
    media?: RCMediaObject[];
}
