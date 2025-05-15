// import { range } from "@/rollo/tools/range";
// const { range } = await import("@/rollo/tools/range");

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