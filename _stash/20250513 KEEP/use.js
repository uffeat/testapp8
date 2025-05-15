/*
import { use } from  "@/rollovite/use.js";
20250513
v.1.1
Suite of utilities for importing assets.
*/

/* Do NOT import files that uses 'use'! */

/* Wrapped for Vite import maps (loaders). 
NOTE
- Wrapped loaders should be single-file type.
- 'key' should match the file type and any query, e.g.,
  'js' or 'js?raw'. Since loader keys are paths without any query information,
  'key' enables construction of unique path specifiers and provides a way
  to identify relevant registry from path specifier.
- Although tyically used for wrapping Vite loaders, i.e., objects returned by 
  'import.meta.glob', custom objects with similar shape can also be used.  */
class Registry {
  #key;
  #loaders;
  #paths;
  constructor(key, loaders) {
    this.#key = key;
    this.#loaders = loaders;
    this.#paths = Object.keys(loaders);
  }

  /* Returns (async) load function. */
  get(path) {
    const load = this.#loaders[`/src/${path.slice("@/".length)}`];
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
    const query = this.#key.includes("?")
      ? `?${this.#key.split("?").reverse()[0]}`
      : "";
    const specifiers = this.#paths.map(
      (path) => `@/${path.slice("/src/".length)}${query}`
    );
    if (filter) {
      return specifiers.filter(filter);
    }
    return specifiers;
  }
}

/* Utility for managing multipe registries. 
NOTE
- Sub-registries should be unique with respect to key/type combinations. */
class Registries {
  #registry = new Map();

  constructor(spec) {
    Object.entries(spec).forEach(([key, loaders]) => {
      this.#registry.set(key, new Registry(key, loaders));
    });
  }

  /* Returns (async) load function. */
  get(key, path) {
    const registry = this.#registry.get(key);
    if (!registry) {
      throw new Error(`Invalid key: ${key}`);
    }
    const load = registry.get(path);
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    return load;
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
    let [path, raw] = specifier.endsWith("?raw")
      ? [specifier.slice(0, -"?raw".length), true]
      : [specifier, false];
    const type = path.split(".").reverse()[0];
    /* Import from src */
    if (path.startsWith("@/")) {
      const key = raw ? `${type}?raw` : type;
      const load = registries.get(key, path);
      return await load();
    }
    /* Import from public */
    path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
    if (!raw && type === "js") {
      return await pub.import(path);
    }
    if (!raw && type === "css") {
      /* Mimic Vite: css becomes global (albeit via link) */
      const href = path;
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
    const text = await pub.fetch(path);
    if (!raw && type === "json") {
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
