/* Calls provided function on each entry of target and returns target. */
export const each = (target, f) => {
  Object.entries(target).forEach(f);
  return target;
};


/* EXAMPLES

let result = 0;
const target = {
  foo: 21,
  stuff: 42,
};
each(target, ([k, v]) => (result += v));
console.log(result);  // 63

*/