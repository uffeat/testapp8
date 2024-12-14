/* Executes a series of potentially async pipe functions passing in one function 
result to the next function and returns the final result.  */
export async function pipe_async(value, ...funcs) {
  for (const func of funcs) {
    value = await func(value);
  }
  return value;
}
/* Alternative version (not tested):
export function run_pipe_sync(arg, ...pipe) {
  return pipe.reduce((acc, func) => func(acc), arg);
}
*/

/* Executes a series of pipe functions passing in one function result to the 
next function and returns the final result. */
export function pipe(value, ...funcs) {
  for (const func of funcs) {
    value = func(value);
  }
  return value;
}
/* Alternative version (not tested):
export async function run_pipe(arg, ...pipe) {
  return await pipe.reduce(async (accPromise, func) => func(await accPromise), Promise.resolve(arg));
}
*/
