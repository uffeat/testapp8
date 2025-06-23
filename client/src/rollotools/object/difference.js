/* Returns an object that represents entries that target has and others do not.
NOTE
- Intended for flat objects with primitive values. */
export const difference = (target, other) => {
  return Object.fromEntries(
    Object.entries(target).filter(
      ([k, v]) => other[k] !== v
    )
  );
};

/* EXAMPLES

const target = {
  foo: "FOO",
  stuff: 42,
};

const other = {
  stuff: 42,
};

console.log(difference(target, other));  // {stuff: 42}
*/