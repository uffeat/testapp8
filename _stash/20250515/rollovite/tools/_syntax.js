  /* Returns proxy factory.
NOTE
- Part of Rollo's import system.
- Yep... it's a factory-factory :-) */
  export function syntax(base = "@") {
    return (function factory(path) {
      return new Proxy(
        {},
        {
          get: (_, part) =>
            part.includes(":")
              ? use(path + part.replaceAll(":", "."))
              : factory(path + `/${part}`),
        }
      );
    })(base);
  }
