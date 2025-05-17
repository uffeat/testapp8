/*
import { Modules } from "@/rollovite/tools/modules.js";
20250517
v.3.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* */
class Base {
  #base;
  #processor = null;
  #proxy;
  #query;
  #type;

  constructor({ base, processor, query = "", type = "js" } = {}) {
    this.#base = base;
    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;
    /* Enable Python-like syntax */
    this.#proxy = syntax(base ? "" : "@", this, (part) => part === type);
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  /* Returns query. */
  get query() {
    return this.#query;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  /* Returns import. */
  async import(path) {
    /* Sanitize path */
    path = _path.call(this, path);
    /* Get load function from native path key */
    const load = this._get(path);
    /* Import */
    const result = await load();
    /* Process */
    const processor = this.processor();
    if (processor) {
      const processed = await processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns and/or configures processor.
  NOTE
  - Combined getter/setter for 'processor':
    - If no arg, returns Processor instance, or null, if not set up.
    - If source, creates, sets and returns Processor instance from function.
    - If null arg, removes processor.
  - 'source' should be a (optionally) async function with the signature:
      (this, result, { owner: this, key })
    Can also be an object with a 'call' method or a Processor instance.
  - Supports (exposed) caching.
  - Supports highly dynamic patterns. 
  - undefined processor results are ignored as a means to selective 
    processing. */
  processor(source) {
    if (source) {
      if (source instanceof Processor) {
        this.#processor = source;
      } else {
        this.#processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
    }
    return this.#processor;
  }
}

/* 
NOTE
- For global scope
- Zero registries beyond import map, therefore performant import. */
export class Modules extends Base {
  #registry;

  constructor(map, { processor, query = "", type = "js" } = {}) {
    super({ processor, query, type });
    this.#registry = map;
  }

  /* Returns paths, optionally filtered. 
  NOTE
  - Can be used for batch imports.
  - Consuming code should cache, if performance-critical. */
  paths(filter) {
    const paths = Object.keys(this.#registry);
    if (filter) {
      return paths.filter(filter);
    }
    return paths;
  }

  /* Returns load function. 
  NOTE
  - */
  _get(path) {
    const key = `/src/${path.slice("@/".length)}`;
    const load = this.#registry[key];
    /* Error, if invalid path */
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    return load;
  }
}

/* 
NOTE
- Intended for non-global scope
- Use with base */
export class LocalModules extends Base {
  #paths = [];
  #registry = new Map();

  constructor(map, { base, processor, query = "", type = "js" } = {}) {
    super({ base, processor, query, type });
    /* Check base */
    if (!base) {
      throw new Error(`'base' not provided`);
    }
    /* Build paths and registry from map */
    for (const [path, load] of Object.entries(map)) {
      /* Check type */
      if (type && !path.endsWith(`.${type}`)) {
        throw new Error(`Invalid type for path: ${path}`);
      }
      const key = path.slice("/src".length + base.length);
      this.#paths.push(key);
      this.#registry.set(key, load);
    }
    Object.freeze(this.#paths);
  }

  /* Batch-imports by filter. */
  async batch(filter) {
    const imports = [];
    const keys = this.paths(filter);
    for (const key of keys) {
      imports.push(await this.import(key));
    }
    return imports;
  }

  /* Returns import. */
  async import(path) {
    if (typeof path === "function") {
      return await this.batch(path);
    }
    return await super.import(path);
  }

  /* Returns paths, optionally filtered. */
  paths(filter) {
    if (filter) {
      return this.#paths.filter(filter);
    }
    return this.#paths;
  }

  /* Returns load function. 
  NOTE
  - */
  _get(path) {
    const load = this.#registry.get(path);
    /* Error, if invalid path */
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }

    return load
  }
}

/* Returns path with file type and without query. */
function _path(path) {
  /* Remove query */
  if (this.query && path.endsWith(this.query)) {
    path = path.slice(0, -this.query.length);
  }
  /* Add type */
  if (this.type && !path.endsWith(`.${this.type}`)) {
    path = `${path}.${this.type}`;
  }
  return path;
}
