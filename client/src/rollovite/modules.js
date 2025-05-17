/*
import { Modules } from "@/rollovite/tools/modules.js";
20250517
v.3.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* */
class Base {
  #_ = {};
 

  __new__({ base, get, processor, query = "", type = "js" }) {
    this.#_.base = base;
    this.#_.get = get;
    this.#_.query = query;
    this.#_.type = type;

   

    if (processor) {
      this.processor(processor);
    }
    this.#_.$ = syntax(
      this.base ? "" : "@",
      this,
      (part) => part === this.type
    );
    /* Prevent __new__ from being called again */
    delete this.__new__;
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#_.$;
  }

  /* Returns base. */
  get base() {
    return this.#_.base;
  }

  /* Returns query. */
  get query() {
    return this.#_.query;
  }

  /* Returns type. */
  get type() {
    return this.#_.type;
  }

  /* Returns import. */
  async import(path) {
    /* Remove query */
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
    const result = await load();
    /* Process */
    const processor = this.processor();
    if (processor) {
      const processed = await processor.call(this, path, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns and/or configures processor.
  NOTE
  - Combined getter/setter for 'processor':
    - If no arg, returns Processor instance, or null, if not set up.
    - If source, creates, sets and returns Processor instance from function.
    - If null arg, removes processor.
  - 'source' should be a (optionally) async function with the signature:
      (this, result, { owner: this, key })
    Can also be an object with a 'call' method or a Processor instance.
  - Supports (exposed) caching.
  - Supports highly dynamic patterns. 
  - undefined processor results are ignored as a means to selective 
    processing. */
  processor(source) {
    if (source) {
      if (source instanceof Processor) {
        this.#_.processor = source;
      } else {
        this.#_.processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#_.processor instanceof Processor) {
          this.#_.processor.cache.clear();
        }
        this.#_.processor = null;
      }
    }
    return this.#_.processor;
  }
}

/* 
NOTE
- For global scope
- Zero registries beyond import map, therefore performant import. */
export class Modules extends Base {
  #registry;

  constructor(map, { processor, query, type } = {}) {
    super();
    this.#registry = map;
    this.__new__({
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

  /* Returns paths, optionally filtered. 
  NOTE
  - Can be used for batch imports.
  - Consuming code should cache, if performance-critical. */
  paths(filter) {
    const paths = Object.keys(this.#registry);
    return filter ? paths.filter(filter) : paths;
  }
}

/* 
NOTE
- Intended for non-global scope
- Use with base */
export class LocalModules extends Base {
  #registry = new Map();

  constructor(map, { base, processor, query, type } = {}) {
    super();

    /* Check base */
    if (!base) {
      throw new Error(`'base' not provided`);
    }
    /* Build paths and registry from map */
    for (const [path, load] of Object.entries(map)) {
      /* Check type */
      if (type && !path.endsWith(`.${type}`)) {
        throw new Error(`Invalid type for path: ${path}`);
      }
      const key = path.slice("/src".length + base.length);

      this.#registry.set(key, load);
    }

    this.__new__({
      base,
      /* Returns load function. */
      get: (path) => {
        const load = this.#registry.get(path);
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

  /* Batch-imports by filter. */
  async batch(filter) {
    const imports = [];
    const keys = this.paths(filter);
    for (const key of keys) {
      imports.push(await this.import(key));
    }
    return imports;
  }

  /* Returns import. */
  async import(path) {
    if (typeof path === "function") {
      return await this.batch(path);
    }
    return await super.import(path);
  }

  /* Returns paths, optionally filtered. */
  paths(filter) {
    const paths = Array.from(this.#registry.keys());
    return filter ? paths.filter(filter) : paths;
  }
}

/* */
export const modules = new (class {
  #processors;
  #registry = new Map();
  constructor(...spec) {
    const owner = this;

    this.#processors = new (class {
      #registry = new Map();

      add(spec) {
        Object.entries(spec).forEach(([key, source]) => {
          /* Enforce no-duplication */
          if (this.#registry.has(key)) {
            throw new Error(`Duplicate key: ${key}`);
          }
          this.#registry.set(key, new Processor(owner, source));
        });
        return this;
      }

      clear() {
        this.#registry.clear();
        return this;
      }

      get(key) {
        return this.#registry.get(key);
      }

      has(key) {
        return this.#registry.has(key);
      }

      keys() {
        return this.#registry.keys();
      }

      remove(key) {
        this.#registry.delete(key);
        return this;
      }
    })();

    spec.forEach((modules) => {
      const key = modules.query
        ? `${modules.type}${modules.query}`
        : modules.type;
      this.#registry.set(key, modules);
    });
  }

  get processors() {
    return this.#processors;
  }

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
      // TODO
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
})(
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
      query: "?raw",
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
