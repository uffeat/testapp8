/* Returns proxy factory for enabling Python-like import syntax.
NOTE
- Rollo import engine member. 
- Can, but should typically not, be used stand-alone.
- Yep... it's a factory-factory :-) */
export function syntax(base, owner, terminate) {
  return (function factory(path) {
    return new Proxy(
      {},
      {
        get: (_, part) => {
          if (terminate?.(part)) {
            return owner.import(`${path}.${part}`);
          }
          if (part.includes(":")) {
            return owner.import(path + part.replaceAll(":", "."));
          }

          if (path === "/") {
            return factory(`/${part}`);
          }

          if (path === "") {
            return factory(part);
          }

          return factory(path + `/${part}`);
        },
      }
    );
  })(base);
}
