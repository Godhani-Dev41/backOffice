import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCOrganization, RCQuestionnaireObject } from '@rcenter/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'rc-organization-settings-forms',
  templateUrl: './organization-settings-forms.component.html',
  styleUrls: ['./organization-settings-forms.component.scss']
})
export class OrganizationSettingsFormsComponent implements OnInit, OnDestroy {
  organization: RCOrganization;
  orgQuestionnaires: RCQuestionnaireObject[];
  destroy$ = new Subject<true>();
  loading = false;
  constructor(
    private organizationService: OrganizationsService,
    private authService: AuthenticationService,
  ) {

  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  ngOnInit() {
    this.loading = true;
    this.authService.currentOrganization.pipe(
        takeUntil(this.destroy$)
    ).subscribe((organization) => {
      this.organization = organization;
      if (!this.organization) return;

      this.organizationService
        .getOrganizationQuestionnaires(this.organization.id)
        .subscribe((response) => {
          this.orgQuestionnaires = response.data;
          this.loading = false;
        });
    });
  }

}
