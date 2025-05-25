/* Returns an object derived from target subject to filtering of 
entries as per provided function. */
export const filter = (target, f) => {
  return Object.fromEntries(Object.entries(target).filter(f))
}

/* EXAMPLES

const target = {
    foo: "FOO",
    stuff: 42,
  };

console.log(filter(target, ([k, v]) => typeof v === 'number')); // {stuff: 42}

*/