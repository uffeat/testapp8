import { Cache } from "@/rollo/tools/cache.js";
import { module } from "@/rollo/tools/module.js";
import { factory } from "@/rollovite/tools/factory.js";
import paths from "@/rollovite/tools/public/__paths__.js";

export const assets = new (class Assets {
  #cache = new Cache(fetch_text);
  #js_cache = new Cache();

  #factory = factory.call(this, "");

  /* Returns import with Python-like syntax. */
  get path() {
    return this.#factory;
  }

  /* Returns import. */
  async import(path, { name, raw } = {}) {
    path = normalize_path(path);

    const type = get_type(path);
    if (type === "js" && !raw) {
      const _module = await this.#js_cache.get(path, async () => {
        const text = await fetch_text(path);
        return await module.from_text(text);
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
    if (type === "css" && !raw) {
      /* Mimic Vite: css becomes global (albeit via link) */
      if (
        !document.head.querySelector(`link[rel="stylesheet"][href="${path}"]`)
      ) {
        const { promise, resolve } = Promise.withResolvers();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        link.onload = (event) => resolve();
        document.head.append(link);
        await promise;
      }
      return;
    }
    const result = await this.#cache.get(path);
    if (type === "json" && !raw) {
      /* Mimic Vite: Return uncached parsed json */
      const parsed = JSON.parse(result);
      if (name && typeof parsed === "object") {
        return parsed[name];
      }
      return parsed;
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
})();

/* Utilities... */

/* Returns file type. */
function get_type(path) {
  return path.split(".").reverse()[0];
}

/* Returns env-adjusted public path. */
function normalize_path(path) {
  return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
}

/* Returns text content of file in public by env-adjusted path. */
async function fetch_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}
