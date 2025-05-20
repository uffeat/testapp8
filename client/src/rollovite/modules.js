/*
import { Base, Modules } from "@/rollovite/tools/modules.js";
20250520
v.4.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Base class for Vite import map controller.
NOTE
- Rollo import engine member. 
- When using Vite import maps:
  - Code changes are NOT picked up by Vite's HMR, 
    i.e., manual browser refresh is required.
  - All (native) import statemenets in modules covered by an import map
    must include file extension. */
export class Base {
  #_ = {};

  __new__({ base, get, processor, query, type }) {
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
    return `${this.type || ""}${this.query}`;
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
    return this.#_.type;
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
    if (this.type && !path.endsWith(`.${this.type}`)) {
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
- Scoped to:
  - Single base dir
  - single file type
  - Single query (optional)
  - Single processor (optional)
- Supports:
  - Import map filtering beyod the inclusion/exclusion syntax of 'import.meta.glob'.
  - Introspection.
  - Batch import.
  - Post-processing.
  - Hooks.
  - Alternative Python-like import syntax.
- Can be used for non-Vite imports maps, i.e., for objects with the same shape.
- Not a Rollo import engine member, but can play a supplementing role.
- Risk of redundant (overlapping) registries. Therefore for instances exposed 
  in production, use with import maps that have a unique (NOT checked) or 
  small coverage.
*/
export class Modules extends Base {
  #_ = {
    registry: new Map(),
  };

  constructor(map, { base, filter, onbatch, onimport, processor, query, type } = {}) {
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
    this.#_.onimport = onimport;

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

  /* Returns onbatch hook. */
  get onbatch() {
    return this.#_.onbatch;
  }

  /* Sets onbatch hook. */
  set onbatch(onbatch) {
    this.#_.onbatch = onbatch;
  }

  /* Returns onimport hook. */
  get onimport() {
    return this.#_.onimport;
  }

  /* Sets onimport hook. */
  set onimport(onimport) {
    this.#_.onimport = onimport;
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

  /* Checks, if valid path. */
  has(path) {
    return this.#_.registry.has(path)
   }

  /* Returns import. */
  async import(path) {
    const result = await super.import(path)
    if (this.onimport) {
      await this.onimport.call(this, result, { owner: this, path });
    }
    return result
  }

  /* Returns paths. */
  paths() {
    return this.#_.registry.keys();
  }
}
