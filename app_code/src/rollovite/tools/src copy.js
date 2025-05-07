/*
rollovite/tools/src.js
20250506
*/

/* NOTE Do NOT import modules that uses 'modules' here! */

/* Util for managing src loaders. */
export class Src {
  #raw = new Set();
  #registry = new Map();

  /* Adds loaders. Chainable. */
  add(loaders, { raw = false } = {}) {
    Object.entries(loaders).forEach(([path, load]) => {
      this.#registry.set(raw ? `${path}?raw` : path, load);
      if (typeof raw === "string") {
        /* NOTE
        - string -> Cue to always import raw */
        this.#raw.add(raw);
      }
    });
    return this;
  }

  /* Removes loaders. Chainable. */
  clear() {
    this.#registry.clear();
    this.#raw.clear();
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
    if (this.#raw.has(type)) {
      /* NOTE
      - string -> Always import raw regardless of arg */
      raw = true;
    }
    /* Create cache key */
    const key = create_key(raw, path);
    /* get load function */
    const load = this.#registry.get(key);
    if (!load) {
      throw new Error(`Invalid key: ${key}`);
    }
    /* Call load function
    NOTE
    - Native Vite load functions do not take any params. 
      However, the load function may not be Vite-native.
      The load functions is therefore called bound with useful args passed in. */
    return await load.call(this, { owner: this, path, raw });
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
