/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250520
v.4.0
*/

import __types__ from "@/rollometa/public/__types__.json";
import { Base } from "@/rollovite/modules.js";
import { Processor } from "@/rollovite/tools/_processor.js";
import { pub } from "@/rollovite/tools/_pub.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Controller for Vite import maps.
NOTE
- "Building block" for 'app'.
- Scope:
  - Global
  - Multiple file types
  - Raw/non-raw
  - Multiple key-specific processors.
- Import maps are not copied, therefore performant construction. */
class Modules extends Base {
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

/* Universal import utility. 
NOTE
- The central piece of the Rollo import engine. However, not exposed directly,
  but via 'use' (for a more succinct syntax). */
const app = new (class {
  #processors;
  #public;
  #registry = new Map();
  #src;
  constructor(processors, ...spec) {
    /* Build processors */
    this.#processors = new (class {
      #registry = new Map();

      constructor(spec = {}) {
        Object.entries(spec).forEach(([key, source]) => {
          /* Enforce no-duplication */
          if (this.#registry.has(key)) {
            throw new Error(`Duplicate key: ${key}`);
          }
          /* NOTE To prevent tampering: 
          - owner is null
          - freeze */
          const processor = new Processor(null, source);
          processor.freeze();
          this.#registry.set(key, processor);
        });
      }

      get(key) {
        return this.#registry.get(key);
      }

      has(key) {
        return this.#registry.has(key);
      }
    })(processors);

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
      const processed = await processor.call(null, path, result);
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns function that imports from base.
  NOTE
  - String syntax only; The benefits of the Python-like syntax are limited, 
    when imports strings are short. */
  importer(base) {
    return async (path) => await this.import(`${base}/${path}`);
  }
})(
  /*** CONFIG ***/

  /* Config processors */
  {},
  /* Config modules */
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

/* Unviversal import utility.
NOTE
- The central piece of the Rollo import engine API.
- Zero-config. Based on in-module defined import maps and processors. This 
  config is not exposed as it is fundamental for Rollo and should not be 
  tampered with.
- Really no need to export, since aded to global namespace, but explicit import
  can silence barking linters. */
export const use = new Proxy(() => {}, {
  get: (target, key) => {
    return app[key];
  },

  apply: (target, context, args) => {
    return app.import(...args);
  },
});

/* Make 'use' global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
});
