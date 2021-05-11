import { ProductsUsers } from "./productsUsers";
import { Membership, MembershipTypeEnum } from "./membership";

export interface MembershipMember {
  id: number;
  organizationId: number;
  membership: Membership;
  productUser?: ProductsUsers;
  userId: number;
  membershipType: MembershipTypeEnum;
  durationMonths?: number;
  // start+end dates relate to fix_membership
  startDate?: Date;
  endDate?: Date;

  createdAt?: string;  // TODO --- should we really use this ? 
}
