/*
import { use } from  "@/rollovite/use.js";
20250513
v.1.1
Suite of utilities for using assets.
*/

/* Do NOT import files that uses 'use'! */

class ImportMap {
  #loaders;
  #paths;
  constructor(loaders) {
    this.#loaders = loaders;
    this.#paths = Object.keys(loaders);
  }

  get(path) {
    if (typeof path === "string") {
      const load = this.#loaders[`/src/${path.slice("@/".length)}`];
      return load;
    }
    /* 'path' is a filter function */
    const filter = path;
    const paths = this.#paths.filter((path) =>
      filter(`@/${path.slice("/src/".length)}`)
    );
    return paths.map((path) => this.get(path));
  }
}

class ImportMaps {
  #registry = new Map();

  constructor(spec) {
    Object.entries(spec).forEach(([key, loaders]) => {
      this.#registry.set(key, new ImportMap(loaders));
    });
  }

  get(key) {
    return this.#registry.get(key);
  }
}

const import_maps = new ImportMaps({
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
- Supports common file types globally (as per config), src and public.
- Allows truly dynamic imports.
- Uses the '@/'-syntax for src files and the '/'-syntax for public files.
- Supports alternative Python-like syntax (for src files only).
- Code changes are NOT picked up by Vite's HMR, i.e., manual browser refresh 
  is required. 
- Supports batch-imports with async 'use.batch()' (for src files only). 
- Throws error for invalid src paths, but not for invalid public paths. */

/* TODO
- path as func -> batch import */
export const use = async (path) => {
  /*  */
  const raw = (() => {
    if (path.endsWith("?raw")) {
      path = path.slice(0, -"?raw".length);
      return true;
    }
    return false;
  })();
  const type = path.split(".").reverse()[0];

  if (path.startsWith("@/")) {
    const key = raw ? `${type}?raw` : type;

    const import_map = import_maps.get(key);
    if (!import_map) {
    }

    const load = import_map.get(path);

    if (!load) {
      throw new Error(`Invalid path: ${path}`);
    }
    return await load();
  }
  /* Import from public */
  path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  if (!raw && type === "js") {
    return await pub.import(path);
  }
  const text = await pub.fetch(path);
  if (!raw && type === "json") {
    return JSON.parse(text);
  }
  return text;
};

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
