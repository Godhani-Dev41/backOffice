import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { QuestionsFormService } from '@app/shared/services/organization/quastionnaire.service';
import { RCCustomQuestionType, RCQuestionObject, RCQuestionTypesEnum } from '@rcenter/core';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Component({
  selector: 'questionnaire-edit-page',
  templateUrl: './questionnaire-edit-page.component.html',
  styleUrls: ['./questionnaire-edit-page.component.scss']
})
export class QuestionnaireEditComponent implements OnInit, OnDestroy {
  isCreate: boolean;
  questionsForm: FormGroup;
  destroy$ = new Subject<true>();
  organizationId: number;
  questionnaireId: number;
  title: string = '';
  questions: RCQuestionObject[] = [];
  loading: boolean;
  constructor(
    private questionsFormService: QuestionsFormService,
    private toastr: ToastrService,
    private router: Router,
    private _route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      this.isCreate = params.isCreate === 'true' ? true : false;
      this.organizationId = Number.parseInt(params.organizationId);
      this.questionnaireId = Number.parseInt(params.questionnaireId);
    });
    this.questionsForm = this.questionsFormService.getQuestionsFormObject();
    this.getQuestions();
  }

  getQuestions() {
    if (!this.isCreate && this.questionnaireId) {
      this.questionsFormService
        .getQuestionnaire(this.organizationId, this.questionnaireId)
        .subscribe((response) => {
          this.questions = response.data.questions;
          this.title = response.data.title;
          this.questionsForm.get('questionsSettings').get('title').setValue(this.title);
          this.populateOrgQuestions();
        });
    }
    else {
      this.populateOrgQuestions();
    }
  }

  populateOrgQuestions() {
    while ((this.questionsForm.get('questionsSettings').get('questions') as FormArray).value.length) {
      (this.questionsForm.get('questionsSettings').get('questions') as FormArray).removeAt(0);
    }

    // if there is only one question (usually a waiver) generate default ones
    if (!this.questions || !this.questions.length || this.questions.length === 1) {
      return this.questionsFormService.addDefaultQuestions(
        this.questionsForm.get('questionsSettings') as FormGroup, {},
        // add waiver if there's no default waiver question in the questionnaire
        this.questions.length === 0
      );
    }

    this.questions.forEach((q) => {
      const questionObject = this.questionsFormService.getQuestionFormObject(RCQuestionTypesEnum.OTHER);
      if (
        q.metaData &&
        (q.metaData.customType === RCCustomQuestionType.MULTIPLE_CHOICE || q.metaData.customType === RCCustomQuestionType.SINGLE_CHOICE)
      ) {
        if (q.metaData.selectOptions && q.metaData.selectOptions.length > 2) {
          _.times(q.metaData.selectOptions.length - 2, () => {
            (questionObject.get('selectOptions') as FormArray).push(this.questionsFormService.getAvailableOptionObject());
          });
        }
      }

      questionObject.patchValue({
        ...q,
        ...q.metaData,
        text: q.metaData.text
      });

      (this.questionsForm.get('questionsSettings').get('questions') as FormArray).push(questionObject);
    });


    const waiverFound = this.questions.find(i => i.questionType === RCQuestionTypesEnum.WAIVER);
    if (waiverFound) {
      this.questionsForm.get('questionsSettings').get('waiverId').setValue(waiverFound.id);
      this.questionsForm.get('questionsSettings').get('mandatoryWaiver').setValue(waiverFound.isActive);
    }

    const customWaiverFound = this.questions.find(i => i.questionType === RCQuestionTypesEnum.CUSTOM_WAIVER);

    if (!customWaiverFound) {
      const questionObject = this.questionsFormService.getQuestionFormObject(RCQuestionTypesEnum.CUSTOM_WAIVER, false);
      (this.questionsForm.get('questionsSettings').get('questions') as FormArray).push(questionObject);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }


  findInvalidControls(f: any) {
    const invalid = [];
    const controls = f.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  submit(data) {
    const questions = this.questionsFormService.prepareQuestionArray(data.questionsSettings, true);
    const title = data.questionsSettings.title;
    this.loading = true;
    if (this.isCreate) {
      this.questionsFormService.createQuestionnaire(this.organizationId, questions, title)
        .subscribe((response) => {
          this.router.navigate([`/client/organization/settings/forms`]);
          this.loading = false;
          this.toastr.success('Questions created');
        }, () => {
          this.loading = false;
          this.toastr.error('Error while creating questions');
        });
    }
    else {
      this.questionsFormService.updateQuestionnaire(this.organizationId, this.questionnaireId, questions, title)
        .subscribe((response) => {
          this.router.navigate([`/client/organization/settings/forms`]);
          this.loading = false;
          this.toastr.success('Questions updated');
        }, () => {
          this.loading = false;
          this.toastr.error('Error while updating questions');
        });
    }
  }
}
