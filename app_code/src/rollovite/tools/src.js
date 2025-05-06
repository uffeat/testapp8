/* Util for managing src loaders. */
export class Src {
  #raw = new Set();
  #registry = new Map();

  constructor() {}

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

  /* */
  clear() {
    throw new Error(`Not yet implemented.`);
  }

  /* */
  remove(path, { raw = false } = {}) {
    throw new Error(`Not yet implemented.`);
  }

  /* */
  has(path, { raw = false } = {}) {
    path = this.#normalize_path(path);
    const key = this.#create_key(raw, path);
    return this.#registry.has(key);
  }

  /* Returns import result. */
  async get(path, { raw = false } = {}) {
    const type = path.split(".").reverse()[0];
    path = this.#normalize_path(path);

    if (this.#raw.has(type)) {
      raw = true;
    }

    const key = this.#create_key(raw, path);

    const load = this.#registry.get(key);
    if (!load) {
      throw new Error(`Invalid key: ${key}`);
    }

    return await load.call(this, { owner: this, path, raw });
  }

  #create_key(raw, path) {
    return raw ? `${path}?raw` : path;
  }

  #normalize_path(path) {
    return `/src/${path.slice("@/".length)}`;
  }

  //
  //
  get __registry__() {
    return this.#registry;
  }
}
