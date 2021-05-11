import { RCQuestionObject } from "./Questions";
export interface RCQuestionnaireObject {
    id?: number;
    organizationId?: number;
    title?: string;
    questions?: RCQuestionObject[];
}
