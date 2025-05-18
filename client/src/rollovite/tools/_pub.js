/*
import { pub } from "@/rollovite/tools/_pub.js";
20250518
v.1.0
*/

/* Utility for importing public files.
NOTE
- Part of the Rollo import engine. 
- Can, but should typically not, be used stand-alone. */
export const pub = new (class {
  #fetch;
  #import;

  constructor() {
    this.#fetch = new (class {
      #cache = new Map();

      async call(path) {
        if (this.#cache.has(path)) return this.#cache.get(path);
        const text = (await (await fetch(path)).text()).trim();
        this.#cache.set(path, text);
        return text;
      }
    })();

    this.#import = new (class {
      #cache = new Map();
      #owner;

      constructor(owner) {
        this.#owner = owner;
      }

      async call(path) {
        if (this.#cache.has(path)) return this.#cache.get(path);
        const module = await this.#construct(
          `${await this.#owner.import(`${path}?raw`)}\n//# sourceURL=${path}`
        );
        this.#cache.set(path, module);
        return module;
      }

      #construct = async (text) => {
        const url = URL.createObjectURL(
          new Blob([text], { type: "text/javascript" })
        );
        const module = await new Function(`return import("${url}")`)();
        URL.revokeObjectURL(url);
        return module;
      };
    })(this);
  }

  /* Returns import from public. */
  async import(path) {
    const raw = (() => {
      if (path.endsWith("?raw")) {
        path = path.slice(0, -"?raw".length);
        return true;
      }
    })();
    const type = path.split(".").reverse()[0];
    if (!raw && type === "js") return await this.#import.call(path);
    /* Normalize path AFTER handling of non-raw js */
    path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
    /* Mimic Vite: css becomes global (albeit via link) */
    if (!raw && type === "css") return await this.#link(path);
    const result = await this.#fetch.call(path);
    /* Mimic Vite: Return uncached parsed json */
    if (!raw && type === "json") return JSON.parse(result);
    return result;
  }

  #link = async (path) => {
    const href = path;
    const rel = "stylesheet";
    const selector = `link[rel="${rel}"][href="${href}"]`;
    let link = document.head.querySelector(selector);
    /* Check, if sheet already added */
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
