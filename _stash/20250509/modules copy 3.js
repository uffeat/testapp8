/*
rollovite/modules.js
20250509
v.3.0
*/

/* NOTE Do NOT import modules that uses 'modules'! */
import { Cache } from "@/rollo/tools/cache.js";
import { assign } from "@/rollo/tools/assign.js";
import { module } from "@/rollo/tools/module.js";
import paths from "@/rollovite/tools/public/__paths__.js";

/* Import utility.
NOTE
- Intended for app-wide use and can be used as a drop-in replacement for static 
  and dynamic imports.
- Supports truly dynamic imports.
- Supports multiple file types.
- Ignores .test.js src files.
- Supports src as well as public files (regardless of environment) with similar syntax.
  This can be used to adjust the trade-off between bundle size and import performance.
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  manual browser refresh is required to pick up the changes. */
export const modules = new (class Modules {
  #processors;
  #public;
  #src;

  constructor() {
    this.#processors = new (class Processors {
      #registry = new Map();

      /* Adds one or more processors. Chainable. */
      add(spec) {
        Object.entries(spec).forEach(([extension, processor]) => {
          this.#registry.set(extension, processor);
        });
        return this;
      }

      /* Removes all processors. Chainable. */
      clear() {
        this.#registry.clear();
        return this;
      }

      /* Prevents addition of processors. Chainable. */
      freeze() {
        Object.freeze(this.#registry);
        return this;
      }

      /* Returns processor. */
      get(extension) {
        return this.#registry.get(extension);
      }

      /* Returns extensions, for which processors have been registered;
      optionally, filtered. */
      processors(filter) {
        const result = Array.from(this.#registry.keys());
        if (filter) {
          return result.filter(filter);
        }
        return result;
      }

      /* Removes processor. Chainable. */
      remove(key) {
        this.#registry.delete(key);
        return this;
      }
    })();

    this.#public = new (class Public {
      #cache = new Cache(fetch_text);
      #js_cache = new Cache();

      /* Returns import. */
      async get(path, { name, raw } = {}) {
        path = normalize_path(path);
        const type = get_type(path);
        if (type === "js" && !raw) {
          const result = await this.#js_cache.get(path, async () => {
            const text = await fetch_text(path);
            return await module.from_text(text);
          });
          /* NOTE
          - Convention: Modules with default export, should not export 
            anything else. */
          if ("default" in result) {
            return result.default;
          }
          if (name) {
            return result[name];
          }
          return result;
        }
        if (type === "css" && !raw) {
          /* Mimic Vite: css becomes global (albeit via link) */
          if (
            !document.head.querySelector(
              `link[rel="stylesheet"][href="${path}"]`
            )
          ) {
            const { promise, resolve } = Promise.withResolvers();
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = path;
            link.onload = (event) => resolve();
            document.head.append(link);
            await promise;
          }
          return;
        }
        const result = await this.#cache.get(path);
        if (type === "json" && !raw) {
          /* Mimic Vite: Return uncached parsed json */
          return JSON.parse(result);
        }
        return result;
      }

      /* Returns array of public paths, optionally subject to filter. */
      paths(filter) {
        if (filter) {
          return paths.filter(filter);
        }
        return paths;
      }
    })();

    this.#src = new (class Src {
      #registry = new Map();

      /* Registers loaders. */
      add(...loaders) {
        /* NOTE
        - Rather than using Vite's loader objects directly, these are copied into 
          a central registry. While this does involve a copy-step it also guards 
          against duplicate registration and provides initial adaption to the '@/'
          syntax, rather than at each retrieval. */
        loaders.forEach((loader) =>
          Object.entries(loader).forEach(([path, load]) =>
            this.#registry.set(`@/${path.slice("/src/".length)}`, load)
          )
        );
      }

      /* Returns import. */
      async get(path, { name } = {}) {
        const load = this.#registry.get(path);
        if (!load) {
          throw new Error(`Invalid path: ${path}`);
        }
        const module = await load();
        /* NOTE
        - Convention: Modules with default export, should not export 
          anything else. Also, provides a leaner syntax (and simpler registration)
          for file types that inherently only exposes default. */
        if ("default" in module) {
          return module.default;
        }
        /* XXX
        - 'name' kwarg only relevant for js modules with no default.
          Not worth managing this, but does require a little usage discipline. */
        if (name) {
          return module[name];
        }
        return module;
      }

      /* Returns array of registered paths, optionally subject to filter. */
      paths(filter) {
        const paths = Array.from(this.#registry.keys());
        if (filter) {
          return paths.filter(filter);
        }
        return paths;
      }
    })();
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns controller for files in public. */
  get public() {
    return this.#public;
  }

  /* Returns controller for files in src. */
  get src() {
    return this.#src;
  }

  /* Returns import with Python-like syntax. */
  get import() {
    return this.#create_proxy();
  }

  /* Enables Python-like syntax from a given base path. */
  importer(path) {
    return () => {
      return this.#create_proxy(path);
    };
  }

  /* Returns import. */
  async get(path, { name, raw } = {}) {
    const result = path.startsWith("@/")
      ? await this.src.get(path, { name })
      : await this.public.get(path, { name, raw });
    const processor = this.processors.get(get_extension(path));
    if (processor) {
      return await processor.call(null, path, result);
    }
    return result;
  }

  /* Returns proxy factory for Python-like syntax. */
  #create_proxy(path) {
    const modules = this;
    return (function proxy() {
      return new Proxy(
        {},
        {
          get: (target, part) => {
            if (path === undefined) {
              path = part === "src" ? "@" : "";
              return proxy();
            }
            if (part.includes(":")) {
              return (options = {}) =>
                modules.get(path + part.replaceAll(":", "."), options);
            }
            path += `/${part}`;
            return proxy();
          },
        }
      );
    })();
  }
})();

/* Utilities... */

/* Returns file type. */
function get_type(path) {
  return path.split(".").reverse()[0];
}

/* Returns env-adjusted public path. */
function normalize_path(path) {
  return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
}

/* Returns text content of file in public by env-adjusted path. */
async function fetch_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}

function get_extension(path) {
  const file = path.split("/").reverse()[0];
  const [stem, ...meta] = file.split(".");
  return meta.join(".");
}

/* Configure... */

/* Register global loaders */
modules.src.add(
  import.meta.glob(["/src/**/*.css"]),
  import.meta.glob(["/src/**/*.html"], { query: "?raw" }),
  import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]),
  import.meta.glob(["/src/**/*.json"]),
  import.meta.glob(["/src/**/*.sheet"], { query: "?raw" }),
  import.meta.glob(["/src/**/*.template"], { query: "?raw" })
);

/* Enable Python-like syntax for selected dirs. */
(() => {
  const components = modules.importer("@/components");
  const rollo = modules.importer("@/rollo");
  const rolloanvil = modules.importer("@/rolloanvil");
  const rolloui = modules.importer("@/rolloui");
  const test = modules.importer("@/test");
  assign(
    modules,
    class {
      get components() {
        return components;
      }
      get rollo() {
        return rollo;
      }
      get rolloanvil() {
        return rolloanvil;
      }
      get rolloui() {
        return rolloui;
      }
      get test() {
        return test;
      }
    }
  );
})();

export const components = modules.importer("@/components");
export const rollo = modules.importer("@/rollo");
export const rolloanvil = modules.importer("@/rolloanvil");
export const rolloui = modules.importer("@/rolloui");
export const test = modules.importer("@/test");
