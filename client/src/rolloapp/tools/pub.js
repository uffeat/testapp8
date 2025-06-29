/*
import { pub } from "@/rolloapp/tools/pub.js";
20250526
v.2.0
*/

import { construct } from "@/rolloapp/tools/construct.js";

/* Utility for importing public files. */
export const pub = new (class {
  #_ = {};

  constructor() {
    const owner = this;

    /* Create mechanism for importing, caching and returning pubilc files as 
    text */
    this.#_.fetch = new (class {
      #_ = {
        cache: new Map(),
        fetch: async (path) => (await (await fetch(path)).text()).trim(),
      };

      /* Returns file text. */
      async call(path, { cache }) {
        if (!cache) return await this.#_.fetch(path.path);
        if (this.#_.cache.has(path.path)) return this.#_.cache.get(path.path);
        const text = await this.#_.fetch(path.path);
        this.#_.cache.set(path.path, text);
        return text;
      }
    })();

    /* Create mechanism for importing, caching and returning pubilc js 
    modules */
    this.#_.import = new (class {
      #_ = {
        import: Function("path", "return import(path)"),
      };

      /* Returns js module. */
      async call(path, { cache }) {
        if (cache) {
          return await this.#_.import(path.path);
        }
        /* Browser does cache results from this.#_.import, so construct module 
        from text to get a unique module object */
        const text = (await (await fetch(path.path)).text()).trim();
        return await construct(`${text}\n//# sourceURL=${path.file}`);
      }
    })();
  }

  /* Returns import from public. */
  async import(path, { cache, raw }) {
    if (!raw && path.type === "js")
      return await this.#_.import.call(path, { cache });
    /* Mimic Vite: css becomes global (albeit via link) */
    if (!raw && path.type === "css") return await this.#link(path.path);
    const result = await this.#_.fetch.call(path, { cache });
    /* Mimic Vite: Return uncached parsed json */
    if (!raw && path.type === "json") return JSON.parse(result);
    return result;
  }

  /* Adds and returns stylesheet link. */
  #link = async (path) => {
    const href = path;
    const rel = "stylesheet";
    const selector = `link[rel="${rel}"][href="${href}"]`;
    let link = document.head.querySelector(selector);
    /* Check, if link already added */
    if (!link) {
      const { promise, resolve } = Promise.withResolvers();
      link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      link.onload = (event) => resolve();
      document.head.append(link);
      /* Await link load */
      await promise;
    }
    return link;
  };
})();
