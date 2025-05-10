/* Returns proxy factory.
NOTE
- Yep... it's a factory-factory :-) */
export function factory(root) {
  return function factory(path) {
    return new Proxy(this, {
      get: (_, part) => {
        if (!path) return factory.call(this, part);
        return part.includes(":")
          ? (options = {}) =>
              this.import(path + part.replaceAll(":", "."), options)
          : factory.call(this, path + `/${part}`);
      },
    });
  }.call(this, root);
}
