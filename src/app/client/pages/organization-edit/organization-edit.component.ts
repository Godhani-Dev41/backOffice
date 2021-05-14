
import {forkJoin,  Subscription } from 'rxjs';
import { Component, HostBinding, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCOrganization, RCLinkedAccountStatus } from '@rcenter/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { RCParsedAddress } from '@app/shared/services/utils/location.service';
import { FileItem } from 'ng2-file-upload';
import { PortalService } from '@app/shared/services/portal/portal.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'ng2-validation';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AnalyticsService } from '@app/shared/services/utils/analytics.service';
import { ActionSuccessModalComponent } from '@app/shared/components/action-success-modal/action-success-modal.component';
import { RCSportItem } from '@app/shared/services/utils/sports.service';

@Component({
  selector: 'rc-organization-edit',
  templateUrl: './organization-edit.component.html',
  styleUrls: ['./organization-edit.component.scss']
})
export class OrganizationEditComponent implements OnInit, OnDestroy {
  currentOrg$: Subscription;
  organization: RCOrganization;
  brandColor = '#127bdc';
  organizationForm: FormGroup;
  loading: boolean;
  signupMode: boolean;
  @ViewChild('tickerTextInput') tickerTextInput;
  @ViewChild('actionSuccessModal', { static: true }) actionSuccessModal: ActionSuccessModalComponent;
  get tickerTexts(): FormArray {
    return this.organizationForm.get('newsTicker') as FormArray;
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private portalService: PortalService,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private vRef: ViewContainerRef,
    private router: Router,
    private analytics: AnalyticsService
) {

  }

  ngOnInit() {
    this.analytics.trackEvent('page:settings:open');


    if (this.activatedRoute.snapshot.queryParams['signup']) {
      this.signupMode = true;
    }

    this.organizationForm = this.fb.group({
      name: '',
      about: ['', Validators.compose([CustomValidators.rangeLength([0, 2000])])],
      email: ['', Validators.compose([ Validators.required ])],
      phoneNumber: '',
      addressString: '',
      tagline: '',
      sports: '',
      website: ['', CustomValidators.url],
      instagram: ['', CustomValidators.url],
      facebook: ['', CustomValidators.url],
      twitter: ['', CustomValidators.url],
      blog: ['', CustomValidators.url],
      address: '',
      brandColor: '',
      orgLogo: '',
      orgMain: '',
      webBanner: '',
      newsTicker: this.fb.array([])
    });

    this.loading = true;
    this.currentOrg$ = this.authService.currentOrganization.subscribe((userOrg) => {
      this.organizationService.getOrganizationById(userOrg.id).subscribe((response) => {
        this.organization = response.data;

        if (!this.organization.webPortal) {
          this.toastr.error('No web entity found. contact support');
        }

        this.loading = false;

        this.organizationForm.patchValue({
          website: this.organization.website,
          email: this.organization.email,
          name: this.organization.name,
          phoneNumber: this.organization.phoneNumber,
          about: this.organization.about,
          tagline: this.organization.tagline,
          twitter: this.organization.twitter,
          instagram: this.organization.instagram,
          blog: this.organization.blog,
          facebook: this.organization.facebook,
          sports: this.organization.sports
        });

        if (this.organization.webPortal) {
          if (this.organization.webPortal.portalConfig && this.organization.webPortal.portalConfig.colors) {
            this.organizationForm
              .get('brandColor')
              .setValue(this.organization.webPortal.portalConfig.colors.mainColor);
            this.brandColor = this.organization.webPortal.portalConfig.colors.mainColor;

            const tickersArray = this.fb
              .array(this.organization.webPortal.portalConfig.newsTicker.map(i => this.fb.group({ ...i })));

            this.organizationForm
              .setControl('newsTicker', tickersArray);
          }
        }

        if (this.organization.address) {
          this.organizationForm.patchValue({
            addressString: `${
              this.organization.address.street || ''
            } ${this.organization.address.city || ''}, ${this.organization.address.state || ''}`,
            address: this.organization.address
          });
        }

      }, () => this.finishSubmit('Error occurred while fetching organization'));
    });
  }

  ngOnDestroy() {
    this.currentOrg$.unsubscribe();
  }

  brandColorChanged(color: string) {
    this.brandColor = color;
    this.organizationForm.get('brandColor').setValue(color);
  }

  addTickerText(text: string) {
    if (!text) return;

    this.tickerTextInput.nativeElement.value = '';
    this.tickerTexts.push(this.fb.group({
      text
    }));
  }

  removeTickerText(index: number) {
    this.tickerTexts.removeAt(index);
  }

  onAddressSelect(address: RCParsedAddress) {
    this.organizationForm.patchValue({
      addressString: `${address.street || ''} ${address.city}, ${address.state}`,
      address
    });
  }

  imageChanged(type: 'orgLogo' | 'orgMain' | 'webBanner', file: FileItem) {
    if (type === 'orgLogo') {
      this.organizationForm.patchValue({
        orgLogo: file
      });
    } else if (type === 'orgMain') {
      this.organizationForm.patchValue({
        orgMain: file
      });
    } else if (type === 'webBanner') {
      this.organizationForm.patchValue({
        webBanner: file
      });
    }
  }

  submit(data) {
    if (this.loading) return;
    const organizationData = {
      ...data
    };

    delete organizationData.orgLogo;
    delete organizationData.orgMain;
    delete organizationData.webBanner;

    this.loading = true;

    this.organizationService.updateOrganization(this.organization.id, organizationData).subscribe((response) => {
      this.portalService.updatePortal(this.organization.webPortal.id, {
        portalConfig: {
          newsTicker: data.newsTicker,
          colors: {
            mainColor: data.brandColor
          }
        }
      }).subscribe(() => {
        const imagesUploadTasks = [];

        if (data.orgMain) {
          this.analytics.trackEvent('organization-settings:main-image:upload');
          imagesUploadTasks.push(this.organizationService.uploadOrganizationMedia(data.orgMain, this.organization));
        }

        if (data.orgLogo) {
          this.analytics.trackEvent('organization-settings:logo:upload');
          imagesUploadTasks.push(this.organizationService.uploadOrganizationMedia(data.orgLogo, this.organization, 'logo'));
        }

        if (data.webBanner) {
          this.analytics.trackEvent('organization-settings:banner-image:upload');
          imagesUploadTasks.push(this.portalService.updatePortalBanner(data.webBanner, this.organization.webPortal.id));
        }

        if (!imagesUploadTasks.length) return this.finishSubmit();

        forkJoin(imagesUploadTasks).subscribe(() => {
          this.finishSubmit();
        }, () => {
          this.finishSubmit('Error Uploading Photos');
        });
      }, () => this.finishSubmit('Error while saving web config data'));
    }, () => this.finishSubmit('Error while saving organization data'));
  }

  finishSubmit(err?: string) {
    this.loading = false;

    if (err) {
      this.toastr.error(err);
      return;
    }

    this.analytics.trackEvent('organization-settings:save');

    this.authService.fetchActiveOrganization().subscribe(() => {
      this.toastr.success('Successfully updated');
    });

    if (this.signupMode) {
      this.actionSuccessModal.showModal();
    }
  }

  sportsChanged(sports: RCSportItem[]) {
    this.organizationForm.patchValue({
      sports: sports.map(i => i.id)
    });
  }

  goToCreateVenue() {
    this.router.navigate(['/client/facilities/venue-creator']);
  }

  goToDashboard() {
    this.router.navigate(['/client']);
  }
}
