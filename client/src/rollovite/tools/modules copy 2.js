/*
import { Modules } from "@/rollovite/tools/modules.js";
20250515
v.1.1
*/

/* BUG (perhaps)
- batch import in non-DEV */

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
  #key;
  #loaders;
  #processor;
  #proxy;
  #query;
  #type;

  constructor(key, loaders, { base, processor } = {}) {
    this.#key = key;
    this.#loaders = loaders;

    const [type, query] = key.split("?");
    this.#type = type;
    this.#query = query ? `?${query}` : "";

    if (base) {
      this.#base = `/src/${base}`;
      this.#proxy = syntax(this.#base);
    } else {
      this.#proxy = syntax("@");
    }

    if (processor) {
      this.processor(processor);
    }
  }

  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  /* Returns key (type and query combination). */
  get key() {
    return this.#key;
  }

  /* Returns query with '?'-prefix. Returns empty string, if no query. */
  get query() {
    return this.#query;
  }

  /* Creates, sets and returns Processor instance from function (or object 
  with a call method) for post-processing import results.
  NOTE
  - 'processor' can be async.
  - Supports (exposed) caching.
  - Supports highly dynamic patterns. 
  - undefined processor results are ignored as a means to selective 
    processing. */
  processor(processor) {
    if (processor) {
      this.#processor = new Processor(this, processor);
    } else {
      if (this.#processor instanceof Processor) {
        this.#processor.cache.clear();
      }
      this.#processor = null;
    }
    return this;
  }

  /* Returns file type, for which the instance applies. */
  get type() {
    return this.#type;
  }

  /* Returns import.
  NOTE
  - Supports batch-imports by passing a filter function into 'import()' */
  async import(specifier) {
    if (typeof specifier === "function") {
      /* Batch-import by filter */
      const filter = specifier;
      const imports = [];
      for (const path of Object.keys(this.#loaders)) {
        const specifier = `@/${path.slice("/src/".length)}${this.query}`;
        if (filter(specifier)) {
          imports.push(await this.import(specifier));
        }
      }

      return imports;
    }

    let path;

    if (this.base) {
      /* Correct for base */
      path = `${this.base}/${specifier}`;
    } else {
      /* Correct for "@/"-syntax */
      path = `/src/${specifier.slice("@/".length)}`;
    }
    /* Remove any query */
    if (this.query) {
      path = path.slice(0, -this.query.length);
    }

    const load = this.#get(path);
    /* Vite loaders */
    const result = await load.call(null, path);
    if (this.#processor) {
      const processed = await this.#processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns (async) load function. */
  #get(path) {
    const load = this.#loaders[path];
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    return load;
  }
}
