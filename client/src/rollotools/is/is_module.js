/*
import { is_module } from "@/rollotools/is/is_module.js";
const { is_module } = await use("@/rollotools/is/is_module.js");
20250616
v.1.0
*/

/* Checks if ES Module.
NOTE
- Modules are the only native JS/browner objects, for which
  Object.getPrototypeOf() returns null. However, false positive for 
  rare cases, where objects are created as
    const value = Object.create(null)
  or
    Object.setPrototypeOf(value, null) */
export const is_module = (value) => {
  return Object.getPrototypeOf(value) === null;
}