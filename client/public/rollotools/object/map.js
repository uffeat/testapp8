/*

*/

/* Returns an object derived from mapping target entries as per provided function. 
NOTE
- Intended for flat objects with primitive values. */
export const map = (target, f) => {
  return Object.fromEntries(Object.entries(target).map(f))
}

/* EXAMPLES

const target = {
  foo: 21,
  bar: 42,
};

console.log(map(target, ([k, v]) => [k, 2 * v])); // {foo: 42, bar: 84}

*/