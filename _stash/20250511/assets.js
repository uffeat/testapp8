/* NOTE
- Tightly coupled with pre-build tool for creation of '__paths__.js' */
import { Cache } from "@/rollo/tools/cache.js";
import { module } from "@/rollo/tools/module.js";
import { factory } from "@/rollovite/tools/factory.js";
import paths from "@/rollovite/tools/public/__paths__.js";

class Path {
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

  constructor() {
    const assets = this;

    this.#cache = new Cache(async (path) => {
      const response = await fetch(path.path);
      return (await response.text()).trim();
    });

    this.#css = new (class Css {
      async import(path) {
        if (!(path instanceof Path)) {
          path = new Path(path);
        }
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
          link.onload = (event) => resolve();
          document.head.append(link);
          await promise;
        }
        return;
      }
    })();

    this.#js = new (class Js {
      #cache = new Cache();

      async import(path, { name } = {}) {
        if (!(path instanceof Path)) {
          path = new Path(path);
        }
        const _module = await this.#cache.get(path.path, async () => {
          const text = await assets.import(path, { raw: true });
          return await module.construct(text);
        });
        /* NOTE
        - Convention: Modules with default export, should not export 
          anything else. */
        if ("default" in _module) {
          if (name && typeof _module.default === "object") {
            return _module.default[name];
          }
          return _module.default;
        }
        if (name) {
          return _module[name];
        }
        return _module;
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
    return paths.includes(path);
  }

  /* Returns import. */
  async import(path, { name, raw } = {}) {
    if (!(path instanceof Path)) {
      path = new Path(path);
    }
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
    if (filter) {
      return paths.filter(filter);
    }
    return paths;
  }

  /* Returns number of public paths, optionally subject to filter. */
  size(filter) {
    return this.paths(filter).length;
  }
})();
