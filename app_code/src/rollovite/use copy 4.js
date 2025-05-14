/*
import { use } from  "@/rollovite/use.js";
20250514
v.1.2
Suite of utilities for importing assets.
*/

/* Do NOT import files that uses 'use'! */

/* */
export class Path {
  static PUBLIC_PREFIX = "/";
  static RAW_QUERY = "?raw";
  static SRC_PREFIX = "@/";
  static create = (arg) => {
    if (arg instanceof Path) {
      return arg;
    }
    return new Path(arg);
  };

  #key;
  #path;
  #public;
  #query;
  #raw;
  #specifier;
  #src;
  #type;

  constructor(specifier) {
    this.#specifier = specifier;
  }

  /* Returns . */
  get key() {
    if (this.#key === undefined) {
      this.#key = this.raw ? `${this.type}${Path.RAW_QUERY}` : this.type;
    }
    return this.#key;
  }

  /* Returns actual path. */
  get path() {
    if (this.#path === undefined) {
      this.#path = this.raw
        ? this.specifier.slice(0, -Path.RAW_QUERY.length)
        : this.specifier;

      if (this.src) {
        this.#path = `/src/${this.#path.slice(Path.SRC_PREFIX.length)}`;
      } else if (this.public) {
        this.#path = `${import.meta.env.BASE_URL}${this.#path.slice(
          Path.PUBLIC_PREFIX.length
        )}`;
      }
    }
    return this.#path;
  }

  /* Returns public flag. */
  get public() {
    if (this.#public === undefined) {
      this.#public = this.specifier.startsWith(Path.PUBLIC_PREFIX);
    }
    return this.#public;
  }

  /* Returns . */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.specifier.includes("?")
        ? `?${this.specifier.split("?").reverse()[0]}`
        : "";
    }
    return this.#query;
  }

  /* Returns . */
  get raw() {
    if (this.#raw === undefined) {
      this.#raw = this.specifier.endsWith(Path.RAW_QUERY);
    }
    return this.#raw;
  }

  /* Returns src flag. */
  get src() {
    if (this.#src === undefined) {
      this.#src = this.specifier.startsWith(Path.SRC_PREFIX);
    }
    return this.#src;
  }

  /* Returns . */
  get specifier() {
    return this.#specifier;
  }

  /* Returns . */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.path.split(".").reverse()[0];
    }
    return this.#type;
  }
}

/* Wrapped for Vite import maps (loaders). 
NOTE
- Wrapped loaders should be single-file type.
- 'key' should match the file type and any query, e.g.,
  'js' or 'js?raw'. Since loader keys are paths without any query information,
  'key' enables construction of unique path specifiers and provides a way
  to identify relevant registry from path specifier.
- Although tyically used for wrapping Vite loaders, i.e., objects returned by 
  'import.meta.glob', custom objects with similar shape can also be used.  */
export class Modules {
  #key;
  #loaders;
  #paths;
  #query;
  #processor;
  #specifiers;
  #type;

  constructor(key, loaders) {
    this.#key = key;
    this.#loaders = loaders;

    this.#paths = Object.keys(loaders);
    const [type, query] = key.split("?");
    this.#type = type;
    this.#query = query ? `?${query}` : "";
  }

  /* */
  get key() {
    return this.#key;
  }

  /* */
  get query() {
    return this.#query;
  }

  /* */
  get processor() {
    return this.#processor;
  }

  /* */
  set processor(processor) {
    if (processor) {
      this.#processor = new (class {
        #registry = new Map();

        async call(context, path, result) {
          if (this.#registry.has(path.path)) {
            return this.#registry.get(path.path);
          }
          const processed = await processor.call(context, result, { path });
          this.#registry.set(path.path, processed);
          return processed;
        }
      })();
    } else {
      this.#processor = undefined;
    }
  }

  /* */
  get type() {
    return this.#type;
  }

  /* */
  consolidate() {
    this.#specifiers = this.#_specifiers();
    return this;
  }

  /* */

  async import(specifier) {
    if (typeof specifier === "function") {
      /* Batch-import by filter */
    const filter = specifier;
    const result = [];
    //const specifiers = this.specifiers(filter)
    for (const specifier of this.specifiers(filter)) {
      result.push(await this.import(specifier));
    }
    return result;
    }

    const path = Path.create(specifier);
      const load = this.get(path);
      const result = await load.call(this, path);
      if (this.processor) {
        const processed = await this.processor.call(this, path, result);
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

  /* Returns array of import specifiers, optionally subject to filtering. 
  NOTE
  - Enables batch-import. */
  specifiers(filter) {
    /* NOTE
    - No attempt is made at initial "path-transformations" of at caching such.
      Hence, no risk of memory leaks and fast initial loads - at the expense of
      slower batch imports. Here's the rationale for this trade-off:
      - Most registies will never participate in batch imports
      - The primary job of the utility suite is to provide truly dynamic imports
        with minimum performance overhead. Batch-import is a key feature, but 
        secondary. */

    const specifiers = this.#specifiers || this.#_specifiers();

    if (filter) {
      return specifiers.filter(filter);
    }
    return specifiers;
  }

  #_specifiers() {
    return this.#paths.map(
      (path) => `@/${path.slice("/src/".length)}${this.query}`
    );
  }
}

/* Utility for managing multipe registries. 
NOTE
- Sub-registries should be unique with respect to key/type combinations. */
class Registries {
  #registry = new Map();

  constructor(spec) {
    Object.entries(spec).forEach(([key, loaders]) => {
      this.#registry.set(key, new Modules(key, loaders));
    });
  }

  /* Returns modules. */
  get(key) {
    const modules = this.#registry.get(key);
    if (!modules) {
      throw new Error(`Invalid key: ${key}`);
    }
    return modules;
  }

  /* Returns array of import specifiers across registries, optionally subject 
  to filtering. 
  NOTE
  - Enables batch-import. */
  specifiers(filter) {
    const specifiers = [];
    for (const registry of this.#registry.values()) {
      specifiers.push(...registry.specifiers(filter));
    }
    return specifiers;
  }
}

/* Configure global-scope registries for common file types, incl. raw where relevant.  */
const registries = new Registries({
  css: import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"]),
  "css?raw": import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"], {
    query: "?raw",
    import: "default",
  }),
  html: import.meta.glob(["/src/**/*.html", "!/src/rollotest/**/*.*"], {
    query: "?raw",
    import: "default",
  }),
  js: import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"]),
  "js?raw": import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"], {
    query: "?raw",
    import: "default",
  }),
  json: import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
    import: "default",
  }),
  "json?raw": import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
    query: "?raw",
    import: "default",
  }),
});

/* Returns import.
NOTE
- Supports common file types globally (as per config).
- Allows truly dynamic imports.
- Support import of src and public files; use the '@/'-prefix for src files 
  and the '/'-prefix for public files.
- Support standard and raw imports. File types that are inherently raw, such 
  as html imports as raw by default. For file types  that are typically not,
  but can be, imported as raw, such as js, raw imports are controlled with
  the '?raw' query.
- Supports an alternative Python-like syntax (src files only).
- Code changes are NOT picked up by Vite's HMR, i.e., manual browser refresh 
  is required. 
- Supports batch-imports by passing a filter function into 'use()' 
  (src files only). 
- Throws error for invalid src paths, but not for invalid public paths.
- 'use' is the central import engine of Rollo apps and should be added to the
  global namespace to enable import of src (and public) assets from public 
  and constructed assets.
- '__manifest__.js' can be used to compensate for the sligtly reduced 
  feature set for public imports (likely not relevant). */
export const use = async (specifier) => {
  /* NOTE
  - Support for serialization (raw) provides many opportunities, incl. sending over 
  the wire, posting to workers, local storage and deep string-based asset 
  construction. 
  - The similar API for src and public means that deliberate trade-off between 
    bundle size and import performance can be made by changing a single character
    ('@') in import statements. 
  */
  if (typeof specifier === "string") {
    const path = Path.create(specifier);

    /* Import from src */
    if (path.src) {
      const modules = registries.get(path.key);
      return await modules.import(path);
    }

    /* Import from public */

    if (!path.raw && path.type === "js") {
      return await pub.import(path.path);
    }
    if (!path.raw && path.type === "css") {
      /* Mimic Vite: css becomes global (albeit via link) */
      const href = path.path;
      const rel = "stylesheet";
      const selector = `link[rel="${rel}"][href="${path.path}"]`;
      let link = document.head.querySelector(selector);
      /* Check, if sheet already added */
      if (!link) {
        const { promise, resolve } = Promise.withResolvers();
        link = document.createElement("link");
        link.rel = rel;
        link.href = href;
        link.onload = (event) => resolve();
        document.head.append(link);
        /* Await link load */
        await promise;
      }
      return link;
    }
    const text = await pub.fetch(path.path);
    if (!path.raw && path.type === "json") {
      /* Mimic Vite: Return uncached parsed json */
      return JSON.parse(text);
    }
    return text;
  }
  /* Batch-import from src */
  const filter = specifier;
  const modules = [];
  for (const path of registries.specifiers(filter)) {
    modules.push(await use(path));
  }
  return modules;
};

/* Enable Python-like syntax. */
(() => {
  const proxy = syntax();
  Object.defineProperty(use, "$", {
    configurable: false,
    enumerable: false,
    get: () => {
      return proxy;
    },
  });
})();

/* Enable import from a base dir (shorter statements).
NOTE
- For ad-hoc use (no memory leaks).
- Applies to src as weel as to public (set up separately);
- Also enables Python-like syntax (also for public).  */
Object.defineProperty(use, "importer", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: (base) => {
    const proxy = syntax(base);
    return new (class {
      /* Returns import with Python-like syntax. */
      get path() {
        return proxy;
      }

      /* Returns import. */
      async import(path) {
        return await use(`${base}/${path}`);
      }
    })();
  },
});

/* Utility for importing public files. 
NOTE
- Intended as a slight;y more low-level (and less critical) feature;
  therefore kept very compact.*/
const pub = new (class {
  #fetch;
  #import;

  constructor() {
    const owner = this;

    this.#fetch = new (class {
      #registry = new Map();
      async get(path) {
        let text = this.#registry.get(path);
        if (text) {
          return text;
        }
        const response = await fetch(path);
        text = (await response.text()).trim();
        this.#registry.set(path, text);
        return text;
      }
    })();

    const construct = async (text) => {
      const blob = new Blob([text], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const module = await new Function(`return import("${url}")`)();
      URL.revokeObjectURL(url);
      return module;
    };

    this.#import = new (class {
      #registry = new Map();
      async get(path) {
        let module = this.#registry.get(path);
        if (module) {
          return module;
        }
        const text = await owner.fetch(path);
        module = await construct(`${text}\n//# sourceURL=${path}`);
        this.#registry.set(path, module);
        return module;
      }
    })();
  }

  async fetch(path) {
    return await this.#fetch.get(path);
  }

  async import(path) {
    return await this.#import.get(path);
  }
})();

/* Returns proxy factory.
NOTE
- Yep... it's a factory-factory :-) */
function syntax(base = "@") {
  return (function factory(path) {
    return new Proxy(
      {},
      {
        get: (_, part) =>
          part.includes(":")
            ? use(path + part.replaceAll(":", "."))
            : factory(path + `/${part}`),
      }
    );
  })(base);
}
