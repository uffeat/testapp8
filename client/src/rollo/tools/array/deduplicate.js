/* Returns a representation of source without duplicate values.
NOTE
- Intended for flat arrays with primitive values;
  could also used in other cases depending on specifics. */
export const deduplicate = (source) => {
  return Array.from((new Set(source)))
};

/* EXAMPLES
console.log(deduplicate([1, 2, 2, 3, 1])); // [1, 2, 3]

*/