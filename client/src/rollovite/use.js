/*
import { use } from  "@/rollovite/use.js";
20250514
v.1.2
Suite of utilities for importing assets.
*/

/* Do NOT import files that uses 'use'! */
import { Modules } from "@/rollovite/modules.js";
import { Path } from "@/rollovite/tools/_path.js";
import { Processor } from "@/rollovite/tools/_processor.js";
import { syntax } from "@/rollovite/tools/_syntax.js";
import { assets } from "@/rollovite/tools/assets.js";

/* 
Utility for managing multipe Module instances. 
NOTE
- Responsibilities:
  - Register and encapsulate core 'Modules' instances.
  - Act as a broker registry between 'Modules' instances and 'use'.
  - Enable addition of features to the central Rollo import engine in a way 
    that does not affect the performance and robustness of its core features. */
export const _use = new (class {
  #paths
  #processors;
  #registry = new Map();

  constructor(spec) {

    // TODO on-demand - or even better not a hard registry = the registries are already there
    // ...A CASE FOR DOM AS REG?
    this.#paths = []
    assets.paths.forEach((path) => {
      this.#paths.push(path)
      if (path.endsWith('css') || path.endsWith('js') || path.endsWith('json')) {
        this.#paths.push(`${path}?raw`)
      }
    })


    Object.entries(spec).forEach(([key, modules]) => {
      this.#registry.set(key, modules);

      modules.paths.forEach((path) => this.#paths.push(`${path}${modules.query}`) )

    });

    


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
  }

  get processors() {
    return this.#processors;
  }

  async batch(filter) {}

  async import(path) {
    const type = path.split(".").reverse()[0];
    const raw = (() => {
      if (path.endsWith("?raw")) {
        path = path.slice(0, -"?raw".length);
        return true;
      }
    })();
    let result;
    if (path.startsWith("@/")) {
      const key = raw ? `${type}?raw` : type;
      const modules = this.#registry.get(key);
      if (!modules) {
        throw new Error(`Invalid key: ${key}`);
      }
      result = await modules.import(path)
    } else {
      result = await assets.import(raw ? `${path}?raw` : path);
    }

    if (this.processors.has(path.key)) {
        const processor = this.processors.get(path.key);
        const processed = await processor.call(null, path, result);
        /* Ignore undefined */
        if (processed !== undefined) {
          return processed;
        }
      }
      return result;
    

  }

  

  has(path) {
    
  }

  paths(filter) {

   
  }

  
})(
  /* Configure global-scope Module instances for common file types, incl. raw 
  where relevant. */

  /* TODO
  - No need to explicitly set keys - construct from modules; and feed as ars instead;
  - Perhaps exlcude more top-level dirs, incl.
    - rollometa
    - rollovite */

  {
    css: new Modules(
      import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"]),
      {
        type: 'css',
        strict: false,
      }
    ),
    "css?raw": new Modules(
      import.meta.glob(["/src/**/*.css", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      {
        query: "?raw",
        type: 'css',
        strict: false,
      }
    ),
    html: new Modules(
      import.meta.glob(["/src/**/*.html", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      {
        query: "?raw",
        type: 'html',
        strict: false,
      }
    ),
    js: new Modules(
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"]),
      {
        strict: false,
      }
    ),
    "js?raw": new Modules(
      import.meta.glob(["/src/**/*.js", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      {
        query: "?raw",
        type: 'js',
        strict: false,
      }
    ),
    json: new Modules(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
        import: "default",
      }),
      {
        type: 'json',
        strict: false,
      }
    ),
    "json?raw": new Modules(
      import.meta.glob(["/src/**/*.json", "!/src/rollotest/**/*.*"], {
        query: "?raw",
        import: "default",
      }),
      {
        query: "?raw",
        type: 'json',
        strict: false,
      }
    ),
  }
);

/* Returns import.
NOTE
- Central piece of Rollo's import API. Added to the global namespace and can
  therefore also be used from e.g., public and constructed assets.
- Allows truly dynamic imports.
- Support import of src ('@/'-prefix) and public files ('/'-prefix).
- Support standard and raw imports. File types that are inherently raw, such 
  as html imports as raw by default. For file types that are typically not,
  but can be, imported as raw, such as js, raw imports are controlled with
  the '?raw' query.
- Supports batch-imports by passing a filter function into 'use()' 
  (src files only).
- Supports an alternative Python-like syntax (src files only).
- Supports creation of "importers" for import from given base dirs;
  can be used ad hoc without performance overhead. Applies to src as well as
  public. Also supports Python-like syntax.
- Throws error for invalid src paths, but not for invalid public paths.
- Code changes are NOT picked up by Vite's HMR, i.e., manual browser refresh 
  is required. */
export const use = (() => {
  /* TODO
  - Simplyfy Path. No longer used elsewhere. */

  const use = async (specifier) => {
    if (typeof specifier === "function") {
      /* Batch-import by filter */
      const filter = specifier;
      const result = [];
      for (const modules of registry.values()) {
        const imports = await modules.import(filter);
        imports.forEach((item) => result.push(item));
      }
      return result;
    }
    const path = Path.create(specifier);
    /* Import from src */
    if (path.src) {
      const modules = registry.get(path.key);

      let result = await modules.import(specifier);

      if (registry.processors.has(path.key)) {
        const processor = registry.processors.get(path.key);
        const processed = await processor.call(null, path.path, result);
        /* Ignore undefined */
        if (processed !== undefined) {
          return processed;
        }
      }
      return result;
    }
    /* Import from public */
    if (!path.raw && path.type === "js") {
      return await assets.import(path.path);
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
    const text = await assets.fetch(path.path);
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
  - Also enables Python-like syntax (also for public). */
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

  /* Make 'use' global */
  Object.defineProperty(window, "use", {
    configurable: false,
    enumerable: true,
    writable: false,
    value: use,
  });

  return use;
})();
