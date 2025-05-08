/*
rollovite/modules.js
20250508
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
export const modules = new (class Modules {
  #public;
  #src;

  constructor() {
    this.#public = new (class Public {
      #js_cache = {};
      #cache = {};
      async get(path) {
        const type = get_type(path);
        let result;

        if (type === "js") {
          /* Handle js module */
          if (path in this.#js_cache) {
            result = this.#js_cache[path];
          }
          result = await create_module(path);
          this.#js_cache[path] = result;
        } else if (type === "css") {
          /* Mimic Vite's css import -> css becomes global (albeit via link) */
          if (
            !document.head.querySelector(
              `link[rel="stylesheet"][href="${path}"]`
            )
          ) {
            const { promise, resolve } = Promise.withResolvers();
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = path;
            const on_load = (event) => {
              link.removeEventListener("load", on_load);
              resolve();
            };
            link.addEventListener("load", on_load);
            document.head.append(link);
            await promise;
          }
        } else {
          /* Handle all other types as text */
          if (path in this.#cache) {
            result = this.#cache[path];
          } else {
            result = await fetch_text(path);
            this.#cache[path] = result;
          }
        }
        /* Mimic Vite's json import -> uncached parsed json */
        if (type === "json") {
          result = JSON.parse(result);
        }
        return result;
      }
    })();

    this.#src = new (class Src {
      /* NOTE
      - Types could probably be implemented in a leaner with a factory pattern,
        but this would also be less idiomatic. */

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
            return await this.#loaders[path]();
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
      async get(path) {
        return await this[get_type(path)].get(path);
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
  - Syntactial Python-like alternative to 'get'. 
  - Does NOT support relative imports. */
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
  async get(path, {name} = {}) {
    ////console.log('path:', path)////

    path = create_path(path);
    let result;
    if (path.startsWith("/src/")) {
      /* Import from src */
      result = await this.#src.get(path);
    } else {
      /* Import from public */
      result = await this.#public.get(path);
    }

    if (typeof result === "object") {
      /* NOTE
      - By convention, js modules that export default, should not export anything else. */
      if ("default" in result) {
        result = result.default;

        // TODO error is name not relevant



      } else if (name) {
        result = result[name];
      }
    } else {
 // TODO error is name not relevant
    }

    return result;
  }
})();

/* Make modules global */
Object.defineProperty(window, "modules", {
  configurable: false,
  enumerable: true,
  writable: false,
  value: modules,
});

/* Returns text content of file in /public.
NOTE
- 'path' should be normalized, i.e., environment-adjusted. */
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

/* Returns module created from path. 
NOTE
- Does NOT cache module. */
async function create_module(path) {
  return await text_to_module(await fetch_text(path));
}

function create_path(path) {
  if (path.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
  }
  return `/src/${path.slice("@/".length)}`;
}

function get_type(path) {
  return path.split(".").reverse()[0];
}
