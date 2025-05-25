/*
rollovite/tools/loaders.js
20250510
v.1.0
*/

import { factory } from "@/rollovite/tools/factory";

/* Returns Loaders class, optionally extended from parent. */
export const LoadersFactory = (parent = class {}) => {
  return class Loaders extends parent {
    static name = "Loaders";

    #factory = factory.call(this, "@");
    #importer;
    #registry = new Map();

    constructor(...loaders) {
      super();
      this.add(...loaders);

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
            import(path) {
              return owner.import(`${base}/${path}`);
            }
          })();
        }
      })();
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
    - 'loaders' should (typically) be provided as return values of Vite's 
      'import.meta.glob' function. */
    add(...loaders) {
      /* NOTE
      - Rather than using Vite loader objects directly, these are copied into 
        a central registry. While this does involve a copy-step it also guards 
        against duplicate registration and provides initial adaptation to the 
        '@/' syntax, rather than at each retrieval. */
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
      for (const path of this.paths(filter)) {
        modules.push(await this.get(path)());
      }
      return modules;
    }

    /* Removes all loaders. Chainable */
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

    /* Prevents subsequent addition of all loaders. Chainable */
    freeze() {
      Object.freeze(this.#registry);
      return this;
    }

    /* Returns (async) load function. */
    get(path) {
      const load = this.#registry.get(path);
      if (!load) {
        throw new Error(`Invalid path: ${path}`);
      }
      return load;
    }

    /* Checks, if path is in registry. */
    has(path) {
      return this.#registry.has(path);
    }

    /* Imports and returns module or module default. */
    async import(path, { name } = {}) {
      const module = await this.get(path)();
      if (typeof module === "object") {
        if ("default" in module) {
          return module.default;
        }
        if (name) {
          return module[name];
        }
      }
      return module;
    }

    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      return filter
        ? Array.from(this.#registry.keys().filter(filter))
        : Array.from(this.#registry.keys());
    }

    /* Removes and returns load function (if registered). */
    pop(path) {
      const load = this.#registry.get(path);
      if (load) {
        this.#registry.delete(path);
        return load;
      }
    }

    /* Removes one or more load functions. */
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

/* Returns instance of Loaders, a utility for importing src files. */
export const Loaders = (...args) => new (LoadersFactory())(...args);

