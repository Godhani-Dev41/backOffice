import { Component, OnDestroy, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { AddOnItem } from "@app/shared/components/add-ons-management/add-ons-management.component";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProgramsFormService } from "@app/shared/services/programs/programs-form.service";
import { ProductTypesEnum, ProgramsService, RCProgramAddOn } from "@app/shared/services/programs/programs.service";
import { AuthenticationService } from "@app/shared/services/auth/authentication.service";
import { OrganizationsService } from "@app/shared/services/organization/organizations.service";

@Component({
  selector: "rc-program-season-addons-page",
  templateUrl: "./program-season-addons-page.component.html",
  styleUrls: ["./program-season-addons-page.component.scss"],
})
export class ProgramSeasonAddonsPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<true>();
  loading: boolean = true;
  updateMode: boolean = false;
  seasonForm: FormGroup;
  productsForm: FormGroup;
  programName: string;
  seasonName: string;
  seasonId: number;
  startDate: string;
  endDate: string;
  addOns: AddOnItem[] = [];

  constructor(
    public programsFormService: ProgramsFormService,
    public programsService: ProgramsService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.productsForm = programsFormService.productsForm;
    this.seasonForm = programsFormService.seasonForm;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.programsService.currentProgram$.pipe(takeUntil(this.destroy$)).subscribe((prg) => {
      if (prg) this.programName = prg.name;
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

    this.seasonName = this.seasonForm.get("name").value;
    this.startDate = this.seasonForm.get("registrationStartDate").value;
    this.endDate = this.seasonForm.get("registrationEndDate").value;
    this.onAddOnChange(this.programsService.processAddOnResp(this.productsForm.get("addons").value), true);

    /*
     *  Check if improperly entered edit/create. Redirect to /basic if so
     */
    this.programsService.editFlowGuard();
  }

  processAddOnResp = async (resp: any[]) => {
    const convertedResp: AddOnItem[] = [];
    for (let i = 0; i < resp.length; i++) {
      const convertedItem: AddOnItem = {
        index: resp[i].product.id,
        name: resp[i].product.name,
        price: resp[i].product.prices[0].price,
        active: true,
        editing: false,
        new: false,
      };
      convertedResp.push({ ...convertedItem });
    }
    return convertedResp;
  };

  onAddOnChange = (newAddOns: AddOnItem[], initial: boolean) => {
    this.addOns = [...newAddOns];
    // const onlyNew: AddOnItem[] = [...this.addOns.filter((a) => a.new)];
    const tempArrayConv: RCProgramAddOn[] = [];

    for (let i = 0; i < this.addOns.length; i++) {
      const tempEntry: RCProgramAddOn = { ...this.programsFormService.getEmptyProductObj(), relationType: "upsale" };
      tempEntry.id = !this.addOns[i].new ? this.addOns[i].index : null;
      tempEntry.organizationId = this.programsService.getOrgId();
      tempEntry.name = this.addOns[i].name;
      tempEntry.quantity = 1;
      tempEntry.isPublic = true;
      tempEntry.startDate = this.startDate;
      tempEntry.endDate = this.endDate;
      tempEntry.productType = ProductTypesEnum.GOODS;
      tempEntry.new = this.addOns[i].new;
      tempEntry.prices = [
        {
          price: this.addOns[i].price,
          currency: "usd",
          name: this.addOns[i].name,
          startDate: this.startDate,
          endDate: this.endDate,
        },
      ];
      tempArrayConv.push({ ...tempEntry });
    }
    this.productsForm.patchValue({ addons: [...tempArrayConv] });
  };

  navBack = () => {
    this.location.back();
  };

  navNext = async () => {
    this.loading = true;

    if (!this.updateMode && !this.programsService.getSeasonEdit()) {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/spaces",
      ]);
    } else {
      this.router.navigate([
        "/client/programs/" +
          this.programsService.getProgramTypeParam() +
          "/" +
          this.programsService.getPrgId() +
          "/season/" +
          this.programsService.getSeasonId() +
          "/spaces",
      ]);
    }
  };
}
