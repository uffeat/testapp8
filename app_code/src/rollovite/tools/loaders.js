export const LoadersFactory = (parent = class {}) => {
  return class Loaders extends parent {
    static name = "Loaders";

    #registry = new Map();

    constructor(...loaders) {
      super();
      this.add(...loaders);
    }

    /* Returns object, from which a module (or module default) can be imported 
    with Python-like syntax. */
    get path() {
      const self = this;
      let path = "@"
      return (function proxy() {
        return new Proxy(
          {},
          {
            get: (target, part) => {
              if (part.includes(":")) {
                return self.import(path + part.replaceAll(":", "."));
              }
              path += `/${part}`;
              return proxy();
            },
          }
        );
      })();
    }

    /* Registers loaders. */
    add(...loaders) {
      /* NOTE
      - Rather than using Vite's loader objects directly, these are copied into 
        a central registry. While this does involve a copy-step it also guards 
        against duplicate registration and provides initial adaption to the '@/'
        syntax, rather than at each retrieval. */
      loaders.forEach((loader) =>
        Object.entries(loader).forEach(([path, load]) =>
          this.#registry.set(`@/${path.slice("/src/".length)}`, load)
        )
      );
      return this;
    }

    /* Imports and returns array of modules, optionally subject to filter. */
    async batch(filter) {
      const modules = [];
      const paths = this.paths(filter);
      for (const path of paths) {
        const load = this.get(path);
        modules.push(await load());
      }
      return modules;
    }

    /* Imports and returns module or module default. */
    async import(path) {
      const load = this.get(path)
      const module = await load(path);
      if (typeof module === "object" && "default" in module) {
        return module.default;
      }
      return module;
    }

    /* Returns (async) load function for a given path. */
    get(path) {
      const load = this.#registry.get(path);
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      return load;
    }

    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      const paths = Array.from(this.#registry.keys());
      if (filter) {
        return paths.filter(filter);
      }
      return paths;
    }
  };
};

/* Returns instance of Loaders. */
export const Loaders = (...args) => new (LoadersFactory())(...args);
