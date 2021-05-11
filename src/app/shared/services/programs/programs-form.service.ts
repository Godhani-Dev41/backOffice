import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class ProgramsFormService {
  programForm: FormGroup;
  defaultProgramForm = {
    sports: [],
    levelOfPlay: "",
    gender: "",
    name: "",
    ageRange: [1, 100, true],
    description: "",
    longDescription: "",
    mainImage: "",
    programHighlights: "",
    GL: null,
    memberships: [],
  };

  seasonForm: FormGroup;
  defaultPrgSeasonForm = {
    name: "",
    status: "",
    seasonType: "",
    startDate: "",
    endDate: "",
    description: "",
    longDescription: "",
    registrationStartDate: "",
    registrationEndDate: "",
    maxParticipants: 0,
    maxMaleParticipants: 0,
    maxFemaleParticipants: 0,
    maxWaitlist: 0,
    maxMaleWaitlist: 0,
    maxFemaleWaitlist: 0,
    addressId: 0,
    facilityId: 0,
    blockedDated: [],
    activityTimes: "",
    subSeasons: [],
    questionnaires: [],
    products: [],
    spaceAllocations: [],
    GL: null,
    isPunchCard: false,
  };

  productsForm: FormGroup;
  defaultProductsForm = {
    products: [],
    addons: [],
  };

  seasonShallowUpdateForm: FormGroup;
  defaultShallowUpdateForm = {
    seasonId: "",
    name: "",
    description: "",
    longDescription: "",
    maxParticipants: "",
    maxMaleParticipants: "",
    maxFemaleParticipants: "",
    maxWaitlist: "",
    maxMaleWaitlist: "",
    maxFemaleWaitlist: "",
    facilityId: "",
    addressId: "",
    questionnaires: [],
    subSeasons: [],
    isPunchCard: false,
  };

  constructor(private fb: FormBuilder) {
    this.programForm = this.fb.group({
      sports: [[], Validators.required],
      levelOfPlay: ["", Validators.required],
      gender: ["", Validators.required],
      name: ["", Validators.required],
      ageRange: [[6, 100]],
      description: [""],
      longDescription: [""],
      mainImage: [""],
      programHighlights: [""],
      GL: [null],
      memberships: [null],
    });

    this.seasonForm = this.fb.group({
      name: ["", Validators.required],
      status: [0],
      seasonType: [0],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      description: ["", Validators.required],
      longDescription: ["", Validators.required],
      registrationStartDate: ["", Validators.required],
      registrationEndDate: ["", Validators.required],
      maxParticipants: [""],
      maxMaleParticipants: [""],
      maxFemaleParticipants: [""],
      maxWaitlist: [""],
      maxMaleWaitlist: [""],
      maxFemaleWaitlist: [""],
      addressId: [""],
      facilityId: ["", Validators.required],
      blockedDated: [[]],
      activityTimes: [""],
      subSeasons: [[]],
      questionnaires: [null],
      products: [""],
      spaceAllocations: [[]],
      isPunchCard: [""],
    });

    this.seasonShallowUpdateForm = this.fb.group({
      seasonId: [""],
      name: [""],
      description: [""],
      longDescription: [""],
      questionnaires: [""],
      maxParticipants: [""],
      maxMaleParticipants: [""],
      maxFemaleParticipants: [""],
      maxWaitlist: [""],
      maxMaleWaitlist: [""],
      maxFemaleWaitlist: [""],
      facilityId: [""],
      addressId: [""],
      subSeasons: [[]],
      isPunchCard: [""],
    });

    this.productsForm = this.fb.group({
      products: [],
      addons: [],
    });
  }

  getNewProductObj = (): FormGroup => {
    return this.fb.group({
      organizationId: ["", Validators.required],
      name: ["", Validators.required],
      quantity: [null, Validators.required],
      description: [""],
      isPublic: [""],
      startDate: [""],
      endDate: [""],
      productType: [""],
      resourcesType: [""],
      resourcesIdsToApplyOn: [[]],
      prices: [[]],
      downpayment: [""],
      entitlementGroupsPricings: [[]],
    });
  };

  getEmptyProductObj = () => {
    return {
      organizationId: 0,
      name: "",
      quantity: 0,
      description: "",
      isPublic: false,
      startDate: "",
      endDate: "",
      productType: "",
      resourcesType: "",
      resourcesIdsToApplyOn: [],
      prices: [],
      downpayment: 0,
      entitlementGroupsPricings: [],
    };
  };
}
