/*
import { Modules } from "@/rollovite/tools/modules.js";
20250516
v.2.0
*/

import { registry } from "@/rollovite/tools/registry.js";
import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

/* Controller for Vite import map (result of 'import.meta.glob'). 
NOTE
- Intended as a key part of Rollo's central import engine, but can be used 
  stand-alone or to extend the engine.
- Modes:
  - Non-local (default):
    - Import map items are registered and retrieved centrally to prevent 
      duplication (duplicates are silently ignored).
    - Path keys are registered locally to provide fast batch imports and to 
      guard against misuse of processors.
  - Local:
    - Import map items are registered and retrieved locally to provide 
      slightly faster imports - at the expense of potential redundant items.
- Supports the '@/'-syntax and import from base.
- Supports batch imports.
- Option for cached preprocessing.
- 'strict' option (default) enforces single-file type import map to 
  guard against misuse of processors and for general organization discipline.
  Also allows use of ''import' without file type.
  If 'type' is not provided expilcitly provided at construction, it is inferred.
- Best practices:
  - Use 'strict' and provide 'type' explicitly.
  - Call 'import' with file type.
  - For non-global import maps, always use the 'base' option.
  - 'import.meta.glob' should be used with
      `{ query: "?raw", import: "default" }` kwargs for raw imports
    and
      no kwargs for non-raw imports.
    Other combinations will likely work, but may not leverage the full 
    potential of 'Modules'.
  - For raw imports in local mode, it is not necessary to specify 'query'.
    Should, however, be done for consistency.
- Although tyically used for wrapping Vite import maps, custom objects with similar 
  shape can also be used. */
export class Modules {
  /* XXX
  - The constructor kwargs must be manually coordinated with the 
    'import.meta.glob' args. This is not ideal, but required, since
    'import.meta.glob' args must be static in non-DEV. NOT CRITICAL!
    Re each kwarg (just for fun):
    - 'type' can be easily inferred
    - 'base' could probably be inferred by looking for a common pattern,
      when parsing map items; probably not cheap and not worthwhile.
    - 'query' could probably be inferred by doing a "test import"
      and check, if string - or by postponing query setting until first 
      import; probably over-engineering and not worthwhile.
    Could probably also use 'import.meta.glob' with dynamic args in DEV
    only and then register these (via a local endpoint) for use in non-DEV.
    Probably also possible to do other kinds of pseudo-static analysis in
    DEV... Super fun, but certainly over-engineering and not worthwhile!
  - 'local' does not have to be coordinated with 'import.meta.glob' args,
    but could be set automatically, if global redundacy is detected.
    However, too much magic and loss of control. Don't do it! */

  #base;
  #local;
  #paths;
  #processor = null;
  #proxy;
  #query;
  #registry;
  #type;

  constructor(
    map,
    { base, local = false, processor, query = "", type, strict = true } = {}
  ) {
    this.#base = base;
    this.#local = local;
    if (processor) {
      this.processor(processor);
    }
    this.#query = query;
    this.#type = type;

    /* Helpers for parsing map */
    const check_type = (path) => {
      if (!strict) {
        return;
      }
      if (!this.#type) {
        this.#type = path.split(".").reverse()[0];
      }
      if (!path.endsWith(`.${this.#type}`)) {
        throw new Error(`Invalid type for path: ${path}`);
      }
    };
    const get_naked = (path) => path.slice("/src/".length);
    const create_key = (naked) =>
      base ? naked.slice(base.length - 1) : `@/${naked}`;
    /* Parse map */
    if (local) {
      this.#registry = new Map();
      for (const [path, load] of Object.entries(map)) {
        check_type(path);
        this.#registry.set(create_key(get_naked(path)), load);
      }
    } else {
      /* Non-local */
      this.#registry = new Set();
      for (const [path, load] of Object.entries(map)) {
        check_type(path);
        const naked = get_naked(path);
        /* Global registry */
        registry.add(`@/${naked}${query}`, load);
        /* Local registry */
        this.#registry.add(create_key(naked));
      }
    }

    this.#paths = Object.freeze(Array.from(this.#registry.keys()));

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

  /* Returns local mode. */
  get local() {
    return this.#local;
  }

  /* Returns paths. */
  get paths() {
    return this.#paths;
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
    if (this.type && !key.endsWith(`.${this.type}`)) {
      key = `${key}.${this.type}`;
    }
    if (!this.#registry.has(key)) {
      throw new Error(`Invalid path: ${key}`);
    }

    const load = this.local
      ? this.#registry.get(key)
      : registry.get(
          (() => {
            let result = `${key}${this.query}`;
            return this.base ? `${this.base}/${result}` : result;
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
