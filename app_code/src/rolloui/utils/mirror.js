/* Assigns getter/setters to target that mirror those of source.
Useful, when authoring wrapper function components. */
export function mirror(target, source, ...keys) {
  for (const key of keys) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: false,
      get: () => source[key],
      set: (v) => {
        source[key] = v;
      },
    });
  }
}