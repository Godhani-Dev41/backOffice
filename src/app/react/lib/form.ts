import { TranslationEn } from "assets/i18n/en";
import { FieldValidator } from "final-form";

export const required: FieldValidator<unknown> = (value) => {
  return value ? undefined : "Required";
};

export const capitalize = (s: string) => {
  if (typeof s !== "string") {
    return "";
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const Pricify = (price?: number) => {
  if (price) {
    if (price > 0) {
      return `${TranslationEn.currency.USD.symbol}${price.toFixed(2)}`;
    } else {
      return `-${TranslationEn.currency.USD.symbol}${(price * -1).toFixed(2)}`;
    }
  } else {
    return "-";
  }
};
