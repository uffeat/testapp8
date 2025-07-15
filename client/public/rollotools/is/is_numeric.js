/*
import { is_numeric } from "@/rollotools/is/is_numeric.js";
const { is_numeric } = await use("@/rollotools/is/is_numeric.js");
20250616
v.1.0
*/

/* Checks if value contains only digits - allowing for a single decimal mark 
('.' or ',') and a leading '-'. Also allows null. */
export const is_numeric = (value) => {
  if (value === null || value === "") {
    return true;
  }
  const pattern = /^-?\d*[.,]?\d*$/;
  return pattern.test(value);
};
