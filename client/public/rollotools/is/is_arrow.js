/*
import { is_arrow } from "@/rollotools/is/is_arrow.js";
const { is_arrow } = await use("@/rollotools/is/is_arrow.js");
20250616
v.1.0
*/


/* Checks if a function is an arrow function. */
export const is_arrow = (value) => {
  /* Arrow functions lack a prototype and have an arrow (`=>`) in their string representation. */
  return (
    typeof value === "function" &&
    !value.hasOwnProperty("prototype") &&
    value.toString().includes("=>")
  );
};
