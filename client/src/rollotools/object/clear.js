/* Removes all entries from target and returns target. */
export const clear = (target) => {
  Object.keys(target).forEach(k => delete target[k]);
  return target;
};

/* EXAMPLES

const target = {
  foo: "FOO",
  stuff: 42,
};

console.log(clear(target)); // {}
*/