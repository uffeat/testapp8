/*
import { Loaders } from "@/rollovite/tools/loaders.js";
v.1.2
20250512
*/

import { compose } from "@/rollo/tools/cls/compose.js";
import { importer } from "@/rollovite/factories/importer.js";
import { path } from "@/rollovite/factories/path.js";

class LoadersType extends compose(null, { base: "@" }, importer, path) {
  static name = "LoadersType";

  #registry;
  #store = new Map();

  #registries = {
    imported: new WeakMap(),
    loaders: new Map(),
  };

  constructor() {
    super();
    const owner = this;
    this.#registry = new (class {
      #frozen = false;
      #paths;

      get frozen() {
        return this.#frozen;
      }

      /* Registers loaders. Chainable. 
      NOTE
      - 'loaders' should typically be provided as objects returned by Vite's 
        'import.meta.glob' function, but can be provided as other objects with 
        similar shape, e.g.:
          { 'my_path': () => import(my_path) }
      - The 'raw' option should be set, if raw imports are needed for file types
        that Vite does not natively import as raw, including css, js and json.
        In 'import.meta.glob' the { query: "?raw" } option should be used 
        (without the 'add' {raw: true } option ) for file types that Vite's does 
        not natively support, e.g. html. These rules are funky and are best 
        illustrated by example;  see relevant test files. */
      add({ raw = false }, ...loaders) {
        /* NOTE
        - Rather than using loader objects directly, these are copied into 
          a central registry. While this does involve a copy-step it also guards
          against duplicate registration and provides initial path adaptation, 
          rather than at each retrieval. */
        loaders.forEach((loader) =>
          Object.entries(loader).forEach(([path, load]) => {
            /* NOTE
        - Objects created with 'import.meta.glob' and options (e.g., 
          { query: "?raw" }) do NOT carry these options into the path key.   
          To avoid registry overwrites, 'add' options are serialized
          and appended to the applied key. 'add' only supports a 'raw' option
          and this option is (sensibly) added to the path key by brute 
          force. */
            const key = `@/${(raw ? path + "?raw" : path).slice(
              "/src/".length
            )}`;
            if (owner.#store.has(key)) {
              console.warn(`Overwriting key: ${key}`);
            }
            owner.#store.set(key, load);
          })
        );
        return this;
      }

      /* Removes all loaders. Chainable 
      NOTE
      -  Cannot be used post-freeze. */
      clear() {
        owner.#store.clear();
        return this;
      }

      /* Returns object copy of registry.
      NOTE
      - Intended for debugging and special cases. */
      copy() {
        return Object.fromEntries(owner.#store.entries());
      }

      /* Prevents subsequent registry changes. Chainable. 
      NOTE
      - Also sets the 'frozen' flag, which can be used by other members to 
        optimize performance. */
      freeze() {
        if (this.frozen) {
          throw new Error(`Frozen.`);
        }
        this.#frozen = true;
        /* Replace methods that can change registry with chainable methods 
        that logs an error */
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
        return owner.#store.get(path);
      }

      /* Checks, if path is in registry. */
      has(path) {
        return owner.#store.has(path);
      }

      /* Returns array of registered paths, optionally subject to filter. */
      paths(filter) {
        /* If frozen, paths do not need to be created at each call */
        if (!this.#paths && this.frozen) {
          this.#paths = Array.from(owner.#store.keys());
        }
        const paths = this.#paths || Array.from(owner.#store.keys());
        return filter ? paths.filter(filter) : paths;
      }

      /* Removes and returns load function (if registered).
      NOTE
      - Cannot be used post-freeze. */
      pop(path) {
        const load = owner.#store.get(path);
        if (load) {
          owner.#store.delete(path);
          return load;
        }
      }

      /* Removes one or more load functions. Chainable.
      NOTE
      -  Cannot be used post-freeze. */
      remove(...paths) {
        paths.forEach((path) => owner.#store.delete(path));
        return this;
      }

      /* Returns number of registered paths, optionally subject to filter. */
      size(filter) {
        return filter ? owner.paths(filter).length : owner.#store.size;
      }
    })();
  }

  /* Returns controller for managing module registration. */
  get registry() {
    return this.#registry;
  }

  /* Imports and returns array of modules, optionally subject to filter. 
  NOTE
  - Primarily intended for side-effect imports, but does provide return. */
  async batch(filter) {
    const modules = [];
    for (const path of this.registry.paths(filter)) {
      modules.push(await this.registry.get(path)());
    }
    return modules;
  }

  /* Returns import.
  If path is invalid, an (unthrown) Error instance with the path as its message
  is returned. */
  async import(path, { name, raw } = {}) {
    /* XXX
    - Depending on config and file type, import options ('name' and 'raw') 
      could be ignored or result in error-return, e.g.:
      - Use of 'raw' for types that already import as raw (natively or 
        by config) will return an error.
      - Attempts to use 'name' for raw imports will silently be ignored.
      These issues are not critical, but usage does require a level of
      reasonable discipline.
    */

    if (raw && !path.endsWith("?raw")) {
      path += "?raw";
    }
    const load = this.registry.get(path);
    if (load) {
      const module = await load();

      if (name) {
        return module[name];
      }

      return module;
    }
    return new Error(path);
  }
}

/* Returns instance of Loaders, a utility for importing src files as per file 
type or as text (raw). 
NOTE
- Enables truly dynamic imports.
- Supports batch imports.
- Requires pre-use config with 'add'.
- Uses the '@/' syntax.
- Support 'importers' to enable shorter import statements for imports from a 
  given base dir. 
- Supports an alternative Python-like syntax, incl. for importers.
- Changes to code that uses 'Loaders' are NOT picked up by Vite's HMR, i.e., 
  manual browser refresh is required to pick up the changes. */
export const Loaders = () => new LoadersType();
