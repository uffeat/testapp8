/* Executes a series of potentially async pipe functions passing in one function 
result to the next function and returns the final result.  */
export async function pipe(value, ...funcs) {
  for (const func of funcs) {
    value = await func(value);
  }
  return value;
}
/* Alternative version (not tested):
export async function pipe(value, ...funcs) {
  return await funcs.reduce(async (accPromise, func) => func(await accPromise), Promise.resolve(value));
}
*/
