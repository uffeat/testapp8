/*
import { is_module } from "@/rollo/tools/is/is_module.js";
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