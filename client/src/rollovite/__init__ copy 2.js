/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250522
v.4.4
*/

/* TODO
- Keep an eye on dir scopes for registered 'Modules' instances. 
  Should effectively have global coverage, but leave out dirs and file 
  extensions not used by the actual app. Doing so is verbose, but worth it.
  Such narrowing does of course NOT affect imports from public!
*/

import { Base } from "@/rollovite/modules.js";

/* Global import utility that supports:
- Truly dynamic imports.
- Import from src ('@/'-prefix) and from public ('/'-prefix).
- Common file types.
- Raw imports.
- Alternative Python-like-syntax.
- Creation of ad-hoc "importers" that import from base dirs. */
export const use = new Proxy(() => {}, {
  get: (_, key) => app[key],
  apply: (_, __, args) => app.import(...args),
});

/* Make 'use' global */
Object.defineProperty(window, "use", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: use,
});

/* Utility for importing public files. */
const pub = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    /* Create mechanism for importing, caching and returning pubilc files as 
    text */
    this.#_.fetch = new (class {
      #cache = new Map();

      /* Returns file text. */
      async call(path) {
        if (this.#cache.has(path)) return this.#cache.get(path);
        const text = (await (await fetch(path)).text()).trim();
        this.#cache.set(path, text);
        return text;
      }
    })();

    /* Create mechanism for importing, caching and returning pubilc js 
    modules */
    this.#_.import = new (class {
      #cache = new Map();

      /* Returns js module. */
      async call(path) {
        if (this.#cache.has(path)) return this.#cache.get(path);
        /* NOTE Use `owner.import` to avoid risk of redundancy, if the file 
        as previously been imported as text. */
        const module = await this.#construct(
          `${await owner.import(`${path}?raw`)}\n//# sourceURL=${path}`
        );
        this.#cache.set(path, module);
        return module;
      }

      /* Returns js module constructed from text. */
      #construct = async (text) => {
        const url = URL.createObjectURL(
          new Blob([text], { type: "text/javascript" })
        );
        /* Construct import function to prevent Vite from barking at truly 
        dynamic imports in production. */
        const module = await new Function(`return import("${url}")`)();
        URL.revokeObjectURL(url);
        return module;
      };
    })();
  }

  /* Returns import from public. */
  async import(path) {
    /* Extract any 'raw' query and remove it from path 
    (relevant for css, js and json) */
    const raw = (() => {
      if (path.endsWith("?raw")) {
        path = path.slice(0, -"?raw".length);
        return true;
      }
    })();
    const type = path.split(".").reverse()[0];
    if (!raw && type === "js") return await this.#_.import.call(path);
    /* Normalize path AFTER handling of non-raw js to ensure that 'path' is 
    not normalized twice when this.#_.import calls 'import' */
    path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
    /* Mimic Vite: css becomes global (albeit via link) */
    if (!raw && type === "css") return await this.#link(path);
    const result = await this.#_.fetch.call(path);
    /* Mimic Vite: Return uncached parsed json */
    if (!raw && type === "json") return JSON.parse(result);
    return result;
  }

  /* Adds and returns stylesheet link. */
  #link = async (path) => {
    const href = path;
    const rel = "stylesheet";
    const selector = `link[rel="${rel}"][href="${href}"]`;
    let link = document.head.querySelector(selector);
    /* Check, if link already added */
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
  };
})();

/* Controller for Vite import maps. */
class Modules extends Base {
  #registry;

  constructor(map, { query, type } = {}) {
    super();
    this.#registry = map;
    /* Pass kwargs into 'super.__new__' (rather than 'super') to enable config 
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
      query,
      type,
    });
  }
}

/* Global import utility. */
const app = new (class {
  #_ = {
    registry: new Map(),
  };

  constructor() {
    const owner = this;

    this.#_.processors = new (class {
      #registry = new Map();

      add(spec, { cache = true } = {}) {
        Object.entries(spec).forEach(([key, processor]) => {
          /* Enforce no-duplication */
          if (this.#registry.has(key)) {
            throw new Error(`Duplicate key: ${key}`);
          }

          this.#registry.set(
            key,
            /* Wrap in class to provide caching */
            new (class {
              #cache = new Map();
              /* Returns processed result (freshly created or from cache). */
              async call(path, result) {
                if (!cache)
                  return await processor.call(null, result, {
                    /* Give processor access to owner (enables dog-fooding) */
                    owner,
                    path,
                  });
                if (this.#cache.has(path)) return this.#cache.get(path);
                /* Use 'call', so that processor can be an object with a 'call' 
                method or a non-arrow that exploits its context. */
                const processed = await processor.call(null, result, {
                  /* Give processor access to owner (enables dog-fooding) */
                  owner,
                  path,
                });
                this.#cache.set(path, processed);
                return processed;
              }
            })()
          );
        });

        return owner;
      }

      /* Returns class-wrapped processor. */
      get(key) {
        return this.#registry.get(key);
      }

      /* Checks, if processor registered. */
      has(key) {
        return this.#registry.has(key);
      }


    })();

    /* Enable Python-like import syntax for imports */
    const _factory = (base) =>
      function factory(path) {
        return new Proxy(() => {}, {
          get: (_, part) =>
            path ? factory(path + `/${part}`) : factory(`${base}${part}`),
          apply: (_, __, args) => owner.import(`${path}.${args[0]}`),
        });
      };
    this.#_.public = () => _factory("/")();
    this.#_.src = () => _factory("@/")();
  }

