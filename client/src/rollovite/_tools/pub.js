/*
import { pub } from "@/rollovite/_tools/pub.js";
20250525
v.1.0
*/

/* Do NOT import anything from outside 'rollovite' */

/* Utility for importing public files. */
export const pub = new (class {
  #_ = {};

  constructor() {
    /* Create mechanism for importing, caching and returning pubilc files as 
    text */
    this.#_.fetch = new (class {
      #_ = {
        cache: new Map(),
        fetch: async (path) => (await (await fetch(path)).text()).trim()
        
      };

      /* Returns file text. */
      async call(path) {
        if (path.query.has('nocache')) return (await this.#_.fetch(path.path))
        if (this.#_.cache.has(path.path)) return this.#_.cache.get(path.path);
        const text = await this.#_.fetch(path.path)
        this.#_.cache.set(path.path, text);
        return text;
      }
    })();

    /* Create mechanism for importing, caching and returning pubilc js 
    modules */
    this.#_.import = new (class {
      #_ = {
        cache: new Map(),
        import: Function("path", "return import(path)"),
      };

      /* Returns js module. */
      async call(path) {
        if (path.query.has('nocache')) return (await this.#_.import(path.path))
        if (this.#_.cache.has(path.path)) return this.#_.cache.get(path.path);
        const module = await this.#_.import(path.path);
        this.#_.cache.set(path.path, module);
        return module;
      }
    })();
  }

  /* Returns import from public. */
  async import(path) {
    
    
    if (!path.query.has('raw') && path.type === "js") return await this.#_.import.call(path);
    /* Mimic Vite: css becomes global (albeit via link) */
    if (!path.query.has('raw') && path.type === "css") return await this.#link(path.path);
    const result = await this.#_.fetch.call(path);
    /* Mimic Vite: Return uncached parsed json */
    if (!path.query.has('raw') && path.type === "json") return JSON.parse(result);
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