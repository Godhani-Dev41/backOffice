import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RCCustomQuestionType, RCQuestionTypesEnum, RCQuestionObject, RCQuestionnaireObject } from '@rcenter/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { RCServerResponse } from '../main';

@Injectable()
export class QuestionsFormService {

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {

  }

  getQuestionnaire(organizationId: number, questionnaireId: number): Observable<RCServerResponse<RCQuestionnaireObject>> {
    return this.http
      .get<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaire/${questionnaireId}`)
      .map(response => response);
  }

  createQuestionnaire(organizationId: number, questions: RCQuestionObject[], title: string) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaire-create`, {
        questions, title
      })
      .map(response => response);
  }

  updateQuestionnaire(organizationId: number, questionnaireId: number, questions: RCQuestionObject[], title: string) {
    return this.http
      .post<any>(`${environment.CS_URLS.API_ROOT}/organizations/${organizationId}/questionnaire-update`, {
        questionnaireId, questions, title
      })
      .map(response => response);
  }

  getQuestionFormObject(type = RCQuestionTypesEnum.OTHER, active = true, customType: RCCustomQuestionType = RCCustomQuestionType.TEXT) {
    return this.fb.group({
      id: '',
      questionType: type,
      isActive: active,
      isMandatory: true,
      toDelete: false,
      ordinal: '',
      customType: customType,
      text: '',
      question: [
        '',
        type === RCQuestionTypesEnum.OTHER ? Validators.compose([Validators.required, Validators.maxLength(50)]) : Validators.maxLength(50)
      ],
      maxLength: 150,
      selectOptions: this.fb.array([
        this.getAvailableOptionObject(),
        this.getAvailableOptionObject()
      ]),
      numericFrom: [1],
      numericTo: [12],
      dateType: 'single',
      dateFrom: '',
      dateTo: ''
    });
  }

  getAvailableOptionObject() {
    return this.fb.group({
      text: ['']
    });
  }

  getQuestionsFormObject() {
    return this.fb.group({
      questionsSettings: this.fb.group({
        title: ['', Validators.maxLength(100)],
        questions: this.fb.array([]),
        defaultWaiver: [false],
        waiver: ['', Validators.maxLength(50000)],
        waiverId: [''],
        mandatoryWaiver: true
      })
    });
  }

  addDefaultQuestions(form: FormGroup, dismiss?: { preferredTeam?: boolean, bDay?: boolean, tShirt?: boolean, }, addWaiver?: boolean) {
    (form.get('questions') as FormArray).push(
      this.getQuestionFormObject(RCQuestionTypesEnum.EMAIL_ADDRESS, false),
    );

    (form.get('questions') as FormArray).push(
      this.getQuestionFormObject(RCQuestionTypesEnum.PHONE_NUMBER, false)
    );

    (form.get('questions') as FormArray).push(
      this.getQuestionFormObject(RCQuestionTypesEnum.ADDRESS, false),
    );

    (form.get('questions') as FormArray).push(
      this.getQuestionFormObject(RCQuestionTypesEnum.CUSTOM_WAIVER, false)
    );

    if (!dismiss || !dismiss.preferredTeam) {
      (form.get('questions') as FormArray).push(
        this.getQuestionFormObject(RCQuestionTypesEnum.PREFERRED_TEAM, false),
      );
    }

    if (!dismiss || !dismiss.bDay) {
      (form.get('questions') as FormArray).push(
        this.getQuestionFormObject(RCQuestionTypesEnum.BIRTH_DATE, false),
      );
    }

    if (!dismiss || !dismiss.tShirt) {
      (form.get('questions') as FormArray).push(
        this.getQuestionFormObject(RCQuestionTypesEnum.T_SHIRT_SIZE, false)
      );
    }

    if (addWaiver) {
      (form.get('questions') as FormArray).push(
        this.getQuestionFormObject(RCQuestionTypesEnum.WAIVER, true)
      );
    }
  }

  prepareQuestionArray(data, waiver = false) {
    const questions: RCQuestionObject[] = data.questions.map((i, index) => {
      const question: RCQuestionObject = {
        id: i.id,
        isActive: i.isActive,
        question: i.question,
        isMandatory: i.isMandatory,
        questionType: i.questionType,
        ordinal: i.ordinal || index + 1,
        pageOrdinal: 1,
        toDelete: i.toDelete,
        metaData: {
          customType: null,
          text: null
        }
      };

      if (i.questionType === RCQuestionTypesEnum.PREFERRED_TEAM) {
        question.question = 'Preferred team';
      } else if (i.questionType === RCQuestionTypesEnum.BIRTH_DATE) {
        question.question = 'Birth date';
      } else if (i.questionType === RCQuestionTypesEnum.ADDRESS) {
        question.question = 'Address';
      } else if (i.questionType === RCQuestionTypesEnum.EMAIL_ADDRESS) {
        question.question = 'E-mail address';
      } else if (i.questionType === RCQuestionTypesEnum.PHONE_NUMBER) {
        question.question = 'Phone number';
      } else if (i.questionType === RCQuestionTypesEnum.T_SHIRT_SIZE) {
        question.question = 'T-shirt size';
      } else if (i.questionType === RCQuestionTypesEnum.CUSTOM_WAIVER) {
        question.question = 'T&C';
        question.metaData.text = i.text;
      } else if (i.questionType === RCQuestionTypesEnum.WAIVER) {
        question.question = 'Waiver';
        question.metaData.text = i.text;
        question.isActive = data.mandatoryWaiver;
      } else if (i.questionType === RCQuestionTypesEnum.OTHER) {
        question.metaData.customType = i.customType;

        if (i.customType === RCCustomQuestionType.DATE) {
          question.metaData.dateType = i.dateType;

          if (i.dateType === 'range') {
            question.metaData.fromDate = i.fromDate;
            question.metaData.toDate = i.toDate;
          }
        } else if (i.customType === RCCustomQuestionType.MULTIPLE_CHOICE || i.customType === RCCustomQuestionType.SINGLE_CHOICE) {
          question.metaData.selectOptions = i.selectOptions.filter(j => j.text);
        } else if (i.customType === RCCustomQuestionType.NUMERIC) {
          question.metaData.numericTo = i.numericTo;
          question.metaData.numericFrom = i.numericFrom;
        } else if (i.customType === RCCustomQuestionType.TEXT) {
          question.metaData.maxLength = i.maxLength;
        }
      }

      return question;
    });

    return questions;
  }

  validateQuestions(questions: RCQuestionObject[]) {
    if (!questions) return;
    let error;

    questions.forEach((i) => {
      if (i.questionType === RCQuestionTypesEnum.OTHER && i.isActive) {
        if (!i.question) {
          error = 'Question cannot be empty';
        }
      }
    });

    return error;
  }
}
