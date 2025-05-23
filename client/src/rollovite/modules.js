/*
import { Modules } from "@/rollovite/modules.js";
20250522
v.4.3
*/

/* Vite import map controller ('import.meta.glob' result) that supports:
- Single base dir and file type scope.
- Optional query.
- Optional processor.
- Import map filtering beyond the inclusion/exclusion syntax of 'import.meta.glob'.
- Introspection.
- Batch import.
- Post-processing.
- Hooks. */
export class Modules {
  #_ = {
    registry: new Map(),
  };

  constructor(
    map,
    { base, filter, onbatch, onimport, processor, query, type } = {}
  ) {
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
        this.#_.registry.set(key, load);
      }
    });

    this.onbatch = onbatch;
    this.onimport = onimport;
    this.processor = processor;

    this.#_.base = base;
    this.#_.query = query;
    this.#_.type = type;
  }

  /* Returns base. */
  get base() {
    return this.#_.base;
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

  /* Returns processor. */
  get processor() {
    return this.#_.processor;
  }

  /* Sets processor. */
  set processor(processor) {
    if (processor) {
      const owner = this;
      /* Create wrapper for processor function that provides path-based 
      caching */
      this.#_.processor = new (class {
        #cache = new Map();
        /* Returns processed result. */
        async call(path, result) {
          if (this.#cache.has(path)) return this.#cache.get(path);
          const processed = await processor.call(null, result, {
            owner,
            path,
          });
          this.#cache.set(path, processed);
          return processed;
        }
      })();
    } else {
      this.#_.processor = null;
    }
  }

  /* Returns query. */
  get query() {
    return this.#_.query || "";
  }

  /* Returns type. */
  get type() {
    return this.#_.type;
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
    return this.#_.registry.has(path);
  }

  /* Returns import. */
  async import(path) {
    /* Get load function */
    const load = this.#_.registry.get(path);
    /* Error, if invalid path */
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    /* Import */
    let result = await load();
    /* Process */
    if (this.processor) {
      const processed = await this.processor.call(path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        result = processed;
      }
    }
    /* Hook */
    if (this.onimport) {
      await this.onimport.call(this, result, { owner: this, path });
    }

    return result;
  }

  /* Returns paths. */
  paths() {
    return this.#_.registry.keys();
  }
}

/* NOTE
  - Can be used for non-Vite imports maps, i.e., for objects with the same shape.
  - Not a Rollo import engine member, but can play a supplementing role.
  - Risk of redundant (overlapping) registries. Therefore, for instances exposed 
    in production, use with import maps that have a unique (NOT checked) or 
    small coverage. */
