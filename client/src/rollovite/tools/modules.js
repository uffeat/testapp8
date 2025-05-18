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

  /* NOTE
  - 'processor' should be a function or object with a 'call' method 
    (optionally async) with the signature:
      (this, result, { owner: this, key })
  */
  __new__({ base, get, processor, query = "", type = "js" }) {
    this.#_.base = base;
    this.#_.get = get;
    this.#_.query = query;
    this.#_.type = type;

    if (processor) {
      const source = processor;
      this.#_.processor = new Processor(this, source);
    }
    this.#_.$ = syntax(
      this.base ? "" : "@",
      this,
      (part) => part === this.type
    );
    /* Prevent __new__ from being called again */
    delete this.__new__;
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#_.$;
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
  - Critial for aggregators that 'no query' is an empty string!*/
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
    const result = await load();
    /* Process */
    if (this.processor) {
      const processed = await this.processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
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
  - single procesor (optional)
- Import map filtering beyod the inclusion/exclusion syntax of 'import.meta.glob'.
- Provides paths introspection.
- Supports batch import. 
- Can be used for non-Vite imports maps, i.e., for objects with the same shape.
- Rollo import engine member. */
export class Modules extends Base {
  #registry = new Map();

  constructor(map, { base, filter, processor, query, type } = {}) {
    super();
    /* Check base */
    if (!base) {
      throw new Error(`'base' not provided`);
    }

    /* Build registry from map */
    Object.entries(map).forEach(([path, load]) => {
      const key = path.slice("/src".length + base.length);
      if (!filter || filter(key)) {
        /* Check type */
        if (type && !path.endsWith(`.${type}`)) {
          throw new Error(`Invalid type for path: ${path}`);
        }
        this.#registry.set(key, load);
      }
    });

    /* NOTE
    -  Pass kwargs into 'super.__new__' (rather than 'super') to enable config 
       of parent with own 'this' members. */
    super.__new__({
      base,
      /* Returns load function. */
      get: (path) => {
        const load = this.#registry.get(path);
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

  /* Batch-imports, optionally by filter. */
  async batch(filter) {
    const imports = [];
    for (const path of filter ? this.paths().filter(filter) : this.paths()) {
      imports.push(await this.import(path));
    }
    return imports;
  }

  /* Returns paths. 
  NOTE
  - */
  paths() {
    return Array.from(this.#registry.keys());
  }
}
