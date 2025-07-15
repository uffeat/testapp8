/* Resets all values in target to a given value and returns target. */
export const reset = (target, value) => {
  const keys = Object.keys(target);
  if (!keys.length) return target; // Skip iteration if empty

  keys.forEach(k => target[k] = value);
  return target;
};

/* EXAMPLES

const target = {
  foo: 8,
  bar: 42,
};

console.log(reset(target, true)); // {foo: true, bar: true}

*/