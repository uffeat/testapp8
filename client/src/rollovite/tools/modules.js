/*
import { Modules } from "@/rollovite/tools/modules.js";
20250517
v.3.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

export class Base {
  #base;
  #processor = null;
  #proxy;
  #query;
  #type;

  constructor(
    map,
    { base, processor, query = "", type = 'js' } = {}
  ) {
    this.#base = base;
    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;

    /* Enable Python-like syntax */
    this.#proxy = syntax(base ? "" : "@", this, (part) => part === type);
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
  }

  

  /* Returns query. */
  get query() {
    return this.#query;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  

  

  /* Combined getter/setter for 'processor':
  - If no arg, returns Processor instance, or null, if not set up.
  - If source, creates, sets and returns Processor instance from function.
  - If null arg, removes processor.
  NOTE
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
        this.#processor = source;
      } else {
        this.#processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
    }
    return this.#processor;
  }
}

/* 
NOTE
- For global scope
- Zero registries beyond import map. */
export class Modules {
  #registry;
  #processor = null;
  #proxy;
  #query;
  #type;

  constructor(map, { processor, query = "", type } = {}) {
    this.#registry = map;

    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;

    /* Enable Python-like syntax */
    this.#proxy = syntax("@", this, (part) => part === type);
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns query. */
  get query() {
    return this.#query;
  }

  /* Returns type. */
  get type() {
    return this.#type;
  }

  /* Returns import. */
  async import(path) {
    /* Allow paths with query */
    if (this.query && path.endsWith(this.query)) {
      path = path.slice(0, -this.query.length);
    }
    /* Allow paths without type */
    if (this.type && !path.endsWith(`.${this.type}`)) {
      path = `${path}.${this.type}`;
    }
    
    const load = this.#registry[path];
    const result = await load();
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

  /* Returns paths, optionally filtered. */
  paths(filter) {
    const paths = Object.keys(this.#registry);
    if (filter) {
      return paths.filter(filter);
    }
    return paths;
  }

  /* Combined getter/setter for 'processor':
  - If no arg, returns Processor instance, or null, if not set up.
  - If source, creates, sets and returns Processor instance from function.
  - If null arg, removes processor.
  NOTE
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
        this.#processor = source;
      } else {
        this.#processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
    }
    return this.#processor;
  }
}

/* 
NOTE
- Intended for non-global scope
- Single created registry
- Use with base */
export class LocalModules {
  #base;

  #processor = null;
  #proxy;
  #query;
  #registry = new Map();
  #type;

  constructor(map, { base, processor, query = "", type = "js" } = {}) {
    if (!base) {
      throw new Error(`'base' not provided`);
    }

    this.#base = base;

    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;

    /* Build registry from map */
    for (const [path, load] of Object.entries(map)) {
      /* Check type */
      if (!path.endsWith(`.${type}`)) {
        throw new Error(`Invalid type for path: ${path}`);
      }
      const naked = path.slice("/src/".length);
      const key = naked.slice(base.length - 1);
      this.#registry.set(key, load);
    }

    /* Enable Python-like syntax */
    this.#proxy = syntax("", this, (part) => part === type);
  }

  /* Returns import with Python-like-syntax. */
  get $() {
    return this.#proxy;
  }

  /* Returns base. */
  get base() {
    return this.#base;
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
    const imports = [];
    const keys = this.paths(filter)
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
    /* Allow paths with query */
    if (this.query && key.endsWith(this.query)) {
      key = key.slice(0, -this.query.length);
    }
     /* Allow paths without type */
    if (!key.endsWith(`.${this.type}`)) {
      key = `${key}.${this.type}`;
    }
    /* Check path */
    if (!this.#registry.has(key)) {
      throw new Error(`Invalid path: ${key}`);
    }

    const load = this.#registry.get(key)
    const result = await load();

    const processor = this.processor();
    if (processor) {
      const processed = await processor.call(this, key, result);
      /* Ignore undefined */
      if (processed !== undefined) {
        return processed;
      }
    }

    return result;
  }

  /* Returns paths, optionally filtered. */
  paths(filter) {
    const paths = Array.from(this.#registry.keys());
    if (filter) {
      return paths.filter(filter);
    }
    return paths;
  }

  /* Combined getter/setter for 'processor':
  - If no arg, returns Processor instance, or null, if not set up.
  - If source, creates, sets and returns Processor instance from function.
  - If null arg, removes processor.
  NOTE
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
        this.#processor = source;
      } else {
        this.#processor = new Processor(this, source);
      }
    } else {
      if (source === null) {
        /* Clean up and remove processor */
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
    }
    return this.#processor;
  }
}
