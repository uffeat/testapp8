/*
import { is_child } from "@/rollotools/is/is_child.js";
const { is_child } = await use("@/rollotools/is/is_child.js");
20250616
v.1.0
*/



/* Checks if a value can be used as an argument in append(value)`. */
export const is_child = (value) =>
  value instanceof Node || ["number", "string"].includes(typeof value);
