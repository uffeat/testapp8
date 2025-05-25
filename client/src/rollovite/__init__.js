/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250523
v.4.5
*/

/* TODO
- Direct js import from public
- Reuse constructed import func
- Reimplement Path for more advanced query handling, incl.:
  - Path.create
  - path.query.has()
- Implement '?nocache' option that signals
  - No caching of public assets
  - return copy of src js
  - No caching in processors

- Aliases (exposed), that enables e.g.
  - use.component
- Perhaps sep out a src singleton
- Keep an eye on dir scopes for Vite import maps (globs). 
  Should effectively have global coverage, but leave out dirs and file 
  extensions not used by the actual app. Doing so is verbose, but worth it.
  Such narrowing does of course NOT affect imports from public!
*/

/* Global import utility that supports:
- Truly dynamic imports.
- Import from src ('@/'-prefix) and from public ('/'-prefix).
- Common of file types.
- Raw imports.
- Alternative Python-like-syntax.
- Creation of ad-hoc "importers" that import from base dirs.
- Safe access to registered import maps for reusability. */
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
      #_ = {
        cache: new Map(),
        import: Function('path', 'return import(path)')
      }

      /* Returns js module. */
      async call(path) {
        if (this.#_.cache.has(path)) return this.#_.cache.get(path);
        const module = await this.#_.import(path)
        this.#_.cache.set(path, module);
        return module;
      }

      
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

/* Global import utility. */
const app = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    this.#_.maps = new (class {
      #registry = new Map();

      /* Adds import maps. Chainable with respect to owner. */
      add(...specs) {
        specs.forEach((spec) => {
          Object.entries(spec).forEach(([key, map]) => {
            /* Enforce no-duplication */
            if (this.#registry.has(key)) {
              throw new Error(`Duplicate key: ${key}`);
            }
            this.#registry.set(
              key,
              /* Wrap in class to encapsulate and decentralize path 
              conversion. */
              new (class {
                #map;

                constructor(_map) {
                  this.#map = _map;
                }

                /* Returns copy of import map with normalized paths, 
                optionally filtered, optionally as Map instance.
                For external use ONLY. */
                copy(filter, { format = "object" } = {}) {
                  const entries = (() => {
                    const _entries = Object.entries(this.#map).map(
                      ([path, load]) => [
                        `@/${path.slice("/src/".length)}`,
                        load,
                      ]
                    );
                    return filter
                      ? _entries.filter(([path, load]) => filter(path))
                      : _entries;
                  })();

                  return format === "object"
                    ? Object.fromEntries(entries)
                    : new Map(entries);
                }

                /* Returns load function. */
                get(specifier) {
                  const path = (() => {
                    const _path = `/src/${specifier.slice("@/".length)}`;
                    return _path.endsWith("?raw")
                      ? _path.slice(0, -"?raw".length)
                      : _path;
                  })();
                  const load = this.#map[path];
                  if (!load) {
                    throw new Error(`Invalid path: ${specifier}`);
                  }
                  return load;
                }
              })(map)
            );
          });
        });
        return owner;
      }

      /* Returns wrapped import map. */
      get(key) {
        /* key is likely valid -> most efficient to use 'get' 
        directly without a 'has' step. */
        const wrapped = this.#registry.get(key);
        if (!wrapped) {
          throw new Error(`Invalid key: ${key}`);
        }
        return wrapped;
      }
    })();

    this.#_.processors = new (class {
      #registry = new Map();

      /* Adds processors. Chainable with respect to owner. */
      add(...specs) {
        specs.forEach((spec) => {
          Object.entries(spec).forEach(([key, processor]) => {
            const cache = (() => {
              if (key.endsWith("?cache")) {
                key = key.slice(0, -"?cache".length);
                return true;
              }
            })();
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
        });
        return owner;
      }

      /* Returns class-wrapped processor. */
      get(key) {
        return this.#registry.get(key);
      }

      /* Checks, if key registered. */
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

  /* Returns maps controller (unavailable post-freeze). */
  get maps() {
    return this.#_.maps;
  }

  /* Returns processors controller (unavailable post-freeze). */
  get processors() {
    return this.#_.processors;
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

  /* Prevents registration of maps and access to processors from API. 
  Chainable. */
  freeze() {
    /* NOTE Safe to expose controlled read access to import maps, but not to 
    processors (risk of cache access). */
    delete this.maps.add;
    delete this.processors;
    return this;
  }

  /* Returns import from src or public, subject to any processing. */
  async import(specifier) {
    /* Get key for src import and processing */
    const key = specifier.split(".").reverse()[0];
    /* Import */
    const result = specifier.startsWith("@/")
      ? await this.maps.get(key).get(specifier)(specifier)
      : await pub.import(specifier);
    /* Process */
    /* NOTE No processing is more likely than processing -> use 'has' 
    initially and not 'get' directly */
    if (this.#_.processors.has(key)) {
      const processor = this.#_.processors.get(key);
      const processed = await processor.call(specifier, result);
      if (processed !== undefined) return processed;
    }
    return result;
  }

  /* Returns ad-hoc function that imports from base (with string syntax). */
  importer(base) {
    return async (path) => await this.import(`${base}/${path}`);
  }
})();

/* Add support for most common file types */
app.maps
  .add({
    css: import.meta.glob([
      "/src/**/*.css",
      "!/src/assets/**/*.*",
      "!/src/main/**/*.*",
      "!/src/rollotest/**/*.*",
      
    ]),
    "css?raw": import.meta.glob(
      [
        "/src/**/*.css",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
       
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    html: import.meta.glob(
      [
        "/src/**/*.html",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
       
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    js: import.meta.glob([
      "/src/**/*.js",
      "!/src/main.js",
      "!/src/assets/**/*.*",
      "!/src/main/**/*.*",
      "!/src/rollotest/**/*.*",
      
    ]),
    "js?raw": import.meta.glob(
      [
        "/src/**/*.js",
        "!/src/main.js",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
        
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    json: import.meta.glob(
      [
        "/src/**/*.json",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
        
      ],
      {
        import: "default",
      }
    ),
    "json?raw": import.meta.glob(
      [
        "/src/**/*.json",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
        
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
    svg: import.meta.glob(
      [
        "/src/**/*.svg",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollometa/**/*.*",
        "!/src/rollotest/**/*.*",
       
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })

  /* Add csv support */
  .maps.add({
    csv: import.meta.glob(
      [
        "/src/**/*.csv",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
       
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })
  .processors.add({
    csv: async (result, { owner }) =>
      (await owner.import("@/rollolibs/papa.js")).Papa.parse(result),
  })

  /* Add md support */
  .maps.add({
    md: import.meta.glob(
      [
        "/src/**/*.md",
        "!/src/assets/**/*.*",
        "!/src/main/**/*.*",
        "!/src/rollotest/**/*.*",
        
      ],
      {
        query: "?raw",
        import: "default",
      }
    ),
  })
  .processors.add({
    "md?cache": async (result, { owner }) =>
      (await owner.import("@/rollolibs/marked.js")).parse(result).trim(),
  })

  /* Prevent config tampering */
  .freeze();

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
Re 'pub':
- Based on the '/'-prefix syntax (Vite-aligned).
- Supports js and all text-based file types.
*/
