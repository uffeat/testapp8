/*
import { Modules } from "@/rollovite/tools/modules.js";
20250516
v.2.0
*/

import { registry } from "@/rollovite/tools/registry.js";
import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Controller for Vite import maps (results of 'import.meta.glob'). 
NOTE
- Intended as a key part of Rollo's central import engine, but can be used 
  stand-alone or to extend the central import engine.
- Supports the '@/'-syntax and import from base.
- Supports batch imports.
- Option for cached preprocessing.

- Import map coverage should be single-file type (unfortunately not enforcable).
- Provides meta data. However, since it's not possible to introspect Vite loaders',
  meta props such as 'type' relies on correct setting of 'key' at construction.
- 'key' should match the file type and any query, e.g.,
  'js' or 'js?raw'. Since loader keys are paths without any query information,
  'key' enables construction of unique path specifiers and provides a key 
  suitable for registration of the instance in parent registries.

  
- Although tyically used for wrapping Vite import maps, custom objects with similar 
  shape can also be used. */
export class Modules {
  #base;
  #processor;
  #proxy;
  #query;
  #registry = new Set();
  #type

  constructor(map, { base, processor, query = "", type } = {}) {
    /* Create processor prop */
    this.#processor = new (class {
      #processor = null;

      /* Creates, sets and returns Processor instance from function (or object 
      with a call method) for post-processing import results.
      NOTE
      - 'processor' can be async.
      - Supports (exposed) caching.
      - Supports highly dynamic patterns. 
      - undefined processor results are ignored as a means to selective 
        processing. */
      define(source) {
        if (source) {
          if (source instanceof Processor) {
            this.#processor = source;
          } else {
            this.#processor = new Processor(this, source);
          }
        } else {
          if (this.#processor instanceof Processor) {
            this.#processor.cache.clear();
          }
          this.#processor = null;
        }
        return this.#processor;
      }

      /* Return Processor instance, if set up; otherwise null */
      get() {
        return this.#processor;
      }
    })();

    this.#base = base;
    if (processor) {
      this.processor.define(processor);
    }
    this.#query = query;
    this.#type = type

    for (const [path, load] of Object.entries(map)) {
      /* Check type */
      if (!path.endsWith(`.${type}`)) {
        throw new Error(`Invalid type for path: ${path}`)
      }
      const naked = path.slice("/src/".length);
      /* Global registry */
      const key = `@/${naked}${query}`;
      if (registry.has(key)) {
        console.warn(`Duplicate key: ${key}`);
      } else {
        registry.add(key, load);
      }
      /* Local registry */
      if (base) {
        this.#registry.add(naked.slice(base.length - 1));
      } else {
        this.#registry.add(`@/${naked}`);
      }
    }

    /* Enable Python-like syntax */
    this.#proxy = base ? syntax(``, this) : syntax("@", this);
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  /* Returns processor controller. */
  get processor() {
    return this.#processor;
  }

  /* Returns query. */
  get query() {
    return this.#query;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  /* Batch-imports by filter. */
  async batch(filter) {
    /* Batch-import by filter */
    const imports = [];
    const keys = Array.from(this.#registry.keys()).filter(filter);
    for (const key of keys) {
      imports.push(await this.import(key));
    }
    return imports;
  }

  /* Returns import. */
  async import(key) {
    if (typeof key === "function") {
      return await this.batch(key);
    }
    if (!this.#registry.has(key)) {
      throw new Error(`Invalid path: ${key}`);
    }

    const load = registry.get(
      (() => {
        let result = `${key}${this.#query}`;
        return this.#base ? `${this.#base}/${result}` : result;
      })()
    );

    const result = await load();

    const processor = this.processor.get();
    if (processor) {
      const processed = await processor.call(this, key, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }

    return result;
  }
}
