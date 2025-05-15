/* Checks, if target and other contains the same entries. 
NOTE
- Intended for flat objects with primitive values. */
export const match = (target, other) => {
  if (Object.keys(target).length !== Object.keys(other).length) return false;
  for (const [key, value] of Object.entries(target)) {
    if (other[key] !== value) return false;
  }
  return true;
};

/* EXAMPLES

const target = {
  foo: 8,
  bar: 42,
};

const other = {
  foo: 8,
  bar: 42,
}

console.log(match(target, other)); // true

*/
