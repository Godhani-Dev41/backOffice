import { GenderEnum } from "@app/shared/services/programs/programs.service";

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  gender: GenderEnum;
  birthDate: Date;
}
