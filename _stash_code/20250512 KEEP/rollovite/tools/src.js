/*
rollovite/tools/src.js
20250507
*/

/* NOTE Do NOT import modules that uses 'modules' here! */

/* Tool for managing files in '/src'. 
NOTE
- Primarily intended for use in 'modules'. */
export class Src {
  #config;

  #raw = new Set();
  #registry = new Map();

  constructor() {
    this.#config = new (class Config {
      #import;
      #raw;

      constructor() {
        this.#import = new (class Import {
          #registry = new Map();

          /* Specifies that files of given types should import a given module 
          member by name. Chainable.
          NOTE
          - Safe to use for 'default', but Vite may obfuscate other names? */
          add(spec) {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Frozen.`);
            }
            Object.entries(spec).forEach(([type, name]) =>
              this.#registry.set(type, name)
            );
            return this;
          }

          /* Returns name of module member. */
          get(type) {
            return this.#registry.get(type);
          }

          /* Freezes registry. Chainable. */
          freeze() {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Already frozen.`);
            }
            this.#registry = Object.freeze(this.#registry);
            return this;
          }
        })();

        this.#raw = new (class Raw {
          #registry = new Set();

          /* Returns supported file types.
          NOTE
          - Since an unfrozen registry could be mutated with unpredicatable 
            consequences, access to registry is only allowed once frozen. */
          get types() {
            if (!Object.isFrozen(this.#registry)) {
              throw new Error(`Cannot access unfrozen.`);
            }
            return this.#registry;
          }

          /* Registers one or more supported file types. Chainable. */
          add(...types) {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Frozen.`);
            }
            types.forEach((type) => this.#registry.add(type));
            return this;
          }

          /* Freezes registry. Chainable.
          NOTE
          - Call when registration complete. */
          freeze() {
            if (Object.isFrozen(this.#registry)) {
              throw new Error(`Already frozen.`);
            }
            this.#registry = Object.freeze(this.#registry);
            return this;
          }
        })();
      }

      /* Returns controller for associating import of given file types with 
      given odule members. */
      get import() {
        return this.#import;
      }

      /* Returns controller for forcing import of given file types to be 
      imported raw. */
      get raw() {
        return this.#raw;
      }
    })();
  }

  /* Returns config utility. */
  get config() {
    return this.#config;
  }

  /* Adds loaders. Chainable. */
  add(loaders, { raw = false } = {}) {
    Object.entries(loaders).forEach(([path, load]) => {
      this.#registry.set(create_key(raw, path), load);
    });
    return this;
  }

  /* Removes loaders. Chainable. */
  clear() {
    this.#registry.clear();
    return this;
  }

  /* Checks, if path (with/without raw) has been registered. */
  has(path, { raw = false } = {}) {
    path = normalize_path(path);
    const key = create_key(raw, path);
    return this.#registry.has(key);
  }

  /* Returns /src file import result. */
  async get(path, { raw = false } = {}) {
    const type = path.split(".").reverse()[0];
    path = normalize_path(path);
    /* */
    if (this.#config.raw.types.has(type)) {
      raw = true;
    }
    /* Create registry key */
    const key = create_key(raw, path);
    /* Get load function */
    const load = this.#registry.get(key);
    if (!load) {
      throw new Error(`Invalid key: ${key}`);
    }
    /* Call load function
    NOTE
    - Native Vite load functions do not take any params. 
      However, the load function may not be Vite-native.
      The load function is therefore called bound with useful args passed in. */

    const result = await load.call(this, { owner: this, path, raw });
    const name = this.#config.import.get(type);
    if (name) {
      return result[name];
    }

    return result;
  }

  /* Returns registered paths, optionally as per filter.
  Returns null, if none found.
  NOTE
  - Registered paths are returned as an array of normalized paths, 
    i.e., paths with the '@/'-syntax. */
  paths(filter) {
    /* Create array of normalized paths, i.e., paths with the '@/'-syntax */
    const paths = Array.from(this.#registry.keys(), (path) =>
      normalize_path(path)
    );
    if (filter) {
      const result = paths.filter(filter);
      return result.length ? result : null;
    }
    return paths;
  }

  /* Removed specific path from registry, with/without raw option.
  NOTE
  - 'path' should use the '@/'-syntax. */
  remove(path, { raw = false } = {}) {
    const key = create_key(raw, path);
    this.#registry.delete(key);
    return this;
  }

  /* Returns number registered paths, optionally as per filter. */
  size(filter) {
    if (filter) {
      const result = this.paths(filter);
      return result || 0;
    }
    return this.#registry.size;
  }
}

/* Returns cache key. */
function create_key(raw, path) {
  return raw ? `${path}?raw` : path;
}

/* Returns normalized interpretation of path, 
i.e., with the '@/'-syntax. */
function normalize_path(path) {
  return `/src/${path.slice("@/".length)}`;
}





