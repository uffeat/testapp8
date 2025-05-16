/* Returns proxy factory.
NOTE
- Part of Rollo's import system.
- Yep... it's a factory-factory :-) */
export function syntax(base = "@", owner, type) {
  return (function factory(path) {
    return new Proxy(
      {},
      {
        get: (_, part) => {
          if (type && part === type) {
            return owner.import(`${path}.${part}`);
          }
          if (part.includes(":")) {
            return owner.import(path + part.replaceAll(":", "."));
          }
          if (!path) {
            return factory(part);
          }
          return factory(path + `/${part}`);
        },
      }
    );
  })(base);
}
