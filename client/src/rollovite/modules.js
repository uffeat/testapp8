/*
import { Base, Modules } from "@/rollovite/tools/modules.js";
20250518
v.3.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Base class for Vite import map controller.
NOTE
- Rollo import engine member. */
export class Base {
  #_ = {};


  __new__({ base, get, processor, query = "", type = "js" }) {
    this.#_.base = base;
    this.#_.get = get;
    this.#_.query = query;
    this.#_.type = type;

    if (processor) {
      const source = processor;
      this.#_.processor = new Processor(this, source);
    }

    /* Prevent __new__ from being called again */
    delete this.__new__;
  }

  /* Returns base. */
  get base() {
    return this.#_.base;
  }

  /* Returns key. 
  NOTE
  - Convenient for aggregators. */
  get key() {
    return `${this.type}${this.query}`;
  }

  /* Returns processor. */
  get processor() {
    return this.#_.processor;
  }

  /* Returns query. 
  NOTE
  - Critial for aggregators that 'no query' is an empty string! */
  get query() {
    return this.#_.query || "";
  }

  /* Returns type. */
  get type() {
    return this.#_.type || "js";
  }

  /* Returns import. */
  async import(path) {
    /* Remove query 
    NOTE
    - Critial for aggregators that 'import' can be called with query! */
    if (this.query && path.endsWith(this.query)) {
      path = path.slice(0, -this.query.length);
    }
    /* Add type */
    if (!path.endsWith(`.${this.type}`)) {
      path = `${path}.${this.type}`;
    }
    /* Get load function from native path key */
    const load = this.#_.get(path);
    /* Import */
    let result = await load();
    /* Process */
    if (this.processor) {
      const processed = await this.processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        result = processed;
      }
    }
    return result;
  }
}

/* Vite import map controller (result of 'import.meta.glob').
NOTE
- Scoped to
  - single base dir
  - single file type
  - single query (optional)
  - single processor (optional)
- Import map filtering beyod the inclusion/exclusion syntax of 'import.meta.glob'.
- Provides paths introspection.
- Supports batch import. 
- Alternative Python-like import syntax.
- Can be used for non-Vite imports maps, i.e., for objects with the same shape. 
*/
export class Modules extends Base {
  #_ = {
    registry: new Map(),
  };

  constructor(map, { base, filter, onbatch, processor, query, type } = {}) {
    super();
    /* Check base */
    if (!base) {
      throw new Error(`'base' not provided`);
    }
    /* Enable Python-like import syntax */
    this.#_.$ = syntax("", this, (part) => part === this.type);
    /* Build registry from map */
    Object.entries(map).forEach(([path, load]) => {
      const key = path.slice("/src".length + base.length);
      if (!filter || filter(key)) {
        /* Check type */
        if (type && !path.endsWith(`.${type}`)) {
          throw new Error(`Invalid type for path: ${path}`);
        }
        this.#_.registry.set(key, load);
      }
    });

    this.#_.onbatch = onbatch;

    /* NOTE
    -  Pass kwargs into 'super.__new__' (rather than 'super') to enable config 
       of parent with own 'this' members. */
    super.__new__({
      base,
      /* Returns load function. */
      get: (path) => {
        const load = this.#_.registry.get(path);
        /* Error, if invalid path */
        if (!load) {
          throw new Error(`Invalid path: ${path}`);
        }
        return load;
      },
      processor,
      query,
      type,
    });
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#_.$;
  }

  get onbatch() {
    return this.#_.onbatch;
  }

  set onbatch(onbatch) {
    this.#_.onbatch = onbatch;
  }

  /* Batch-imports, optionally by filter. */
  async batch(filter) {
    const imports = {};
    for (const path of filter ? this.paths().filter(filter) : this.paths()) {
      imports[path] = await this.import(path);
    }
    if (this.onbatch) {
      await this.onbatch.call(this, imports, { owner: this });
    }
    return imports;
  }

  /* Returns paths. 
  NOTE
  - */
  paths() {
    return this.#_.registry.keys();
  }
}
