/*
rollovite/modules.js
20250508
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
import paths from "@/rollovite/tools/public/__paths__.js";

export const modules = new (class Modules {
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
            /* Handle non-raw */
            /* Mimic Vite's css import -> css becomes global (albeit via link) */
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
          #js_cache = {};
          #text_cache = {};

          async get(path, { name, raw } = {}) {
            if (raw) {
              if (name) {
                throw new Error(`'name' N/A.`);
              }
              if (path.path in this.#text_cache) {
                return this.#text_cache[path.path];
              }
              const text = await fetch_text(path.path);
              this.#text_cache[path.path] = text;
              return text;
            }
            /* Non-raw */
            let module;
            if (path.path in this.#js_cache) {
              module = this.#js_cache[path.path];
            } else {
              let text;
              if (path.path in this.#text_cache) {
                text = this.#text_cache[path.path];
              } else {
                text = await fetch_text(path.path);
                this.#text_cache[path.path] = text;
              }
              module = await text_to_module(text);
              this.#js_cache[path.path] = module;
            }
            /* NOTE
          - By convention, js modules that export default, should not export 
            anything else. */
            if ("default" in module) {
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
            /* Mimic Vite's json import -> uncached parsed json */
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
        if (path.type === "js") {
          return await this.#js.get(path, { name, raw });
        }
        if (path.type === "json") {
          return await this.#json.get(path, { raw });
        }
        if (path.type === "html") {
          throw new Error(`'html' not supported. Use 'template' instead.`);
        }
        if (raw) {
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
            if (!(path instanceof Path)) {
              path = new Path(path);
            }
            const module = await this.#loaders[path.path]();
            /* NOTE
            - By convention, js modules that export default, should not export 
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
            const module = await super.get(path);

            if (name) {
              return module[name];
            }
            return module;
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
