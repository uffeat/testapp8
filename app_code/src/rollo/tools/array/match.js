/* By default, tests, if target and other contain the same values in the same order.
If 'mode' is provided as a function, the function is used to compare each value, 
in such a way that a falsy result renders the match false.
If 'mode' is falsy, matching does not take into account order and duplicate values.
NOTE
- Intended for flat arrays with primitive values;
  could also used in other cases depending on specifics. */
  export const match = (target, other, mode = true) => {
    if (mode) {
      if (target.length !== other.length) return false;
      return target.every((value, index) =>
        typeof mode === 'function' ? mode(value, other[index], index) : value === other[index]
      );
    }
    /* falsy mode -> treat arrays as unordered sets */
    return new Set(target).symmetricDifference(new Set(other)).size === 0;
  };

/* EXAMPLES

console.log(match([1, 2, 3], [1, 2])); // false
console.log(match([1, 2, 3], [1, 2, 3])); // true
console.log(match([1, 2, 3], ['1', '2', '3'], (value, other) => value == other)); // true
console.log(match([1, 2, 3], [3, 2, 2, 1], false)); // true

*/
