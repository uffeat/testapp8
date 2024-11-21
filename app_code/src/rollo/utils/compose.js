/* Use with small source classes. */
export function compose(...sources) {
  for (const source of sources) {
    const composition = new source(this);
    if (!source.name) {
      throw new Error(
        `Composition class should be declared with a name or have a static 'name' prop.`
      );
    }
    Object.defineProperty(this, source.name, {
      enumerable: false,
      configurable: true,
      get: () => composition,
    });
  }
  return this;
}