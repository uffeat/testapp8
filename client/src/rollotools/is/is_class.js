/*
import { is_class } from "@/rollotools/is/is_class.js";
const { is_class } = await use("@/rollotools/is/is_class.js");
20250616
v.1.0
*/

/* Tests if a value is a class (excluding plain functions). */
export const is_class = (value) => {
  if (typeof value !== "function") return false;
  /* Classes cannot be called without 'new', so they lack [[Call]] in their descriptors.
  Attempting to call a class constructor directly results in a TypeError. */
  try {
    value();
    /* If callable without 'new', it's a regular function. */
    return false; 
  } catch (err) {
    /* Expected error indicates a class. */
    return err instanceof TypeError; 
  }
};
