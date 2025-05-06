/* Util for managing src loaders. */
export class Src {
  #raw = new Set();
  #registry = new Map();

  /* Adds loaders. Chainable. */
  add(loaders, { raw = false } = {}) {
    Object.entries(loaders).forEach(([path, load]) => {
      this.#registry.set(raw ? `${path}?raw` : path, load);
      if (typeof raw === "string") {
        this.#raw.add(raw);
      }
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

  /* Returns import result. */
  async get(path, { raw = false } = {}) {
    const type = path.split(".").reverse()[0];
    path = normalize_path(path);
    /* */
    if (this.#raw.has(type)) {
      raw = true;
    }
    /* */
    const key = create_key(raw, path);
    /* */
    const load = this.#registry.get(key);
    if (!load) {
      throw new Error(`Invalid key: ${key}`);
    }
    /* */
    return await load.call(this, { owner: this, path, raw });
  }

  /* */
  paths(filter) {
    const paths = Array.from(this.#registry.keys(), (path) =>
      normalize_path(path)
    );
    if (filter) {
      const result = paths.filter(filter);
      return result.length ? result : null;
    }
    return paths;
  }

  /* */
  remove(path, { raw = false } = {}) {
    const key = create_key(raw, path);
    this.#registry.delete(key);
    return this;
  }

  /* */
  size(filter) {
    if (filter) {
      const result = this.paths(filter);
      return result || 0;
    }
    return this.#registry.size;
  }
}

function create_key(raw, path) {
  return raw ? `${path}?raw` : path;
}

function normalize_path(path) {
  return `/src/${path.slice("@/".length)}`;
}
