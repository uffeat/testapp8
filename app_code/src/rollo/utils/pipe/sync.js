/* Executes a series of pipe functions passing in one function result to the 
next function and returns the final result. */
export function pipe(value, ...funcs) {
  for (const func of funcs) {
    value = func(value);
  }
  return value;
}
/* Alternative version (not tested):
export function pipe(arg, ...pipe) {
  return pipe.reduce((acc, func) => func(acc), arg);
}
*/