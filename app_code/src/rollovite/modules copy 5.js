/*
rollovite/modules.js
20250508
v.2.0.beta
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
import paths from "@/rollovite/tools/public/__paths__.js";

/* Import utility.
NOTE
- Intended for app-wide use and can be used as a drop-in replacement for static 
  and dynamic imports.
- Supports truly dynamic imports.
- Supports a fixed set of native and native-like file types.
- Ignores .test.js src files.
- Supports src as well as public files (regardless of environment) with similar syntax.
  This can be used to adjust the trade-off between bundle size and import performance.
- Changes to code that uses 'modules' are NOT picked up by Vite's HMR, i.e., 
  manual browser refresh is required to pick up the changes. */
export const modules = new (class Modules {
  /* XXX
  - The central modules.get accepts kwargs, some of which are only relevant 
    for certain sources and file types. This is not ideal, but invalid provision 
    of kwargs are handled via errors. The alternative, implementing more specific
    methods, would be event more unelegant.
  - While the exposed API provides similar syntax/features for src and public files, 
    there are some differences:
    - Attempts to provide the 'name' kwarg for public modules that export default
      throws an error. This is not the case for src modules, where such incorrect
      provision of a 'name' kwarg could lead to unpredictable results; not an 
      outright bug, but does require some usage disciple.
    - For src files, a more "low-level" API is provided (e.g., modules.src.js.get).
      For public files, the API stops at modules.public. Not critical, not a bug,
      but still a difference.
  - The inner mechanics for handling different file types is relatively elegant 
    for src, but has a somewhat less declarative feel for public. Not critical,
    and can be refatored without changing the exposed API.
  - Not sure, if mapping imports gloabally (as 'modules' currently does) has
    a negative performance impact (treeshaking and other factors)???
  */

  #public;
  #src;

  constructor() {
    this.#public = new (class Public {
      #css;
      #js;
      #json;
      #text;

      /* NOTE
      - Do NOT expose "type classes"; not necessary and they do not path-convert, 
        so risk of misuse. */

      constructor() {
        this.#css = new (class Css {
          #cache = {};
          async get(path, { raw } = {}) {
            if (raw) {
              if (path.path in this.#cache) {
                return this.#cache[path.path];
              }
              const text = await fetch_text(path.path);
              this.#cache[path.path] = text;
              return text;
            }
            /* Non-raw */
            /* Mimic Vite: css becomes global (albeit via link) */
            if (
              !document.head.querySelector(
                `link[rel="stylesheet"][href="${path.path}"]`
              )
            ) {
              const { promise, resolve } = Promise.withResolvers();
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = path.path;
              const on_load = (event) => {
                link.removeEventListener("load", on_load);
                resolve();
              };
              link.addEventListener("load", on_load);
              document.head.append(link);
              await promise;
            }
          }
        })();

        this.#js = new (class Js {
          #cache = {};

          async get(path, { name } = {}) {
            let module;
            if (path.path in this.#cache) {
              module = this.#cache[path.path];
            } else {
              const text = await modules.public.get(path, { raw: true });
              module = await text_to_module(text);
              this.#cache[path.path] = module;
            }
            /* NOTE
            - Convention: Modules with default export, should not export 
              anything else. */
            if ("default" in module) {
              if (name) {
                throw new Error(`'name' N/A.`);
              }
              return module.default;
            }
            if (name) {
              return module[name];
            }
            return module;
          }
        })();

        this.#json = new (class Json {
          #cache = {};

          async get(path, { raw } = {}) {
            let result;
            if (path.path in this.#cache) {
              result = this.#cache[path.path];
            } else {
              result = await fetch_text(path.path);
              this.#cache[path.path] = result;
            }
            if (raw) {
              return result;
            }
            /* Mimic Vite: Return uncached parsed json */
            return JSON.parse(result);
          }
        })();

        this.#text = new (class Text {
          #cache = {};

          async get(path) {
            if (path.path in this.#cache) {
              return this.#cache[path.path];
            }
            const text = await fetch_text(path.path);
            this.#cache[path.path] = text;
            return text;
          }
        })();
      }

      async get(path, { name, raw } = {}) {
        if (!(path instanceof Path)) {
          path = new Path(path);
        }
        /* Check, if name applies */
        if (path.type !== "js" && name) {
          throw new Error(`'name' N/A.`);
        }

        if (path.type === "css") {
          return await this.#css.get(path, { raw });
        }
        if (path.type === "js" && !raw) {
          return await this.#js.get(path, { name });
        }
        if (path.type === "json") {
          return await this.#json.get(path, { raw });
        }
        if (path.type === "html") {
          throw new Error(`'html' not supported. Use 'template' instead.`);
        }
        if (path.type !== "js" && raw) {
          throw new Error(`'raw' N/A.`);
        }
        return await this.#text.get(path);
      }

      paths(filter) {
        let result = paths;
        if (filter) {
          result = paths.filter(filter);
        }
        return result.length ? result : null;
      }
    })();

    this.#src = new (class Src {
      /* NOTE
      - Types could probably be implemented in a leaner way with a factory 
        pattern, but that would also be less idiomatic and perhaps less clear. */
      #css;
      #html;
      #js;
      #json;
      #sheet;
      #template;

      constructor() {
        class Base {
          #loaders;
          constructor(loaders) {
            this.#loaders = loaders;
          }
          async get(path) {
            if (!(path instanceof Path)) {
              path = new Path(path);
            }
            const module = await this.#loaders[path.path]();
            /* NOTE
            - Convention: Modules with default export, should not export 
              anything else. */
            if ("default" in module) {
              return module.default;
            }
            return module;
          }
          paths(filter) {
            const paths = Object.keys(this.#loaders);
            const normalize = (path) => `@/${path.slice("/src/".length)}`;
            let result;
            if (filter) {
              result = paths
                .filter((path) => filter(normalize(path)))
                .map(normalize);
            } else {
              result = paths.map(normalize);
            }
            return result.length ? result : null;
          }
        }

        this.#css = new (class Css extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.css"]));
          }
        })();

        this.#html = new (class Html extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.html"], { query: "?raw" }));
          }
        })();

        this.#js = new (class Js extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]));
          }
          async get(path, { name } = {}) {
            /* NOTE
            - Overloaded to support name */
            const module = await super.get(path);
            return name ? module[name] : module;
          }
        })();

        this.#json = new (class Json extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.json"]));
          }
        })();

        this.#sheet = new (class Sheet extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.sheet"], { query: "?raw" }));
          }
        })();

        this.#template = new (class Template extends Base {
          constructor() {
            super(import.meta.glob(["/src/**/*.template"], { query: "?raw" }));
          }
        })();
      }

      /* Returns controller for css files in src. */
      get css() {
        return this.#css;
      }

      /* Returns controller for html files in src. */
      get html() {
        return this.#html;
      }

      /* Returns controller for js files in src. */
      get js() {
        return this.#js;
      }

      /* Returns controller for json files in src. */
      get json() {
        return this.#json;
      }

      /* Returns controller for sheet files in src. */
      get sheet() {
        return this.#sheet;
      }

      /* Returns controller for template files in src. */
      get template() {
        return this.#template;
      }

      /* Returns import from src. */
      async get(path, { name } = {}) {
        if (!(path instanceof Path)) {
          path = new Path(path);
        }
        if (path.type === "js") {
          return await this[path.type].get(path, { name });
        } else {
          if (name) {
            throw new Error(
              `'name' does not apply to type '${path.type}' modules.`
            );
          }
          return await this[path.type].get(path);
        }
      }
    })();
  }

  /* Returns controller for files in public. */
  get public() {
    return this.#public;
  }

  /* Returns controller for files in src. */
  get src() {
    return this.#src;
  }

  /* Returns import result. 
  NOTE
  - Syntactial Python-like alternative to 'get'. */
  get import() {
    let path;
    const modules = this;
    const terminators = ["css", "html", "js", "json", "sheet", "template"];
    /* Builds up path by successive recursive calls until termination. */
    const proxy = () =>
      new Proxy(this, {
        get: (target, part) => {
          /* Handle source */
          if (path === undefined) {
            if (part === "src") {
              path = "@";
            } else if (part === "public") {
              path = "";
            } else {
              throw new Error(`Invalid source`);
            }
            return proxy();
          }
          /* Handle termination for simple file types */
          if (terminators.includes(part)) {
            path += `.${part}`;
            return (options = {}) => modules.get(path, options);
          }
          /* Handle termination for composite file types */
          if (part.includes(":")) {
            path += `.${part.replaceAll(":", ".")}`;
            return (options = {}) => modules.get(path, options);
          }
          /* Handle dir path */
          path += `/${part}`;
          return proxy();
        },
      });
    return proxy();
  }

  /* Returns import. */
  async get(path, { name, raw } = {}) {
    path = new Path(path);
    if (!path.public && raw) {
      throw new Error(`'raw' N/A.`);
    }
    return path.public
      ? await this.#public.get(path, { name, raw })
      : await this.#src.get(path, { name });
  }
})();

/* Make modules global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});

/* Returns text content of file in public by environment-adjusted path. */
async function fetch_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}

/* Returns module created from text. 
NOTE
- Does NOT cache module. */
async function text_to_module(text) {
  const blob = new Blob([text], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  /* Access 'import' from constructed function to prevent Vite from barking 
  at dynamic import */
  const module = await Function(`return import("${url}")`)();
  URL.revokeObjectURL(url);
  return module;
}

/* Utility for parsing path. */
class Path {
  #path;
  #public;
  #type;
  constructor(path) {
    if (path.startsWith("/")) {
      this.#path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
      this.#public = true;
    } else {
      this.#path = `/src/${path.slice("@/".length)}`;
      this.#public = false;
    }
    this.#type = path.split(".").reverse()[0];
  }

  get path() {
    return this.#path;
  }

  get public() {
    return this.#public;
  }

  get type() {
    return this.#type;
  }
}

class Cache {
  #cache = new Map();
  #creator;

  constructor(creator) {
    this.#creator = creator;
  }

  async get(key) {
    let cached = this.#cache.get(key);
    if (cached) {
      return cached;
    }
    cached = await this.#creator();
    this.#cache.set(key, cached);
    return cached;
  }
}
