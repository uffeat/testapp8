/*
import "@/rollovite/__init__.js";
import { use } from "@/rollovite/__init__.js";
20250521
v.4.1
*/

import __types__ from "@/rollometa/public/__types__.json";
/* NOTE '__types__' relies on build tool (or manual update). */
import { Base } from "@/rollovite/modules.js";
import { syntax } from "@/rollovite/tools/_syntax.js";

export const pub = new (class {
  /* Utility for importing public files.
  - Based on the '/'-prefix syntax (Vite-aligned).
  - Supports js and all text-based file types.
  NOTE
  - Contains members that are essentailly static and could have been declared 
    out-of-scope. However, since 'pub' is a singleton and since the members in 
    question are 'pub'-specific, everything is in scope (keeps the module clean). */
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

    /* Create mechanism for importing, caching and returning pubilc js modules
    NOTE
    - Works by first importing js as text and then constructing a js module. 
      Perhaps possible to import public modules directly and perhaps that would 
      be faster?. However, that could also risk redundancy, if the module is 
      also imported as text and would also limit options for injecting text 
      pre-construction (such as sourceURL). */
    this.#_.import = new (class {
      #cache = new Map();
      #owner;

      constructor(owner) {
        /* 'owner' is the 'pub' singleton */
        this.#owner = owner;
      }

      /* Returns js module. */
      async call(path) {
        if (this.#cache.has(path)) return this.#cache.get(path);
        /* NOTE Use `this.#owner.import` to avoid risk of redundancy, if the file 
        as previously been imported as text. */
        const module = await this.#construct(
          `${await this.#owner.import(`${path}?raw`)}\n//# sourceURL=${path}`
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
    })(this);
  }

  /* Returns import from public. */
  async import(path) {
    /* Extract any 'raw' query and remove it from path 
    NOTE
    - Relevant for css, js and json */
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

class Modules extends Base {
  /* Controller for Vite import maps.
  NOTE
  - Scope:
    - Global or a list of included/excluded top-level dirs.
      Cannot be enforced, i.e., rely on usage discipline.
    - Single file type; manual alignment between the import map and the 'type' 
      kwarg required. Could be enforced, but that would hit performance 
      (slightly) therefore rely on usage discipline.
    - Raw OR non-raw. Cannot be enforced, i.e., rely on usage discipline.
  - Import maps are not copied, therefore performant construction.
  - Strictly speaking, not necessary, i.e., the 
    registry of 'app' could be safely built from Vite imports maps + meta 
    objects directly in the constructor. However, provides a clean stucture
    with minimal overhead. */
  #registry;

  constructor(map, { query, type } = {}) {
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
      query,
      type,
    });
  }
}

const app = new (class {
  /* Universal import utility. 
  NOTE
  - The central piece of the Rollo import engine. However, not exposed directly,
    but via 'use' (for a more succinct syntax). */
  #_ = {
    registry: new Map(),
  };

  constructor() {
    /* Enable Python-like import syntax for public imports */
    (() => {
      const types = new Set(__types__);
      this.#_.public = syntax("/", this, (part) => types.has(part));
    })();
  }

  /* Returns import from public (subject to any processing) with Python-like 
  syntax. */
  get public() {
    return this.#_.public;
  }

  /* Returns import from src (subject to any processing) with Python-like 
  syntax. */
  get src() {
    return this.#_.src;
  }

  /* Returns import from src or public, subject to any processing. */
  async import(path) {
    let result;
    const key = path.split(".").reverse()[0];
    if (path.startsWith("@/")) {
      /* src */
      const modules = this.#_.registry.get(key);
      if (!modules) {
        throw new Error(`Invalid key: ${key}`);
      }
      result = await modules.import(path);
    } else {
      /* public */
      result = await pub.import(path);
    }
    /* Process */
    if (this.#_.processors.has(key)) {
      const processor = this.#_.processors.get(key);
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

  /* Configures modules. Chainable. */
  modules(...spec) {
    /* Build registry for 'Modules' instances */
    spec.forEach((modules) => {
      /* Enforce no-duplication */
      if (this.#_.registry.has(modules.key)) {
        throw new Error(`Duplicate key: ${modules.key}`);
      }
      this.#_.registry.set(modules.key, modules);
    });
    /* Enable Python-like import syntax for src imports */
    this.#_.src = syntax("@", this, (part) => this.#_.registry.has(part));

    return this;
  }

  /* Configures processors. Chainable. */
  processors(spec) {
    /* Build processors.
    NOTE
    - A 'processors' registry wrapper is strictly speaking not necessary, 
    i.e., processors could be directly registed here. However, provides
    clean separation from the modules registry and keeps things tidy. */
    this.#_.processors = new (class {
      #registry = new Map();

      constructor(spec = {}) {
        Object.entries(spec).forEach(([key, processor]) => {
          /* Enforce no-duplication */
          if (this.#registry.has(key)) {
            throw new Error(`Duplicate key: ${key}`);
          }
          this.#registry.set(key, processor);
        });
      }

      get(key) {
        return this.#registry.get(key);
      }

      has(key) {
        return this.#registry.has(key);
      }
    })(spec);

    return this;
  }
})()
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
    )
  )
  /* NOTE Currently not used (no need), but cheap to keep. */
  .processors({});

export const use = new Proxy(() => {}, {
  /* Unviversal import utility.
  Supports:
    - Truly dynamic imports.
    - Import from src as well as public using the '@/' and '/'-syntax.
    - Common file types.
    - Raw imports.
    - Alternative Python-like-syntax.
    - Creation of "importers" that import from base dirs.
  - Zero-config.
  - Fast and memory-efficient (imports maps are not copied).
  - Use 'Modules' (rollovite/modules.js), if need for:
    - Narrower dir scope.
    - Hanlding of non-common file types.
    - Special post-processing.
    - Batch imports.
    - Hooks.
    - Introspection.
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

  NOTE
  - The central piece of the Rollo import engine API.
  - Based on in-module defined import maps and processors. This 
    config is not exposed as it is fundamental and should not be 
    tampered with.
  - Really no need to export, since added to global namespace, but explicit 
    import can silence barking linters. 
  - A slightly better performance could be achieved by refactoring 'use' to be a 
    function that wraps 'app.import' and then do `Object.defineProperty` to 
    patch-on selected members of 'app'. However, the proxy pattern is more 
    elegant and easier to maintain. */
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
