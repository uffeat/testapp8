/*
import { remove } from "@/rollotools/array/remove.js";
20250616
v.1.0
*/

/* Removes one or more values from target by mutation. Returns target.
NOTE
- Intended for flat arrays with primitive values;
  could also used in other cases depending on specifics.
- If duplicate values, the the first value is removed.
- If value is not in target, nothing happens. */
export const remove = (target, ...values) => {
  /* If target array is empty or no values provided, return immediately */
  if (!target.length || !values.length) return target;
  
  /* Iterate backward to avoid index shifting issues */
  for (let i = target.length - 1; i >= 0; i--) {
    /** If current element is in values, remove it */
    if (values.includes(target[i])) {
      target.splice(i, 1); /* splice removes the element in-place */
    }
  }
  return target;
};

/* EXAMPLE

const target = [1, 2, 3];
remove(target, 2, 42);
console.log(target); // [1, 3]

*/
