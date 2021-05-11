import { Membership } from "app/react/types/membership";
import { atom, AtomEffect, DefaultValue } from "recoil";
import { localStorage } from "../lib/storage";
import { MembershipTypeEnum, CustomerTypeEnum } from "../types/membership";
import { CreateProductDto } from "../types/product";
import { MediaUpload } from "./../types/media";

interface MembershipEditStore {
  id: number; // populated if it's in edit mode and not create
  organizationId: number;
  name: string;
  description?: string;
  customerTypes: CustomerTypeEnum[];
  numberOfPeople?: number;
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
  price?: number;
  membershipPicture?: MediaUpload;

  editingMembership?: Membership;

  // to be pushed into product creation
  product?: CreateProductDto;

  // the current steps for the membership creation
  steps: string[];
}

const localStorageEffect = (key: string): AtomEffect<MembershipEditStore> => ({ setSelf, onSet }) => {
  const savedValue = localStorage.getItem(key) || {};

  setSelf(savedValue);

  onSet((newValue) => {
    if (newValue instanceof DefaultValue) {
      localStorage.removeItem(key);
    }

    localStorage.setItem(key, newValue);
  });
};

const editCreate = atom<MembershipEditStore | null>({
  key: "membershipEditStore",
  default: null,
  effects_UNSTABLE: [localStorageEffect("membershipStore")],
});

export const membershipStore = {
  editCreate,
};
