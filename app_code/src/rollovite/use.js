/*
import { use } from  "@/rollovite/use.js";
20250514
v.1.2
Suite of utilities for importing assets.
*/

/* Do NOT import files that uses 'use'! */

/* Utility for parsing path. 
NOTE
- Keep private. */
class Path {
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

  /* Returns combined file type and query. */
  get key() {
    if (this.#key === undefined) {
      this.#key = this.raw ? `${this.type}${Path.RAW_QUERY}` : this.type;
    }
    return this.#key;
  }

  /* Returns actual path.
  NOTE
  - Reconciles src paths with respect to the '@/'-syntax.
  - Adjusts public paths with respect environment.
  - Strips away any queries. */
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

  /* Returns query with '?'-prefix. Returns empty string, if no query. */
  get query() {
    if (this.#query === undefined) {
      this.#query = this.specifier.includes("?")
        ? `?${this.specifier.split("?").reverse()[0]}`
        : "";
    }
    return this.#query;
  }

  /* Returns raw flag. */
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

  /* Returns original path specifier. */
  get specifier() {
    return this.#specifier;
  }

  /* Returns file type. */
  get type() {
    if (this.#type === undefined) {
      this.#type = this.path.split(".").reverse()[0];
    }
    return this.#type;
  }
}

/* Controller for Vite loaders (results of 'import.meta.glob'). 
NOTE
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
  shape can also be used. 
- Intended as a key part of Rollo's central import engine, but can be used 
  stand-alone in a more local/specialized context or to extend the central 
  import engine. */
export const Modules = (() => {
  /* Utility for post-processing import result. */
  class Processor {
    #owner;
    #processor;
    #cache = new Map();

    constructor(owner, processor) {
      this.#owner = owner;
      this.#processor = processor;
    }

    /* Provides full exposure of cache. */
    get cache() {
      return this.#cache;
    }

    /* Returns owner (Modules instance). */
    get owner() {
      return this.#owner;
    }

    /* Returns processor callable. */
    get processor() {
      return this.#processor;
    }

    /* Sets processor callable.
  NOTE
  - Can be replaced from inside the processor function itself via the 'owner' 
    kwarg. */
    set processor(processor) {
      this.#processor = processor;
    }

    /* Invokes post-processing of import.
  NOTE
  - Called as post-processor. */
    async call(context, path, result) {
      /* NOTE
    - 'path' is a Path instance. */
      if (this.#cache.has(path.path)) {
        return this.#cache.get(path.path);
      }
      const processed = await this.processor.call(this, result, {
        owner: this,
        path,
      });
      this.#cache.set(path.path, processed);
      return processed;
    }
  }

  return class Modules {
    #key;
    #loaders;
    #processor;
    #query;
    #type;

    constructor(key, loaders) {
      this.#key = key;
      this.#loaders = loaders;

      const [type, query] = key.split("?");
      this.#type = type;
      this.#query = query ? `?${query}` : "";
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
        this.#processor = new Processor(processor);
      } else {
        if (this.#processor instanceof Processor) {
          this.#processor.cache.clear();
        }
        this.#processor = null;
      }
      return this.#processor;
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
      if (this.processor) {
        const processed = await this.processor.call(this, path, result);
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
  };
})();

/* Configure global-scope Module instances for common file types, incl. raw 
where relevant.  */
export const registries = (() => {
  /* Utility for managing multipe Module instances. 
NOTE
- . */
  class Registries {
    #registry = new Map();

    constructor(spec) {
      Object.entries(spec).forEach(([key, loaders]) => {
        this.#registry.set(key, new Modules(key, loaders));
      });
    }

    /* Returns 'Modules' instance. */
    get(key) {
      const modules = this.#registry.get(key);
      if (!modules) {
        throw new Error(`Invalid key: ${key}`);
      }
      return modules;
    }

    keys() {
      return his.#registry.keys();
    }

    values() {
      return this.#registry.values();
    }
  }

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

  return registries;
})();

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
- 'use' is the central API of Rollo's import engine and should be added to the
  global namespace to enable import of src (and public) assets from public 
  and constructed assets. */
export const use = (() => {
  /* Utility for importing public files. 
NOTE
- Intended as a slightly more low-level (and less critical) feature;
  therefore kept very compact.
- '__manifest__.js' can be used to compensate for the sligtly reduced 
  feature set for public imports (likely not relevant). */
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

  const use = async (specifier) => {
    /* NOTE
  - Support for serialization (raw) provides many opportunities, incl. 
    submission over the wire, posting to workers, local storage and deep 
    string-based asset construction. 
  - The similar API for src and public means that deliberate trade-offs between 
    bundle size and import performance can be made by changing a single character
    ('@') in import statements. */
    if (typeof specifier === "function") {
      /* Batch-import by filter */
      const filter = specifier;
      const result = [];
      for (const modules of registries.values()) {
        const imports = await modules.import(filter);
        imports.forEach((item) => result.push(item));
      }
      return result;
    }
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

  return use;

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
})();
