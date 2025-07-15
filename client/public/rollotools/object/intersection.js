/* Returns an object that represents entries that target and others share. 
NOTE
- Intended for flat objects with primitive values. */
export const intersection = (target, other) => {
  return Object.fromEntries(
    Object.entries(target).filter(
      ([k, v]) => k in other && other[k] === v
    )
  );
}

/* EXAMPLES

const target = {
  foo: "FOO",
  stuff: 42,
};

const other = {
  stuff: 42,
};

console.log(intersection(target, other)); // {stuff: 42}

*/