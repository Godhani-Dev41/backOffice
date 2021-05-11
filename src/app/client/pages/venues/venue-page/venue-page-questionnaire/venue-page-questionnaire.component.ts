
import {takeUntil} from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { OrganizationsService } from '@app/shared/services/organization/organizations.service';
import { AuthenticationService } from '@app/shared/services/auth/authentication.service';
import { RCOrganization, RCQuestionObject, RCVenue, RCQuestionnaireObject } from '@rcenter/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { VenuesService } from '@app/shared/services/venues/venues.service';

@Component({
  selector: 'rc-venue-page-questionnaire',
  templateUrl: './venue-page-questionnaire.component.html',
  styleUrls: ['./venue-page-questionnaire.component.scss']
})
export class VenuePageQuestionnaireComponent implements OnInit, OnDestroy {
  loading: boolean;
  venue: RCVenue;
  destroy$ = new Subject<true>();
  orgQuestionnaires: RCQuestionnaireObject[];
  facilitySettingForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthenticationService,
    private venuesService: VenuesService,
    private organizationService: OrganizationsService,
    private vRef: ViewContainerRef
  ) {

  }

  ngOnInit() {
    this.venuesService.currentVenue.pipe(takeUntil(this.destroy$)).subscribe((venue) => {
      this.venue = venue;
      if (!this.venue) return;
      this.organizationService
        .getOrganizationQuestionnaires(this.venue.organizationCreator.id)
        .subscribe((response) => {
          this.orgQuestionnaires = response.data;
          if (this.venue.questionnaireId) {
            this.facilitySettingForm.get('questionnaireId').setValue(this.venue.questionnaireId);
          }
        });
    });

    this.facilitySettingForm = new FormGroup({
      questionnaireId: new FormControl('questionnaireId')
    });

    this.facilitySettingForm.get('questionnaireId').valueChanges.subscribe((questionnaireId) => {
      if (!this.orgQuestionnaires) return;
      if (questionnaireId === "") {
        this.venuesService.unsetQuestionnaire(this.venue.id)
          .subscribe((response) => {
            this.venue.questionnaireId = response.data.questionnaireId;
          });
      }
      else {
        this.venuesService.setQuestionnaire(this.venue.id, questionnaireId)
          .subscribe((response) => {
            this.venue.questionnaireId = response.data.questionnaireId;
          });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }
}
