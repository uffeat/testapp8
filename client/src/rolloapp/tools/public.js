import { meta } from "@/meta.js";
import { component } from "@/rollocomponent/component.js";
import { construct } from "@/rolloapp/tools/construct.js";
import { Path } from "@/rolloapp/tools/path";

export const Public = new (class {
  #_ = {};

  constructor() {
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
  async import(path, { cache, raw } = {}) {
    path = Path.create(path);
    try {
      if (!raw && path.type === "js")
        return await this.#_.import.call(path, { cache });
    } catch (error) {
      console.error("Original error:", error);
      throw new Error(`Could not import: ${path.specifier}`);
    }

    /* Mimic Vite: css becomes global (albeit via link) */
    if (!raw && path.type === "css") return await this.#link(path.path);

    try {
      const result = await this.#_.fetch.call(path, { cache });
      /* Mimic Vite: Return uncached parsed json */
      if (!raw && path.type === "json") return JSON.parse(result);
      return result;
    } catch (error) {
      console.error("Original error:", error);
      throw new Error(`Could not fetch: ${path.specifier}`);
    }
  }

  /* Adds stylesheet link. */
  #link = (path) => {
    /* Check, if link already added */
    let link = document.head.querySelector(
      `link[rel="stylesheet"][href="${path}"]`
    );
    if (link) return link;

    /* Create link and  link promise-wrapped link, when loaded */
    return new Promise((resolve, reject) => {
      component.link({
        parent: document.head,
        rel: "stylesheet",
        href: path,
        "@load$once": (event) => resolve(event.target),
      });
    });
  };
})();
