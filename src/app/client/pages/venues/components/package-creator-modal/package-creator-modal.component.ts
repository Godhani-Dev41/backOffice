import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { LeaguesService } from '@app/shared/services/leagues/leagues.service';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { VenuesService } from '@app/shared/services/venues/venues.service';
import { RCOrganization, RCVenue } from '@rcenter/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'rc-package-creator-modal',
  templateUrl: './package-creator-modal.component.html',
  styleUrls: ['./package-creator-modal.component.scss'],
  exportAs: 'modal'
})
export class PackageCreatorModalComponent implements OnInit {
  packageForm: FormGroup;
  editMode = false;
  loading = false;
  organization: RCOrganization;
  _spaces: any[];
  packageItem: any;
  @Input() isAddon = false;
  @Input() venue: RCVenue;
  @Input() set spaces(spaces) {
    if (spaces) {
      this._spaces = JSON.parse(JSON.stringify(spaces));
    } else {
      this._spaces = [];
    }
  }
  @Output() onUpdated = new EventEmitter();
  @ViewChild('modal') public modal: ModalDirective;
  @ViewChild('scrollArea') scrollArea: any;
  constructor(
    private authService: AuthenticationService,
    private venuesService: VenuesService,
    private leaguesService: LeaguesService,
    private organizationService: OrganizationsService,
    private fb: FormBuilder
  ) {
    this.packageForm = this.fb.group({
      name: ['', Validators.required],
      duration: [60],
      customDuration: false,
      activityDates: this.fb.array([]),
      price: 0,
      addon: false,
      isMandatory: false,
      isFlexible: true,
      tooltipTitle: '',
      tooltipSubtitle: '',
      tooltipBody: '',
    });
  }

  ngOnInit() {
    this.authService.currentOrganization.subscribe((response) => {
      this.organization = response;
    });
  }

  cancel() {
    this.modal.hide();
  }

  onSubmit(data) {
    const packageItem = {
      creatorId: this.venue.id,
      creatorType: 'venue',
      name: data.name,
      price: data.price,
      duration: data.duration,
      activityTimes: this.parseActivityTimes(data.activityDates[0].activityDates),
      addon: data.addon,
      isMandatory: data.isMandatory,
      isFlexible: data.isFlexible,
      tooltipTitle: data.tooltipTitle,
      tooltipSubtitle: data.tooltipSubtitle,
      tooltipBody: data.tooltipBody,
    };

    if (this.editMode) {
      this.updatePackage(packageItem);
      return;
    }

    this.loading = true;
    this.venuesService.createPackage(this.organization.id, packageItem).subscribe((response) => {
      const selectedSpaces = this._spaces.filter(i => i.selected).map((i) => {
        return {
          packageId: response.data.id,
          resourceId: i.id,
          resourceType: 'space'
        };
      });

      if (selectedSpaces.length) {
        this.venuesService.assignPackages(this.organization.id, selectedSpaces).subscribe(() => {
          this.loading = false;
          this.modal.hide();
          this.onUpdated.emit();
        });
      } else {
        this.loading = false;
        this.modal.hide();
        this.onUpdated.emit();
      }
    }, () => {
      this.loading = false;
    });
  }

  async updatePackage(data) {
    try {
      this.loading = true;
      const response = await this.venuesService.updatePackage(this.organization.id, this.packageItem.id, data).toPromise();
      this.packageItem = response['data'];

      const selectedSpaces = this._spaces.filter(i => i.selected).map((i) => {
        const found = this.packageItem.resources.find((currentResponse) => {
          return currentResponse.resourceId === i.id;
        });
        return {
          id: found && found.id,
          packageId: this.packageItem.id,
          resourceId: i.id,
          resourceType: 'space'
        };
      });

      this.packageItem.resources.forEach((resource) => {
        const foundSpace = selectedSpaces.find(i => i.resourceId === resource.resourceId);
        if (!foundSpace) {
          selectedSpaces.push({
            id: resource.id,
            packageId: this.packageItem.id,
            resourceId: resource.resourceId,
            resourceType: 'space',
            toRemove: true
          } as any);
        }
      });

      await this.venuesService.assignPackages(this.organization.id, selectedSpaces).toPromise();
      this.loading = false;
      this.modal.hide();
      this.onUpdated.emit();
    } catch (e) {
      console.error(e);
      alert('Error occurred while creating package');
    } finally {
      this.loading = false;
    }
  }

