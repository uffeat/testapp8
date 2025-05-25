/*
import { Modules } from "@/rollovite/tools/modules.js";
20250513
v.1.0
*/

import { Path } from "@/rollovite/tools/_path.js";
import { Processor } from "@/rollovite/tools/_processor.js";

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
  #key;
  #loaders;
  #processor;
  #query;
  #type;

  constructor(key, loaders, {processor} = {}) {
    this.#key = key;
    this.#loaders = loaders;

    const [type, query] = key.split("?");
    this.#type = type;
    this.#query = query ? `?${query}` : "";

    if (processor) {
      this.processor(processor)
    }
  }

  /* Returns key (type and query combination). */
  get key() {
    return this.#key;
  }

  /* Returns query with '?'-prefix. Retuns empty string, if no query. */
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
      const specifiers = Object.keys(this.#loaders).filter((path) =>
        /* Convert to specifier before passing in to filter; enables filtering 
        based on the '@/' syntax and on queries */
        filter(`@/${path.slice("/src/".length)}${this.query}`)
      );
      const imports = [];
      for (const specifier of specifiers) {
        imports.push(await this.import(specifier));
      }
      return imports;
    }
    const path = Path.create(specifier);
    const load = this.get(path);
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
  get(path) {
    path = Path.create(path);
    const load = this.#loaders[path.path];
    if (!load) {
      throw new Error(`Invalid path: ${path.path}`);
    }
    return load;
  }
}
