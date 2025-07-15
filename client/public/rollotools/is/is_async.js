/*
import { is_async } from "@/rollotools/is/is_async.js";
const { is_async } = await use("@/rollotools/is/is_async.js");
20250616
v.1.0
*/

/* Checks if a function is declared with the `async` keyword. */
export const is_async = (value) => {
  /* Async functions always start with 'async ' in their string representation. */
  return typeof value === "function" && value.toString().startsWith("async ");
};
