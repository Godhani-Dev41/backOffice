
import {takeUntil} from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, Validators } from '@angular/forms';
import { RCQuestionTypesEnum, RCCustomQuestionType } from '@rcenter/core';

import {
  QuestionsFormService
} from '@app/shared/services/organization/quastionnaire.service';
import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';

@Component({
  selector: 'rc-org-questions-edit-form',
  templateUrl: './org-questions-edit-form.component.html',
  styleUrls: ['./org-questions-edit-form.component.scss']
})
export class OrgQuestionsEditFormComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup;
  @Input() hideWaiver: boolean;
  @Input() questionDescription: boolean;
  @Output() onQuestionAdd = new EventEmitter();
  RCQuestionTypesEnum = RCQuestionTypesEnum;
  RCCustomQuestionType = RCCustomQuestionType;
  destroy$ = new Subject<true>();

  get questionsArray() {
    return this.formGroup.get('questions') as FormArray;
  }

  get waiverQ() {
    return (this.formGroup.get('questions') as FormArray).controls.find(c => c.value.questionType == "waiver");
  }

  constructor(
    private dragulaService: DragulaService,
    private questionsFormService: QuestionsFormService
  ) { }

  ngOnInit() {
    // this will make sure the form array was updated with relevant ordinals
    this.dragulaService.dropModel.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.questionsArray.controls.forEach((i, index) => {
        i.get('ordinal').setValue(index + 1);
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  addCustomQuestions() {
    this.questionsArray.push(this.questionsFormService.getQuestionFormObject(RCQuestionTypesEnum.OTHER));
    this.onQuestionAdd.emit();
  }

  getOptionsControl(control: FormGroup): FormArray {
    return control.get('selectOptions') as FormArray;
  }

  addAvailableOption(control: FormGroup) {
    (control.get('selectOptions') as FormArray).push(this.questionsFormService.getAvailableOptionObject());
  }

  removeAvailableOption(control: FormArray, index) {
    control.removeAt(index);
  }

  removeQuestion(control: FormGroup) {
    control.get('toDelete').setValue(true);
    control.get('question').clearValidators();
    control.get('question').updateValueAndValidity();
  }

  toggleChanged(control: FormGroup) {
    const value = control.get('isActive').value;

    if (control.get('questionType').value === this.RCQuestionTypesEnum.OTHER) {
      if (!value) {
        control.get('question').clearValidators();
        control.get('question').updateValueAndValidity();
      } else {
        control.get('question').setValidators(Validators.compose([Validators.required, Validators.maxLength(50)]));
        control.get('question').updateValueAndValidity();
      }
    }
  }
}