  parseActivityTimes(formActivities: any) {
    const activities = [];

    formActivities.forEach((date) => {
      const parsedDaysActivities = this.leaguesService.getActivityTimeObject(date);
      if (!parsedDaysActivities) return;

      parsedDaysActivities.forEach((i) => {
        if (!i || !i.dayOfWeek || !i.open || !i.close) return;
        activities.push(i);
      });
    });

    return activities;
  }

  addTimeSlot() {
    // Should be an output call to container item instead of here.
    this.activitiesArray.push(this.leaguesService.getActivityDateFormControl());
  }

  showModal(packageItem?: any) {
    this.scrollArea.nativeElement.scrollTop = 0;

    this.packageItem = null;
    this.editMode = false;
    this.packageForm.reset({
      name: '',
      duration: 60,
      activityDates: this.fb.array([]),
      price: 0,
      customDuration: false,
      addon: this.isAddon,
      isFlexible: true,
      tooltipTitle: '',
      tooltipSubtitle: '',
      tooltipBody: '',
    });

    const itemsToRemove = this.activitiesArray.length;
    for (let i = itemsToRemove; i >= 0; i--) {
      this.activitiesArray.removeAt(i);
    }

    if (this._spaces) {
      this._spaces.forEach((i) => {
        i.selected = false;
      });
    }

    if (packageItem) {
      this.packageItem = packageItem;
      this.editMode = true;
      this.loadForEdit(packageItem);
    } else {
      if (!this.editMode && this.venue.openingTimes.length) {
        this.preloadActivityTimes(this.venue.openingTimes);
      } else {
        this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
      }
    }

    this.modal.show();
  }

  loadForEdit(packageItem: any) {
    this.packageForm.patchValue({
      name: packageItem.name,
      creatorType: 'venue',
      creatorId: packageItem.creatorId,
      price: packageItem.price,
      duration: packageItem.duration,
      addon: packageItem.addon,
      isMandatory: packageItem.isMandatory,
      isFlexible: packageItem.isFlexible,
      tooltipTitle: packageItem.tooltipTitle,
      tooltipSubtitle: packageItem.tooltipSubtitle,
      tooltipBody: packageItem.tooltipBody,
    });

    if (![30, 60, 90, 120, 1440].includes(packageItem.duration)) {
      this.packageForm.get('customDuration').setValue(true);
    }

    this.preloadActivityTimes(packageItem.activityTimes);

    if (packageItem.resources) {
      packageItem.resources.forEach((resource) => {
        const foundSpace = this._spaces.find(i => i.id === resource.resourceId);
        if (foundSpace) {
          foundSpace.selected = true;
        }
      });
    }
  }

  preloadActivityTimes(times) {
    const activityTimes = this.leaguesService.convertCourtWindowsToVM(times);

    if (!activityTimes.length) {
      this.activitiesArray.push(this.leaguesService.getActivityTimeGroupObject());
      return;
    }
    /**
     * Hack for supporting patching value of n length array
     * currently angular doesn't support this.
     * and we need to create the form groups beforehand
     */
    activityTimes.forEach((i) => {
      const itemGroup = this.leaguesService.getActivityTimeGroupObject();

      if (i.activityDates && i.activityDates.length > 1) {
        i.activityDates.forEach((date, dateIndex) => {
          // we want to skip the first item since it's already exist there
          if (dateIndex === 0) return;

          (itemGroup.get('activityDates') as FormArray).push(this.leaguesService.getActivityDateFormControl());
        });
      }

      (this.packageForm.get('activityDates') as FormArray).push(itemGroup);
    });

    this.packageForm.get('activityDates').patchValue(activityTimes);
  }


  get activitiesArray(): FormArray {
    return this.packageForm.get('activityDates') as FormArray;
  }

  activityDatesArray(form) {
    return form.get('activityDates') as FormArray;
  }

  decrementPrice() {
    if (this.packageForm.get('price').value < 1) return;

    this.packageForm.get('price').setValue(this.packageForm.get('price').value - 1);
  }

  incrementPrice() {
    this.packageForm.get('price').setValue(this.packageForm.get('price').value + 1);
  }

  selectDuration(length: number) {
    this.packageForm.get('duration').setValue(length);
    this.packageForm.get('customDuration').setValue(false);
  }
}

