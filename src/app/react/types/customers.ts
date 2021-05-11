import { RCAddress } from "@rcenter/core";

// interface IAddress {
//   aptNum?: string;
//   city: string;
//   country?: string;
//   geo?: string;
//   id: number;
//   state: string;
//   street: string;
//   streetNum?: string | number;
//   zip: string | number;
// }
export enum EStatusColorMapper {
  family = "purple",
  user = "yellow",
  organization = "red",
  not_paid = "red",
  paid = "green",
  partial = "yellow",
  future = "red",
  succeeded = "green",
  canceled = "purple",
  scheduled = "blue",
  charged = "green",
}
interface IIsActive {
  active: true;
}
interface INotificationSettings {
  feed: IIsActive;
  teams: IIsActive;
  users: IIsActive;
  events: IIsActive;
  venues: IIsActive;
  leagues: IIsActive;
}

export enum CustomerTypeEnum {
  USER = "user",
  FAMILY = "family",
  ORGANIZATION = "organization",
}

export enum ResourceNameTypeEnum {
  EVENT = "event" as any,
  VENUE = "venue" as any,
  TEAM = "team" as any,
  LEAGUE = "league" as any,
  USER = "user" as any,
  ORGANIZATION = "organization" as any,
  APP = "app" as any,
  FEED = "feed" as any,
  MATCH = "match" as any,
  ROUND = "round" as any,
  PORTAL = "portal" as any,
  SEASON = "season" as any, // league season
  TOURNAMENT = "tournament" as any,
  MEMBERSHIP = "membership" as any,
  DIVISION = "division" as any,
  GAMESLOT = "gameslot" as any,
  SPACE = "space" as any,
  RESERVATION = "reservation" as any,
  ORDER = "order" as any,
  CUSTOMER = "customer" as any,
  PACKAGE = "package" as any,
  PROGRAM = "program" as any,
  PROGRAM_SEASON = "program_season" as any,
}

export interface ICustomer {
  id: number;
  name?: string;
  firstName: string;
  lastName: string;
  birthDate?: Date;
  lastLogin: Date;
  gender: 1 | 2 | 3;
  entityType: CustomerTypeEnum;
  color?: string;
  phoneNumber?: string;
  mainMediaId?: number;
  creatorType: ResourceNameTypeEnum;
  organizationId?: number;
  entityId: number;
  vetted?: boolean;
  members?: ICustomer[];
  tags?: Tag[];
  //returning from API but not exist in the Yossi's Interfaces
  address: RCAddress;
  addressId: number;
  createAsId: number;
  createAsType: string;
  createdAt: string;
  creatorId: number;
  currentAddressId?: number;
  customerId?: number;
  deletedAt?: string;
  email: string;
  height?: string;
  lastInteractionDay: string;
  loginToken: string;
  merchantId?: number;
  motto?: string;
  notificationSettings: INotificationSettings;
  ownerId?: string;
  passwordResetExpires?: string;
  passwordResetToken?: string;
  privateProfile?: string;
  profilePicture?: IProfilePicture;
  profilePictureId: number;
  pushNotifications: boolean;
  status: TStatus;
  updatedAt: string;
  userCreatorId: number;
  weight?: string;
  about?: string;
  allowMultiSignHack?: string;
  // missing in the API-
  waiver: any;
  balance: number;
  messages: any;
  notes: any;
}

interface IProfilePicture {
  fileType?: string;
  id?: number;
  isDefault?: boolean | null;
  mediaKey?: string;
  mediaType?: number;
  provider?: string;
  url?: string;
}

// waiver
// balance

export type TCustomer = ICustomer | null;

type TStatus = "pending" | "in process" | "done";

interface Tag {
  id: number;
  value: string;
}
