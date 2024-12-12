/* Assigns members from source to target. */
export const assign = (target, ...sources) =>
  sources.forEach((source) =>
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source))
  );


