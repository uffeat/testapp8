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
      this.#base = base;
      this.#proxy = syntax(`/src/${base}`);
    } else {
      this.#proxy = syntax("@");
    }

    if (processor) {
      this.processor(processor);
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
  - Should be used with the "@/"-syntax or with base path, if set up
    (but also supports the native "/src/"-format).
  - Should be used with any query prefix as per instance construction
  - Uses of base path, if set up (but can be used without).
  - Supports batch-imports by passing a filter function into 'import()'
    Filter functions receives a path arg that has been converted to the 
    "@/"-format or any base path, if set up. */
  async import(path) {
    if (typeof path === "function") {
      /* Batch-import by filter */
      const filter = path;
      const imports = [];
      for (const path of Object.keys(this.#loaders)) {
        /* Ensure that the filter function receives a path arg that is in 
        agrement with the API */
        const specifier = this.#unparse(path);
        if (filter(specifier)) {
          imports.push(await this.import(path));
        }
      }
      return imports;
    }
    path = this.#parse(path);

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

  /* Returns interpretation of 'path' from "@/"-format, use of base path and 
  path query to native "/src/"-format. */
  #parse(path) {
    if (path.startsWith("@/")) {
      /* Correct for "@/"-syntax */
      path = `/src/${path.slice("@/".length)}`;
    } else if (!path.startsWith("/src/") && this.base) {
      /* Correct for base */
      path = `/src/${this.base}/${path}`;
    }
    /* Remove any query */
    return this.query ? path.slice(0, -this.query.length) : path;
  }

  /* Returns interpretation of 'path' from native "/src/"-format to a format
  that uses the "@/"-syntax, takes into account base path and adds any query. */
  #unparse(path) {
    if (this.base) {
      /* Correct for base */
      path = path.slice(this.base);
    } else {
      /* Correct for "@/"-syntax */
      path = `@/${path.slice("/src/".length)}`;
    }
    /* Add any query */
    
    return (this.query && path.endsWith(this.query)) ? `${path}${this.query}` : path;
  }
}
