
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCOrganization, RCQuestionnaireObject } from '@rcenter/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment';

@Component({
  selector: 'rc-organization-settings-registration-page',
  templateUrl: './organization-settings-registration-page.component.html',
  styleUrls: ['./organization-settings-registration-page.component.scss']
})
export class OrganizationSettingsRegistrationPageComponent implements OnInit, OnDestroy {

  add_membership_qstnr: boolean;
  loading: boolean;
  organization: RCOrganization;
  destroy$ = new Subject<true>();
  orgQuestionnaires: RCQuestionnaireObject[];
  orgSettingsForm: FormGroup;
  constructor(
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private organizationService: OrganizationsService,

  ) {

  }

  ngOnInit() {
    this.authService.currentOrganization.pipe(takeUntil(this.destroy$)).subscribe((organization) => {
      this.organization = organization;
      if (!this.organization) return;

      this.organizationService
        .getOrganizationQuestionnaires(this.organization.id)
        .subscribe((response) => {
          this.orgQuestionnaires = response.data;
          if (this.organization.questionnaireId) {
            this.orgSettingsForm.get('questionnaireId').setValue(this.organization.questionnaireId);
          }
        });
    });

    this.orgSettingsForm = new FormGroup({
      questionnaireId: new FormControl('questionnaireId')
    });

    this.orgSettingsForm.get('questionnaireId').valueChanges.subscribe((questionnaireId) => {
      if (!this.orgQuestionnaires) return;
      if (questionnaireId === "") {
        this.organizationService.deleteQuestionnaire(this.organization.id)
          .subscribe((response) => {
            this.organization.questionnaireId = response.data.questionnaireId;
          });
      }
      else {
        this.organizationService.setQuestionnaire(this.organization.id, questionnaireId)
          .subscribe((response) => {
            this.organization.questionnaireId = response.data.questionnaireId;
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  getWaiverUrl() {
    if (this.organization) {
      return `${environment.CONSUMER_SITE_URL}/${encodeURIComponent(this.organization.name.replace(/ /g, "-"))}/${this.organization.id}/general_waiver`;
    } else {
      return '';
    }
  }
}
