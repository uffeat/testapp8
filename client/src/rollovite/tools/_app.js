/*
import { app } from "@/rollovite/_app.js";
20250518
v.1.0
*/

import __types__ from "@/rollometa/public/__types__.json";
import { Base } from "@/rollovite/modules.js";
import { Processors } from "@/rollovite/tools/_processors.js";
import { pub } from "@/rollovite/tools/_pub.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Controller for Vite import maps.
NOTE
- Scope:
  - Global
  - Multiple file types
  - Raw/non-raw
  - Multiple key-specific processors.
- Import maps are not copied, therefore performant construction. */
export class Modules extends Base {
  #registry;

  constructor(map, { processor, query, type } = {}) {
    super();
    this.#registry = map;
    /* NOTE
    -  Pass kwargs into 'super.__new__' (rather than 'super') to enable config 
       of parent with own 'this' members. */
    super.__new__({
      /* Returns load function. */
      get: (path) => {
        const key = `/src/${path.slice("@/".length)}`;
        const load = this.#registry[key];
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
}


/* */
export const app = new (class {
  #processors;
  #public;
  #registry = new Map();
  #src;
  constructor(processors, ...spec) {
    /* Build processors */
    this.#processors = new Processors(this, processors);
    /* Build modules registry */
    spec.forEach((modules) => {
      /* Enforce no-duplication */
      if (this.#registry.has(modules.key)) {
        throw new Error(`Duplicate key: ${modules.key}`);
      }
      this.#registry.set(modules.key, modules);
    });
    /* Enable Python-like import syntax */
    (() => {
      const types = new Set(__types__);
      this.#public = syntax("/", this, (part) => types.has(part));
    })();
    this.#src = syntax("@", this, (part) => this.#registry.has(part));
  }

  /* Return processors controller. */
  get processors() {
    return this.#processors;
  }

  /* Returns import from public (subject to any processing) with Python-like 
  syntax. */
  get public() {
    return this.#public;
  }

  /* Returns import from src (subject to any processing) with Python-like 
  syntax. */
  get src() {
    return this.#src;
  }

  /* Returns import from src or public, subject to any processing. */
  async import(path) {
    let result;
    const key = path.split(".").reverse()[0];
    if (path.startsWith("@/")) {
      const modules = this.#registry.get(key);
      if (!modules) {
        throw new Error(`Invalid key: ${key}`);
      }
      result = await modules.import(path);
    } else {
      /* public */
      result = await pub.import(path);
    }
    /* Process */
    if (this.processors.has(key)) {
      const processor = this.processors.get(key);
      const processed = await processor.call(this, path, result);
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  importer(base) {
    return async (path) => await this.import(`${base}/${path}`);
  }
})(
  /* Define processors */
  {},
  /* Define modules */
  new Modules(import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"]), {
    type: "css",
  }),
  new Modules(
    import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"], {
      query: "?raw",
      import: "default",
    }),
    {
      query: "?raw",
      type: "css",
    }
  ),
  new Modules(
    import.meta.glob(["/src/**/*.html", "!/src/rollotest/**/*.*"], {
      query: "?raw",
      import: "default",
    }),
    {
      /* NOTE Do NOT register query! */
      type: "html",
    }
  ),
  new Modules(import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"]), {
    type: "js",
  }),
  new Modules(
    import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"], {
      query: "?raw",
      import: "default",
    }),
    {
      query: "?raw",
      type: "js",
    }
  ),
  new Modules(
    import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
      import: "default",
    }),
    {
      type: "json",
    }
  ),
  new Modules(
    import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
      query: "?raw",
      import: "default",
    }),
    {
      query: "?raw",
      type: "json",
    }
  )
);
