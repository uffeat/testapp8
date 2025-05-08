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
      #cache = {};
      async get(path) {
        if (path in this.#cache) {
          return this.#cache[path];
        }
        const module = await create_module(path);
        this.#cache[path] = module;
        return module;
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
      #sheet
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

      get css() {
        return this.#css;
      }

      get html() {
        return this.#html;
      }

      get js() {
        return this.#js;
      }

      get json() {
        return this.#json;
      }

      get sheet() {
        return this.#sheet;
      }

      get template() {
        return this.#template;
      }

      async get(path) {
        return await this[get_type(path)].get(path);
      }
    })();
  }

  get public() {
    return this.#public;
  }

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
    const terminators = modules.config.types.types;
    /* Builds up path by successive recursive calls until terminsation cue. */
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
          if (terminators.has(part)) {
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

  /* Returns import result. */
  async get(path) {
    path = create_path(path);
    let result;
    if (path.startsWith("/src/")) {
      /* Import module from /src */
      result = await this.#src.get(path);
    } else {
      /* Import module from /public */
      result = await this.#public.get(path);
    }

    /* NOTE
    - By convention, js modules that export default, should not export anything else. */
    if ("default" in result) {
      result = result.default;
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
