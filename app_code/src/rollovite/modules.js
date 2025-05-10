/*
rollovite/modules.js
20250510
v.3.1
*/

/* NOTE Do NOT import modules that uses 'modules'! */

import { Loaders } from "@/rollovite/tools/loaders.js";
import { factory } from "@/rollovite/tools/factory";

import {assets} from "@/rollovite/tools/public/assets.js";

/* Import utility.
NOTE
- Intended for app-wide use and can be used as a drop-in replacement for static 
  and dynamic imports.
- Supports truly dynamic imports.
- Supports multiple file types.
- Ignores .test.js src files.
- Supports src as well as public files (regardless of environment) with similar syntax.
  This can be used to adjust the trade-off between bundle size and import performance.
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  manual browser refresh is required to pick up the changes. */
export const modules = new (class Modules {
  #processors;
  #public;
  #raw;
  #src;

  #factory = factory.call(this, "@");

  constructor() {
    this.#processors = new (class Processors {
      #registry = new Map();

      /* Adds one or more processors. Chainable. */
      add(spec) {
        Object.entries(spec).forEach(([extension, processor]) => {
          this.#registry.set(extension, processor);
        });
        return this;
      }

      /* Removes all processors. Chainable. */
      clear() {
        this.#registry.clear();
        return this;
      }

      /* Prevents addition of processors. Chainable. */
      freeze() {
        Object.freeze(this.#registry);
        return this;
      }

      /* Returns processor. */
      get(extension) {
        return this.#registry.get(extension);
      }

      /* Returns extensions, for which processors have been registered;
      optionally, filtered. */
      processors(filter) {
        const result = Array.from(this.#registry.keys());
        if (filter) {
          return result.filter(filter);
        }
        return result;
      }

      /* Removes processor. Chainable. */
      remove(key) {
        this.#registry.delete(key);
        return this;
      }
    })();

    this.#public = assets

    this.#raw = Loaders();
    this.#src = Loaders();
  }

  /* Returns import with Python-like syntax. */
  get path() {
    return this.#factory;
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns controller for files in public. */
  get public() {
    return this.#public;
  }

  /* Returns controller for raw files in src. */
  get raw() {
    return this.#raw;
  }

  /* Returns controller for files in src. */
  get src() {
    return this.#src;
  }

  /* Returns import. */
  async import(path, { name, raw } = {}) {
    let result;
    if (path.startsWith("@/")) {
      if (!raw) {
        /* NOTE This is the most typical case (highest priority in terms of performance) */
        result = await this.src.import(path, { name });
      } else {
        result = await this.raw.import(path);
      }
    } else {
      result = await this.public.import(path, { name, raw });
    }

    const processor = this.processors.get(get_extension(path));
    if (processor) {
      return await processor.call(null, path, result);
    }
    return result;
  }
})();

/* Utilities... */



/* Returns file extension. */
function get_extension(path) {
  const file = path.split("/").reverse()[0];
  const [stem, ...meta] = file.split(".");
  return meta.join(".");
}



/* Configure... */

/* Register global loaders */
modules.src
  .add(
    import.meta.glob(["/src/**/*.css"]),
    import.meta.glob(["/src/**/*.html"], { query: "?raw" }),
    import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]),
    import.meta.glob(["/src/**/*.json"]),
    import.meta.glob(["/src/**/*.sheet"], { query: "?raw" }),
    import.meta.glob(["/src/**/*.template"], { query: "?raw" })
  )
  .freeze();
modules.raw
  .add(
    import.meta.glob(["/src/**/*.css"], { query: "?raw" }),
    import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"], { query: "?raw" }),
    import.meta.glob(["/src/**/*.json"], { query: "?raw" })
  )
  .freeze();
