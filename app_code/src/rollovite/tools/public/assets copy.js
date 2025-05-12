/* NOTE
- Tightly coupled with pre-build tool for creation of '__paths__.js' */
import { component } from "@/rollo/component/component.js";
import { module } from "@/rollo/tools/module.js";
import { factory } from "@/rollovite/tools/factory.js";
import paths from "@/rollovite/tools/public/__manifest__.js";

class Path {
  static create = (path) => {
    if (path instanceof Path) {
      return path;
    }
    return new Path(path);
  };

  #path;
  #raw;
  #type;

  constructor(path) {
    /* Handle path with query */
    if (path.includes("?")) {
      const parts = path.split("?");
      path = parts[0];
      this.#raw = parts[1];
    }
    /* Env-adjusted public path. */
    this.#path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;

    this.#type = path.split(".").reverse()[0];
  }

  get path() {
    return this.#path;
  }

  get raw() {
    return this.#raw;
  }

  get type() {
    return this.#type;
  }
}

export const assets = new (class Assets {
  #css;
  #factory = factory.call(this, "");
  #cache;
  #js;
  #json;
  #paths;

  constructor() {
    const assets = this;

    this.#cache = new (class Cache {
      #registry = new Map();

      async get(path) {
        path = Path.create(path);
        let result = this.#registry.get(path.path);
        if (result) {
          return result;
        }
        const response = await fetch(path.path);
        result = (await response.text()).trim();
        this.#registry.set(path.path, result);
        return result;
      }
    })();

    this.#css = new (class Css {
      async import(path) {
        path = Path.create(path);
        /* Mimic Vite: css becomes global (albeit via link) */
        const href = path.path;
        const rel = "stylesheet";
        const selector = `link[rel="${rel}"][href="${path.path}"]`;

        if (!document.head.querySelector(selector)) {
          const { promise, resolve } = Promise.withResolvers();

          const link = component.link({
            href,
            rel,
            parent: document.head,
            onload: (event) => resolve(),
          });

          /*
          // Alternative without 'component'
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = path.path;
          link.onload = (event) => resolve();
          document.head.append(link);
          */

          await promise;
        }
        return;
      }
    })();

    this.#js = new (class Js {
      #cache;

      constructor() {
        this.#cache = new (class Cache {
          #registry = new Map();

          async get(path) {
            path = Path.create(path);
            let result = this.#registry.get(path.path);
            if (result) {
              return result;
            }
            const text = await assets.import(path, { raw: true });
            result = await module.construct(text);

            this.#registry.set(path.path, result);
            return result;
          }
        })();
      }

      async import(path, { name } = {}) {
        path = Path.create(path);

        const result = await this.#cache.get(path);

        /* NOTE
        - Convention: Modules with default export, should not export 
          anything else. */
        if ("default" in result) {
          if (name && typeof result.default === "object") {
            return result.default[name];
          }
          return result.default;
        }
        if (name) {
          return result[name];
        }
        return result;
      }
    })();

    this.#json = new (class Json {
      parse(json, { name } = {}) {
        /* Mimic Vite: Return uncached parsed json */
        const parsed = JSON.parse(json);
        if (name && typeof parsed === "object") {
          return parsed[name];
        }
        return parsed;
      }
    })();
  }

  /* Returns import with Python-like syntax. */
  get path() {
    return this.#factory;
  }

  async batch(filter) {
    //TODO
  }

  /* Checks, if path is in public. */
  has(path) {
    return paths.has(path);
  }

  /* Returns import. */
  async import(path, { name, raw } = {}) {
    path = Path.create(path);
    raw = path.raw || raw;
    if (!this.has(path.path)) {
      return new Error(path.path);
    }

    if (path.type === "js" && !raw) {
      return await this.#js.import(path, { name });
    }

    if (path.type === "css" && !raw) {
      return await this.#css.import(path);
    }

    const result = await this.#cache.get(path);

    if (path.type === "json" && !raw) {
      return this.#json.parse(result, { name });
    }
    return result;
  }

  /* Returns array of public paths, optionally subject to filter. */
  paths(filter) {
    if (!this.#paths) {
      this.#paths = Object.freeze(Array.from(paths));
    }

    if (filter) {
      return this.#paths.filter(filter);
    }
    return this.#paths;
  }

  /* Returns number of public paths, optionally subject to filter. */
  size(filter) {
    return this.paths(filter).length;
  }
})();
