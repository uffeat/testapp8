/*
import { Modules } from "@/rollovite/tools/modules.js";
20250516
v.2.0
*/

import { registry } from "@/rollovite/tools/registry.js";
import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Controller for Vite loaders (results of 'import.meta.glob'). 
NOTE
- Intended as a key part of Rollo's central import engine, but can be used 
  stand-alone in a more local/specialized context or to extend the central 
  import engine.
- Supports the '@/' syntax.
- Supports batch imports.
- Option for cached preprocessing.
- Loader coverage should be single-file type (unfortunately not enforcable).
- Provides meta data. However, since it's not possible to introspect Vite loaders',
  meta props such as 'type' relies on correct setting of 'key' at construction.
- 'key' should match the file type and any query, e.g.,
  'js' or 'js?raw'. Since loader keys are paths without any query information,
  'key' enables construction of unique path specifiers and provides a key 
  suitable for registration of the instance in parent registries.
- Although tyically used for wrapping Vite loaders, custom objects with similar 
  shape can also be used. */
export class Modules {
  #base;

  #registry = new Set();
  #processor = null;
  #query;
  #proxy;

  constructor(map, { base, processor, query = "" } = {}) {
    this.#processor = new (class {
      #processor;

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
    this.#query = query;

    for (const [path, load] of Object.entries(map)) {
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

    if (base) {
      this.#proxy = syntax(``, this);
    } else {
      this.#proxy = syntax("@", this);
    }

    if (processor) {
      this.processor.define(processor);
    }
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  get processor() {
    return this.#processor;
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

  

    const load = registry.get((() => {
      let result = `${key}${this.#query}`;
      return this.#base ? `${this.#base}/${result}` : result;
    })());

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
