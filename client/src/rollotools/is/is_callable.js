/*
import { is_callable } from "@/rollotools/is/is_callable.js";
const { is_callable } = await use("@/rollotools/is/is_callable.js");
20250616
v.1.0
*/

/* Tests if a value is a function or an object with a call member (presumed a method). */
export const is_callable = (value) => {
  return typeof value === "function" || (value === "object" && value.call);
};
