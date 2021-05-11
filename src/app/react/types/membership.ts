import { MediaInterface } from "./media";
import { Product, ProductPackage } from "./product";

export enum CustomerTypeEnum {
  NONE = "none",
  INDIVIDUAL = "individual",
  FAMILY = "family",
  ORGANIZATION = "organization",
}

export enum MembershipTypeEnum {
  FIXED = "fix_membership",
  ROLLING = "rolling_membership",
}

// export interface tag {
//   id: number;
//   name: string;
// }

export interface Membership {
  id: number;
  organizationId: number;
  name: string;
  description?: string;
  mainMedia?: MediaInterface;
  customerTypes: CustomerTypeEnum[];
  numberOfPeople?: number;
  activity: number;
  facilityId: number;
  facilityName?: string;
  questionnaires: number[];
  minAgeYears: number;
  maxAgeYears: number;
  gender: number;
  tags: string[];
  maxMembers?: number;
  maxMaleMembers?: number;
  maxFemaleMembers?: number;
  membershipType: MembershipTypeEnum;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  durationMonths?: number;
  package: {
    parentProduct: Product; // the membership product will include currPrice and prices[] inside, as in all products
    children: {
      product: Product;
      relationType: ProductPackage;
    }[];
  };
}

export class CreateMembershipDto {
  organizationId: number;
  name: string;
  description?: string;
  customerTypes: CustomerTypeEnum[];
  activity?: number; // SportsEnum;
  facilityId?: number;
  questionnaires?: number[];
  minAgeYears?: number;
  maxAgeYears?: number;
  gender: number; // GenderEnum;
  maxMembers?: number;
  maxMaleMembers?: number;
  maxFemaleMembers?: number;
  membershipType: MembershipTypeEnum;
  startDate?: string;
  endDate?: string;
  registrationStartDate?: string;
  registrationEndDate?: string;
  durationMonths?: number;
}

export class UpdateMembrshipDto extends CreateMembershipDto {
  id: number;
}
