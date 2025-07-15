/*
import { capitalize } from "@/rollotools/text/capitalize.js";
20250616
v.1.0
*/

export const capitalize = (text) => {
  if (text.length > 0) {
    text = text[0].toUpperCase() + text.slice(1);
  }
  return text;
};
