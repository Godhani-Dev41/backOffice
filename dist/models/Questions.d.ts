import { RCEntities } from './Utils';
export declare enum RCCustomQuestionType {
    TEXT,
    YES_NO,
    MULTIPLE_CHOICE,
    NUMERIC,
    DATE,
    SINGLE_CHOICE,
    FILE_UPLOAD,
}
export declare enum RCQuestionTypesEnum {
    OTHER,
    T_SHIRT_SIZE,
    PHONE_NUMBER,
    EMAIL_ADDRESS,
    ADDRESS,
    BIRTH_DATE,
    PREFERRED_TEAM,
    WAIVER,
    CUSTOM_WAIVER,
}
export interface RCQuestionObject {
    id?: number;
    creatorId?: number;
    creatorType?: RCEntities;
    questionType: RCQuestionTypesEnum;
    ordinal: number;
    pageOrdinal: number;
    isActive: boolean;
    isMandatory: boolean;
    metaData?: {
        customType?: RCCustomQuestionType;
        text?: string;
        fromDate?: Date;
        toDate?: Date;
        numericFrom?: number;
        numericTo?: number;
        maxLength?: number;
        selectOptions?: {
            text: string;
        }[];
        dateType?: 'range' | 'singleDate';
    };
    question: string;
    toDelete?: boolean;
    questionnaireId?: number;
}
