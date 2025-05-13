/*
import { paths, url, use } from  "@/rollovite/rollovite.js";
20250513
v.1.0
Suite of utilities for using assets.
*/

/* Do NOT import files that use 'use'! */

/* Create import maps and related data */
const config = {
  url: {
    registry: import.meta.glob(["/src/assets/**/*.*"], {
      query: "?url",
      import: "default",
    }),
  },
  use: {
    default: {
      registry: import.meta.glob([
        "/src/**/*.css",
        "/src/**/*.js",
        "/src/**/*.json",
        "!/src/rollotest/**/*.*",
      ]),
      types: new Set(["css", "js", "json"]),
    },
    raw: {
      registry: import.meta.glob(
        ["/src/**/*.html", "/src/**/*.sheet", "!/src/rollotest/**/*.*"],
        { query: "?raw", import: "default" }
      ),
      types: new Set(["html", "sheet"]),
    },
  },
};

/* Utility for inspection of mapped paths. */
export const paths = new (class {
  #array;
  #set;

  /* Checks, if path mapped. */
  has(path) {
    if (!this.#set) {
      this.#set = new Set(this.paths());
    }
    return this.#set.has(path);
  }

  /* Returns array of mapped paths, optionally subject to filter. */
  paths(filter) {
    if (!this.#array) {
      this.#array = Object.freeze(
        [
          ...Object.keys(config.url.registry),
          ...Object.keys(config.use.default.registry),
          ...Object.keys(config.use.raw.registry),
        ].map((path) => `@/${path.slice("/src/".length)}`)
      );
    }
    return filter ? this.#array.filter(filter) : this.#array;
  }

  /* Returns number of mapped paths, optionally subject to filter. */
  size(filter) {
    return this.paths(filter).length;
  }
})();

/* Returns environment- and source-adjusted url suitable for e.g., img src 
and link href.
NOTE
- Uses the '@/'-syntax for urls in src and the '/'-syntax for urls in public.
- Returns promise for urls in src, i.e., should be used with await; 
  not the case for urls in public. */
export const url = (path) => {
  if (path.startsWith("@/")) {
    path = `/src/${path.slice("@/".length)}`;
    return config.url.registry[path]();
  } else {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
};

/* Returns import.
NOTE
- Supports common file types globally (as per config), src and public.
- Allows truly dynamic imports.
- Uses the '@/'-syntax for src files and the '/'-syntax for public files.
- Supports alternative Python-like syntax (for src files only).
- Code changes are NOT picked up by Vite's HMR, i.e., manual browser refresh 
  is required. 
- 'use.path' provides access to the 'path' utility.
- Supports batch-imports with async 'use.batch()' (for src files only). 
- Throws error for invalid src paths, but not for invalid public paths. */
export const use = async (path) => {
  const type = path.split(".").reverse()[0];
  if (path.startsWith("@/")) {
    path = `/src/${path.slice("@/".length)}`;
    let load;
    if (config.use.default.types.has(type)) {
      load = config.use.default.registry[path];
    } else if (config.use.raw.types.has(type)) {
      load = config.use.raw.registry[path];
    }
    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    return await load();
  }
  /* Import from public */
  path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  if (type === "js") {
    return await pub.import(path);
  }
  return await pub.fetch(path);
};

/* Enable access to the 'path' utility from 'use' */
Object.defineProperty(use, "paths", {
  configurable: false,
  enumerable: false,
  get: () => paths,
});

/* Enable Python-like syntax. */
Object.defineProperty(use, "$", {
  configurable: false,
  enumerable: false,
  get: () => {
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
    })("@");
  },
});

/* Enable batch-imports from 'use' */
Object.defineProperty(use, "batch", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: async (filter) => {
    const modules = [];
    for (const path of paths.paths(filter)) {
      modules.push(await use(path));
    }
    return modules;
  },
});

/* Utility for importing public files. */
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
