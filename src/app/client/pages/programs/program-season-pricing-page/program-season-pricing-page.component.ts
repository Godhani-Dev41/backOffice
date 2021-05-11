import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import {
  ProductTypesEnum,
  ProgramsService,
  RCProgramPricing,
  RCProgramPricingDisplay,
  RCProgramProduct,
} from "@app/shared/services/programs/programs.service";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";

@Component({
  selector: "rc-program-season-pricing-page",
  templateUrl: "./program-season-pricing-page.component.html",
  styleUrls: ["./program-season-pricing-page.component.scss"],
})
export class ProgramSeasonPricingPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  seasonForm: FormGroup;
  productsForm: FormGroup;
  loading: boolean = false;
  newProduct: boolean = false;
  editProduct: boolean = false;
  updateMode: boolean = false;
  showingDiscounts: boolean = false;
  editIndex: number = -1;

  programName: string;
  seasonName: string;
  seasonId: number;
  startDate: string;
  endDate: string;
  subSeasonLength: number;
  segmentType: "program_season" | "event";
  requiredProductIds: number[] = [];

  products: RCProgramProduct[] = [];
  displayList: RCProgramProduct[] = [];

  productObj: FormGroup;
  productObjQtyOptions: { description: string; quantity: number }[] = [];
  defaultPriceObj: RCProgramPricingDisplay = {
    price: null,
    currency: "USD",
    name: "regular",
    startDate: "",
    endDate: "",
    active: true,
  };
  earlyPriceObj: RCProgramPricingDisplay = {
    price: null,
    currency: "USD",
    name: "early bird",
    startDate: "",
    endDate: "",
    active: false,
  };
  latePriceObj: RCProgramPricingDisplay = {
    price: null,
    currency: "USD",
    name: "late registration",
    startDate: "",
    endDate: "",
    active: false,
  };
  downpaymentObj: RCProgramPricingDisplay = {
    price: null,
    currency: "USD",
    name: "downpayment",
    startDate: "",
    endDate: "",
    active: false,
  };

  constructor(
    private router: Router,
    private location: Location,
    private programsFormService: ProgramsFormService,
    public programsService: ProgramsService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
  ) {
    this.productsForm = programsFormService.productsForm;
    this.seasonForm = programsFormService.seasonForm;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.cancelProduct();
  }

  ngOnInit() {
    this.programsService.loadingPricing$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      this.loading = loading;
    });

    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg) {
        this.programName = prg.name;
        this.requiredProductIds = prg.requiredProductIds ? [...prg.requiredProductIds] : [];
      }
    });

    this.programsService.seasonEdit$.pipe(takeUntil(this.destroy$)).subscribe((editMode) => {
      if (!editMode) this.updateMode = false;
      if (editMode === "shallow") {
        this.updateMode = true;
      }
      if (editMode === "full") {
        this.updateMode = false;
      }
    });

    /*
     *  Check if improperly entered edit/create. Redirect to /basic if so
     */
    this.programsService.editFlowGuard();

    this.seasonName = this.seasonForm.get("name").value;
    this.startDate = this.defaultPriceObj.startDate = this.seasonForm.get("registrationStartDate").value;
    this.endDate = this.defaultPriceObj.endDate = this.seasonForm.get("registrationEndDate").value;
    this.products = this.productsForm.get("products").value || [];
    this.displayList = this.productsForm.get("products").value || [];

    if (this.seasonForm.get("subSeasons").value.length) {
      this.subSeasonLength = this.seasonForm.get("subSeasons").value.length;
      if (!this.displayList.length) {
        this.addNewProduct();
      }
    } else {
      this.programsService
        .getEventDates(
          moment(this.seasonForm.get("startDate").value).format("YYYY-MM-DD"),
          moment(this.seasonForm.get("endDate").value).format("YYYY-MM-DD"),
          this.seasonForm.get("activityTimes").value,
          this.seasonForm.get("blockedDated").value,
        )
        .subscribe((dates) => {
          this.subSeasonLength = dates.data.length;
          this.programsService.currentEventDates.next([...dates.data]);
          if (!this.displayList.length) {
            this.addNewProduct();
          }
        });
    }
  }

  displayDiscount() {
    this.showingDiscounts = true;
  }

  closeDiscounts() {
    this.showingDiscounts = false;
  }

  saveEntitlements(values) {
    this.showingDiscounts = false;
    this.productObj.patchValue({ entitlementGroupsPricings: values });
  }

  getSubSeasons = async () => {
    await this.programsService
      .getSubSeasons(this.seasonId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.subSeasonLength = res.data.length;
        this.programsFormService.seasonForm.patchValue({ subSeasons: [...res.data] });
        if (!this.displayList.length) {
          this.addNewProduct();
        }
      });
  };

  addNewProduct = () => {
    this.updateQtyOptions();
    this.segmentType =
      this.programsFormService.seasonForm.get("subSeasons").value.length > 0 ? "program_season" : "event";
    this.newProduct = true;
    this.productObj = this.programsFormService.getNewProductObj();
    this.productObj.patchValue({
      organizationId: this.programsService.getOrgId(),
      startDate: this.datePipe.transform(this.startDate, "yyyy-MM-dd"),
      endDate: this.datePipe.transform(this.endDate, "yyyy-MM-dd"),
      resourcesType: this.segmentType,
      productType: ProductTypesEnum.REGISTRATION,
    });
  };

  updateProduct = (editProd: RCProgramProduct, idx: number) => {
    this.updateQtyOptions();

    this.editIndex = idx;
    this.editProduct = true;
    this.productObj = this.programsFormService.getNewProductObj();
    this.productObj.patchValue({ ...editProd, productType: ProductTypesEnum.REGISTRATION });
    this.productObj.get("prices").value.forEach((price, idx) => {
      switch (idx) {
        case 0:
          this.defaultPriceObj = { ...price };
          break;
        case 1:
          this.earlyPriceObj = { ...price };
          break;
        case 2:
          this.latePriceObj = { ...price };
          break;
      }
    });

    if (editProd.downpayment) {
      this.downpaymentObj.active = true;
      this.downpaymentObj.price = editProd.downpayment;
    } else {
      this.downpaymentObj.active = false;
      this.downpaymentObj.price = null;
    }
  };

  deleteProduct = (idx: number) => {
    this.products.splice(idx, 1);
    this.displayList = [...this.products];
    this.productsForm.patchValue({ products: [...this.products] });
  };

  saveProduct = () => {
    this.defaultPriceObj.startDate = this.startDate;
    this.defaultPriceObj.endDate = this.endDate;
    const earlyDate: moment.Moment = moment(this.earlyPriceObj.endDate, "YYYY-MM-DD");
    let defaultDate: moment.Moment = moment(this.defaultPriceObj.startDate, "YYYY-MM-DD");

    if (earlyDate >= defaultDate) {
      defaultDate = earlyDate.add(1, "d");
      this.defaultPriceObj.startDate = moment(defaultDate).format("YYYY-MM-DD");
    }

    const lateDate: moment.Moment = moment(this.latePriceObj.startDate, "YYYY-MM-DD");
    let defaultEndDate: moment.Moment = moment(this.defaultPriceObj.endDate, "YYYY-MM-DD");

    if (defaultEndDate >= lateDate) {
      defaultDate = lateDate.add(-1, "d");
      this.defaultPriceObj.endDate = moment(defaultDate).format("YYYY-MM-DD");
    }

    // Remove empty prices
    const tempPrices: RCProgramPricing[] = [this.defaultPriceObj];

    if (this.earlyPriceObj.active) tempPrices.push(this.earlyPriceObj);
    if (this.latePriceObj.active) tempPrices.push(this.latePriceObj);
    this.productObj.patchValue({
      isPublic: true,
      prices: tempPrices,
      resourcesIdsToApplyOn: [],
    });
    //    TODO
    //    saved for future edits
    /*    const tempSubId: number[] = [];
    this.programsFormService.seasonForm.get("subSeasons").value.forEach((subSeason) => {
      const idx = tempSubId.indexOf(subSeason.id);
      if (idx === -1) {
        tempSubId.push(subSeason.id);
      }
    });

    this.productObj.patchValue({
      isPublic: true,
      prices: tempPrices,
      resourcesIdsToApplyOn: [...tempSubId],
    });*/

    // Remove empty downpayment
    if (!this.downpaymentObj.active || !this.downpaymentObj.price) {
      this.productObj.patchValue({ downpayment: null });
    } else {
      this.productObj.patchValue({ downpayment: this.downpaymentObj.price });
    }

    if (this.editIndex === -1) {
      this.products.push(this.productObj.getRawValue());
    } else {
      this.products.splice(this.editIndex, 1, { ...this.productObj.getRawValue() });
    }

    this.displayList = [...this.products];
    this.productsForm.patchValue({ products: [...this.products] });
    // Reset values
    this.productObj.patchValue({ ...this.programsFormService.getEmptyProductObj() });
    this.editProduct = false;
    this.newProduct = false;
    this.editIndex = -1;
    this.defaultPriceObj = {
      price: null,
      currency: "USD",
      name: "regular",
      startDate: this.startDate,
      endDate: this.endDate,
      active: true,
    };
    this.earlyPriceObj = {
      price: null,
      currency: "USD",
      name: "early bird",
      startDate: "",
      endDate: "",
      active: false,
    };
    this.latePriceObj = {
      price: null,
      currency: "USD",
      name: "late registration",
      startDate: "",
      endDate: "",
      active: false,
    };
    this.downpaymentObj = {
      price: null,
      currency: "USD",
      name: "downpayment",
      startDate: "",
      endDate: "",
      active: false,
    };
  };

  cancelProduct = () => {
    if (this.productObj) this.productObj.patchValue({ ...this.programsFormService.getEmptyProductObj() });
    this.editProduct = false;
    this.newProduct = false;
    this.editIndex = -1;
    this.defaultPriceObj = {
      price: null,
      currency: "USD",
      name: "regular",
      startDate: this.startDate,
      endDate: this.endDate,
      active: true,
    };
    this.earlyPriceObj = {
      price: null,
      currency: "USD",
      name: "early bird",
      startDate: "",
      endDate: "",
      active: false,
    };
    this.latePriceObj = {
      price: null,
      currency: "USD",
      name: "late registration",
      startDate: "",
      endDate: "",
      active: false,
    };
    this.downpaymentObj = {
      price: null,
      currency: "USD",
      name: "downpayment",
      startDate: "",
      endDate: "",
      active: false,
    };
  };

  onNameChange = (newName: string) => {
    this.productObj.patchValue({ name: newName });
  };

  onProductAmountChange = (qty: number) => {
    this.productObj.patchValue({ quantity: qty });
  };

  onDepositPriceChange = (downpayment: RCProgramPricingDisplay) => {
    this.downpaymentObj = downpayment;
  };

  onBasePriceChange = (pricing: RCProgramPricingDisplay) => {
    if (pricing.price) {
      this.defaultPriceObj = pricing;
      /*this.defaultPriceObj.startDate = this.datePipe.transform(pricing.startDate, "yyyy-MM-dd");
      this.defaultPriceObj.endDate = this.datePipe.transform(pricing.endDate, "yyyy-MM-dd");*/
    }
  };

  onEarlyPriceChange = (pricing: RCProgramPricingDisplay) => {
    if (pricing.price) {
      this.earlyPriceObj = pricing;
      this.earlyPriceObj.startDate = this.datePipe.transform(pricing.startDate, "yyyy-MM-dd");
      this.earlyPriceObj.endDate = this.datePipe.transform(pricing.endDate, "yyyy-MM-dd");
    }
  };

  onLatePriceChange = (pricing: RCProgramPricingDisplay) => {
    if (pricing.price) {
      this.latePriceObj = pricing;
      this.latePriceObj.startDate = this.datePipe.transform(pricing.startDate, "yyyy-MM-dd");
      this.latePriceObj.endDate = this.datePipe.transform(pricing.endDate, "yyyy-MM-dd");
    }
  };

  getResourceIds = () => {
    const tempSubId: number[] = [];
    this.programsFormService.seasonForm.get("subSeasons").value.forEach((subSeason) => {
      const idx = tempSubId.indexOf(subSeason.id);
      if (idx === -1) {
        tempSubId.push(subSeason.id);
      }
    });
    return tempSubId;
  };

  updateQtyOptions = () => {
    const tempOptions = [];
    if (
      this.programsFormService.seasonForm.get("subSeasons").value.length === 0 ||
      this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType === "event"
    ) {
      tempOptions.push({ description: "Per event pricing", quantity: 1 });
    }
    if (this.products.length > 0) {
      for (let i = 0; i < this.subSeasonLength - 1; i++) {
        if (
          ((this.programsFormService.seasonForm.get("subSeasons").value.length === 0 ||
            this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType === "event") &&
            i > 0) ||
          (this.programsFormService.seasonForm.get("subSeasons").value.length > 0 &&
            this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType === "program_season")
        ) {
          tempOptions.push(
            this.programsFormService.seasonForm.get("subSeasons").value.length === 0 ||
              this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType === "event"
              ? { description: i + 1 + " events", quantity: i + 1 }
              : {
                  description: i + 1 + (i === 0 ? " session" : " sessions"),
                  quantity: i + 1,
                },
          );
        }
      }
    }

    tempOptions.push({ description: "Full season", quantity: this.subSeasonLength });
    this.productObjQtyOptions = [...tempOptions];
  };

  navBack = () => {
    this.location.back();
  };

  navNext = async () => {
    if (this.products.length) {
      const tempProds = [];

      const rIds: number[] = this.getResourceIds();
      if (this.productsForm.get("products").value && this.productsForm.get("products").value.length > 0)
        for (let prod of this.productsForm.get("products").value) {
          tempProds.push({
            ...prod,
            requiredProductIds: [...this.requiredProductIds],
            resourcesIdsToApplyOn: [...rIds],
            resourcesType:
              this.programsFormService.seasonForm.get("subSeasons").value.length > 0
                ? this.programsFormService.seasonForm.get("subSeasons").value[0].segmentType
                : "event",
          });
        }

      if (tempProds.length > 0) {
        this.productsForm.patchValue({ products: [...tempProds] });
      }

      if (!this.updateMode && !this.programsService.getSeasonEdit()) {
        this.router.navigate([
          "/client/programs/" +
            this.programsService.getProgramTypeParam() +
            "/" +
            this.programsService.getPrgId() +
            "/season/addons",
        ]);
      } else {
        this.router.navigate([
          "/client/programs/" +
            this.programsService.getProgramTypeParam() +
            "/" +
            this.programsService.getPrgId() +
            "/season/" +
            this.programsService.getSeasonId() +
            "/addons",
        ]);
      }
    }
  };
}
