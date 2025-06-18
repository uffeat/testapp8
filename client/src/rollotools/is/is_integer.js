/*
import { is_integer } from "@/rollotools/is/is_integer.js";
const { is_integer } = await use("@/rollotools/is/is_integer.js");
20250616
v.1.0
*/

export const is_integer = (value) => {
  return typeof value === "number" && Number.isInteger(value);
}