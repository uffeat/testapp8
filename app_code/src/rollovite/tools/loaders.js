/*
rollovite/tools/loaders.js
20250510
v.1.1
*/

import { factory } from "@/rollovite/tools/factory";

/* Returns Loaders class, optionally extended from parent. */
export const LoadersFactory = (parent = class {}) => {
  return class Loaders extends parent {
    static name = "Loaders";

    #factory = factory.call(this, "@");
    #frozen = false;
    #importer;
    #paths;
    #registry = new Map();

    constructor() {
      super();

      const owner = this;
      this.#importer = new (class Importer {
        create(base) {
          return new (class {
            #factory = factory.call(this);

            /* Imports and returns module or module default with Python-like syntax. */
            get path() {
              return this.#factory;
            }

            /* Imports and returns module or module default. */
            import(path, ...args) {
              return owner.import(`${base}/${path}`, ...args);
            }
          })();
        }
      })();
    }

    get frozen() {
      return this.#frozen;
    }

    /* Returns object, from which modules (or module defaults) can be imported 
    from a given base dir with string-based or Python-like syntax. 
    Enables shorter import statements. */
    get importer() {
      return this.#importer;
    }

    /* Imports and returns module or module default with Python-like syntax. */
    get path() {
      return this.#factory;
    }

    /* Registers loaders. Chainable. 
    NOTE
    - 'loaders' should typically be provided as objects returned by Vite's 
      'import.meta.glob' function, but can be provided as other objects with 
      similar shape. */
    add({ raw = false }, ...loaders) {
      /* NOTE
      - Rather than using Vite loader objects directly, these are copied into 
        a central registry. While this does involve a copy-step it also guards 
        against duplicate registration and provides initial path adaptation, 
        rather than at each retrieval. */
      loaders.forEach((loader) =>
        Object.entries(loader).forEach(([path, load]) => {
          const key = `@/${(raw ? path + "?raw" : path).slice("/src/".length)}`
          if (this.#registry.has(key)) {
            console.warn(`Overwriting key: ${key}`)
          }
          this.#registry.set(key, load);
        })
      );
      return this;
    }

    /* Imports and returns array of modules, optionally subject to filter. */
    async batch(filter) {
      const modules = [];
      for (const path of this.paths(filter)) {
        modules.push(await this.get(path)());
      }
      return modules;
    }

    /* Removes all loaders. Chainable 
    NOTE
    -  Cannot be used post-freeze. */
    clear() {
      this.#registry.clear();
      return this;
    }

    /* Returns object copy of registry.
    NOTE
    - Intended for debugging and special cases. */
    copy() {
      return Object.fromEntries(this.#registry.entries());
    }

    /* Prevents subsequent registry changes. Chainable. */
    freeze() {
      if (this.frozen) {
        throw new Error(`Frozen.`);
      }
      this.#frozen = true;
      /* Replace methods that can change registry with a chainable methods that logs an error */
      const factory = (key) => () => {
        console.warn(`'${key}' cannot be used post-freeze.`);
        return this;
      };
      const keys = ["add", "clear", "pop", "remove"];
      keys.forEach((key) => {
        Object.defineProperty(this, key, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: factory(key),
        });
      });
      return this;
    }

    /* Returns (async) load function. */
    get(path) {
      return this.#registry.get(path);
    }

    /* Checks, if path is in registry. */
    has(path) {
      return this.#registry.has(path);
    }

    /* Imports and returns module or module default. */
    async import(path, { name, raw } = {}) {
      if (raw && !path.endsWith("?raw")) {
        path += "?raw";
      }

      const load = this.get(path);
      if (load) {
        const module = await this.get(path)();
        if ("default" in module) {
          return module.default;
        }
        if (name) {
          return module[name];
        }
        return module;
      }

      return new Error(`Invalid path: ${path}`)
    }

    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      /* If frozen, paths do not need to be created at each call */
      if (!this.#paths && this.frozen) {
        this.#paths = Array.from(this.#registry.keys());
      }
      const paths = this.#paths || Array.from(this.#registry.keys());
      return filter ? paths.filter(filter) : paths;
    }

    /* Removes and returns load function (if registered).
    NOTE
    - Cannot be used post-freeze. */
    pop(path) {
      const load = this.#registry.get(path);
      if (load) {
        this.#registry.delete(path);
        return load;
      }
    }

    /* Removes one or more load functions. Chainable.
    NOTE
    -  Cannot be used post-freeze. */
    remove(...paths) {
      paths.forEach((path) => this.#registry.delete(path));
      return this;
    }

    /* Returns number of registered paths, optionally subject to filter. */
    size(filter) {
      return filter ? this.paths(filter).length : this.#registry.size;
    }
  };
};

/* Returns instance of Loaders, a utility for importing src files as per file 
type or as text (raw). 
NOTE
- Requires pre-use config with 'add'. */
export const Loaders = (...args) => new (LoadersFactory())(...args);




export const create = () => {
  const loaders = Loaders()
  .add(
    {},
    import.meta.glob("/src/test/**/*.css"),
    import.meta.glob("/src/test/**/*.html", { query: "?raw" }),
    import.meta.glob(["/src/test/**/*.js", "!/src/test/**/*.test.js"]),
    import.meta.glob("/src/test/**/*.json")
  )
  .add(
    { raw: true },
    import.meta.glob("/src/test/**/*.css", { query: "?raw" }),
    import.meta.glob("/src/test/**/*.js", { query: "?raw" }),
    import.meta.glob("/src/test/**/*.json", { query: "?raw" })
  )
  .freeze();
  return loaders

}