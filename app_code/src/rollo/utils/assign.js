/* Assigns members from source to target. */
export function assign(target, ...sources) {
  sources.forEach((source) =>
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
  );
  return target
}
  


