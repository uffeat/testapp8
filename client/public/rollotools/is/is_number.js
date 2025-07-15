/*
import { is_number } from "@/rollotools/is/is_number.js";
const { is_number } = await use("@/rollotools/is/is_number.js");
20250616
v.1.0
*/

export const is_number = (value) => {
  return typeof value === "number" && !Number.isNaN(value);
}