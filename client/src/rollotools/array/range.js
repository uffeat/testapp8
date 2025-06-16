/*
import { range } from "@/rollotools/array/range.js";
20250616
v.1.0
*/


/* Returns range array. */
export const range = (size, f = (i) => i) => {
  const result = [];
  for (let i = 0; i < size; i++) {
    result.push(f(i, result));
  }
  return result;
};

/* EXAMPLES
console.log(range(3)); // [0, 1, 2]
console.log(range(3, (index) => 10*index+2)); // [2, 12, 22]

*/