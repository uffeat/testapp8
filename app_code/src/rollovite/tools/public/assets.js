/*
rollovite/tools/public/assets.js
v.1.0
20250512

NOTE
- Relies pre-build tool for creation of '__manifest__.js'
*/

import { component } from "@/rollo/component/component.js";
import { module } from "@/rollo/tools/module.js";
import { factory } from "@/rollovite/tools/factory.js";
import paths from "@/rollovite/tools/public/__manifest__.js";

/* Utility for parsing paths. */
class Path {
  /* Returns Path instance. */
  static create = (path) => {
    if (path instanceof Path) {
      return path;
    }
    return new Path(path);
  };

  #key;
  #path;
  #raw;
  #type;

  constructor(path) {
    /* Extract any raw query from path */
    if (path.includes("?")) {
      const parts = path.split("?");
      path = parts[0];
      this.#raw = parts[1];
    }
    /* Non-environment-adjusted path without query */
    this.#key = path;
    /* Environment-adjusted path */
    this.#path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
    /* Infer file type from path */
    this.#type = path.split(".").reverse()[0];
  }

  /* Returns normalized public path. */
  get key() {
    return this.#key;
  }

  /* Returns environment-adjusted public path. */
  get path() {
    return this.#path;
  }

  /* Returns raw flag. */
  get raw() {
    return this.#raw;
  }

  /* Returns file type. */
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
    /* Enable ref to 'this' from composition classes */
    const assets = this;
    /* Create cache utility for asset text */
    this.#cache = new (class Cache {
      #registry = new Map();

      /* Returns asset text.
      NOTE
      - First invocation, fetches, caches and returns text.
      - Subsequent invocations returns text from cache. */
      async get(path) {
        path = Path.create(path);
        let result = this.#registry.get(path.key);
        if (result) {
          return result;
        }
        const response = await fetch(path.path);
        result = (await response.text()).trim();
        this.#registry.set(path.key, result);
        return result;
      }
    })();

    /* Create utility for handling non-raw css */
    this.#css = new (class Css {
      async import(path) {
        path = Path.create(path);
        /* Mimic Vite: css becomes global (albeit via link) */
        const href = path.path;
        const rel = "stylesheet";
        const selector = `link[rel="${rel}"][href="${path.path}"]`;
        let link = document.head.querySelector(selector);
        /* Check, if sheet already added */
        if (!link) {
          const { promise, resolve } = Promise.withResolvers();
          /* Add sheet by link */
          link = component.link({
            href,
            rel,
            parent: document.head,
            onload: (event) => resolve(),
          });
          /*
          // Alternative without 'component':
          link = document.createElement("link");
          link.rel = rel;
          link.href = href;
          link.onload = (event) => resolve();
          document.head.append(link);
          */

          /* Await link load */
          await promise;
        }
        return link;
      }
    })();

    /* Create utility for handling non-raw js */
    this.#js = new (class Js {
      #cache;

      constructor() {
        /* Create cache utility for constructed js modules */
        this.#cache = new (class Cache {
          #registry = new Map();

          /* Returns js module.
          NOTE
          - First invocation, constructs, caches and returns module.
          - Subsequent invocations returns module from cache. */
          async get(path) {
            path = Path.create(path);
            let result = this.#registry.get(path.key);
            if (result) {
              return result;
            }
            /* Use 'assets' to get text. Ensures that any cached text is used. */
            const text = await assets.import(path, { raw: true });
            /* Add sourceURL and construct module */
            result = await module.construct(
              `${text}\n//# sourceURL=${path.path}`
            );
            this.#registry.set(path.key, result);
            return result;
          }
        })();
      }

      /* Returns constructed js module. */
      async import(path, { name } = {}) {
        path = Path.create(path);
        const result = await this.#cache.get(path);
        /* Enable direct import of named export */
        if (name) {
          return result[name];
        }
        return result;
      }
    })();

    /* Create utility for post-processing of non-raw json */
    this.#json = new (class Json {
      parse(json, { name } = {}) {
        /* Mimic Vite: Return uncached parsed json */
        const parsed = JSON.parse(json);
        /* Enable direct import of top-level value of parsed object
        NOTE
        - Mimics feature of js module imports and allows using non-array-json in 
          a way similar to js modules - with top-level items corresponding to named 
          exports. Do, however, watch out for mutation!
        - Can also be used for array-json with 'name' being an index. */
        if (name) {
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

  /* Imports and returns array of modules, optionally subject to filter. 
  NOTE
  - Primarily intended for side-effect imports, but does provide return.
  - Can also be used for batch-fetching non-js assets, e.g., to pre-build 
    cache. Typically, however, a filter should be used to only target js 
    modules. */
  async batch(filter) {
    const modules = [];
    for (const path of this.paths(filter)) {
      modules.push(await this.import(path));
    }
    return modules;
  }

  /* Checks, if path is in public. */
  has(path) {
    path = Path.create(path);
    return paths.has(path.key);
  }

  /* Returns import result, which can be:
  - asset text
  - js module 
  - js module member
  - parsed json
  - parsed json member
  - sheet link (added as side-effect).
  If path is invalid, an (unthrown) Error instance with the (normalized) path 
  as its message is returned. */
  async import(path, { name, raw } = {}) {
    /* XXX
    - Depending on file type, import options ('name' and 'raw') 
      could be ignored or result in error-return
      These issues are not critical, but usage does require a level of
      reasonable discipline.
    */

    /* Parse path */
    path = Path.create(path);
    /* Let in-path raw query overwrite raw option */
    raw = path.raw || raw;
    /* Check path validity */
    if (!this.has(path)) {
      return new Error(path.key);
    }
    /* Handle non-raw js (return constructed js module) */
    if (path.type === "js" && !raw) {
      return await this.#js.import(path, { name });
    }
    /* Handle non-raw css (add and return sheet link) */
    if (path.type === "css" && !raw) {
      return await this.#css.import(path);
    }
    /* Handle text asset */
    const result = await this.#cache.get(path);
    /* Post-process non-raw json */
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