  /* */
  get processors() {
    return this.#_.processors
  }

  /* Returns import from public (subject to any processing) with Python-like 
  syntax. */
  get public() {
    return this.#_.public();
  }

  /* Returns import from src (subject to any processing) with Python-like 
  syntax. */
  get src() {
    return this.#_.src();
  }

  /* Returns import from src or public, subject to any processing. */
  async import(path) {
    let result;
    const key = path.split(".").reverse()[0];
    if (path.startsWith("@/")) {
      /* Import from src */
      const modules = this.#_.registry.get(key);
      if (!modules) {
        throw new Error(`Invalid key: ${key}`);
      }
      result = await modules.import(path);
    } else {
      /* Import from public */
      result = await pub.import(path);
    }
    /* Process */
    if (this.#_.processors.has(key)) {
      const processor = this.#_.processors.get(key);
      const processed = await processor.call(path, result);
      if (processed !== undefined) {
        return processed;
      }
    }
    return result;
  }

  /* Returns function that imports from base (with string syntax). */
  importer(base) {
    return async (path) => await this.import(`${base}/${path}`);
  }

  /* Registers modules. Chainable. */
  modules(...spec) {
    /* Build registry for 'Modules' instances */
    spec.forEach((modules) => {
      /* Enforce no-duplication */
      if (this.#_.registry.has(modules.key)) {
        throw new Error(`Duplicate key: ${modules.key}`);
      }
      this.#_.registry.set(modules.key, modules);
    });

    /* Prevent method from being called again */
    delete this.modules;

    return this;
  }

  
})()
  /* Configure */
  .modules(
    new Modules(
      import.meta.glob([
        "/src/**/*.css",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
        "!/src/rollovite/**/*.*",
      ]),
      {
        type: "css",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.css",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        query: "?raw",
        type: "css",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.html",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        /* NOTE Do NOT register query! */
        type: "html",
      }
    ),
    new Modules(
      import.meta.glob([
        "/src/**/*.js",
        "!/src/main.js",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
        "!/src/rollovite/**/*.*",
      ]),
      {
        type: "js",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.js",
          "!/src/main.js",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        query: "?raw",
        type: "js",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.json",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollometa/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          import: "default",
        }
      ),
      {
        type: "json",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.json",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollometa/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        query: "?raw",
        type: "json",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.svg",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollometa/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        /* NOTE Do NOT register query! */
        type: "svg",
      }
    ),

    /* Non-common types from here... */

    new Modules(
      import.meta.glob(
        [
          "/src/**/*.csv",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        /* NOTE Do NOT register query! */
        type: "csv",
      }
    ),
    new Modules(
      import.meta.glob(
        [
          "/src/**/*.md",
          "!/src/assets/**/*.*",
          "!/src/main/**/*.*",
          "!/src/rollotest/**/*.*",
          "!/src/rollovite/**/*.*",
        ],
        {
          query: "?raw",
          import: "default",
        }
      ),
      {
        /* NOTE Do NOT register query! */
        type: "md",
      }
    )
  )
  .processors.add({
    csv: async (result, { owner }) =>
      /* Protect against mutation */
      JSON.stringify(
        (await owner.import("@/rollolibs/papa.js")).Papa.parse(result)
      ),
    md: async (result, { owner }) =>
      (await owner.import("@/rollolibs/marked.js")).parse(result).trim(),
  })

/* NOTE

Re 'app'
- Central piece of the Rollo import engine. However, not exposed directly,
  but via 'use' (for a more succinct syntax).
- Importers created with 'app.importer' support string syntax only; 
  The benefits of the Python-like syntax are limited, when imports strings 
  are short. 

Re 'use':
- The central piece of the Rollo import engine API.
- Zero-config. Based on in-module defined import maps and processors. This 
  config is not exposed as it is fundamental and should not be 
  tampered with.
- Fast and memory-efficient (imports maps are not copied).
- Import from src or public? Import from src is faster, but also increases 
  bundle size. Moreover, in certain cases, only src import is possible, e.g.,
  when using node modules or Vite-specific features.
  Therefore:
  - Actual app: Import from src, unless dealing with very large file volumes,
    e.g., large number statically generated html files and/or small sizes,
    e.g., icon collections.
  - Testing: Prefer public. Although src .test.js files can be treeshaken out 
    and/or configured as external, it's cleaner to place in public.
  - SSG and other pre-building tasks: Prefer public, but likely that src is
    the only option due to the public import limitations mentioned.
  When serving the app from Vercel the difference between src and public imports 
  is surprisingly small!
- Really no need to export, since added to global namespace, but explicit 
  import can silence barking linters. 
- A slightly better performance could be achieved by refactoring 'use' to be a 
  function that wraps 'app.import' and then do `Object.defineProperty` to 
  patch-on selected members of 'app'. However, the proxy pattern is more 
  elegant and easier to maintain.

Re 'Modules':
- Scope:
  - Global or a list of included/excluded top-level dirs.
    Cannot be enforced, i.e., rely on usage discipline.
  - Single file type; manual alignment between the import map and the 'type' 
    kwarg required. Could be enforced, but that would hit performance 
    (slightly) therefore rely on usage discipline.
  - Raw OR non-raw. Cannot be enforced, i.e., rely on usage discipline.
- Import maps are not copied, therefore performant construction.


Re 'pub':
- Based on the '/'-prefix syntax (Vite-aligned).
- Supports js and all text-based file types.
    
*/
