  /* Returns proxy factory.
NOTE
- Part of Rollo's import system.
- Yep... it's a factory-factory :-) */
  export function syntax(base = "@", executor) {
    return (function factory(path) {
      return new Proxy(
        {},
        {
          get: (_, part) =>
            part.includes(":")
              ? executor(path + part.replaceAll(":", "."))
              : factory(path + `/${part}`),
        }
      );
    })(base);
  }
