// import { assets } from "@/tools/assets";
// const { assets } = await import("@/tools/assets");

import { text_to_module } from "@/tools/module";

const BASE = import.meta.env.DEV
  ? "/"
  : `https://${window.parent.location.hostname}/_/theme/dist/`;

class Assets {
  /* Clears cache; optionally with respect to a single asset. Chainable. */
  clear(path) {
    if (path) {
      cache.delete(path);
    } else {
      cache.clear();
    }
    return this;
  }

  /* Returns asset as text. */
  async fetch(path) {
    const use_cache = !path.endsWith(".js");
    if (use_cache && cache.has(path)) {
      return cache.get(path);
    }
    const response = await fetch(this.url(path));
    const text = (await response.text()).trim();
    use_cache && cache.set(path, text);
    return text;
  }

  /* Returns JS module. */
  async import(path) {
    if (!path.endsWith(".js")) {
      path = `${path}.js`;
    }
    if (cache.has(path)) {
      return cache.get(path);
    }
    const text = (await this.fetch(path)).trim();
    const source_url = `//# sourceURL=${path}`;
    const module = await text_to_module(`${text}\n${source_url}`);
    cache.set(path, module);
    return module;
  }

  /* Returns asset url. */
  url(path) {
    return `${BASE}${path}`;
  }
}

const cache = new Map();

/* Returns controller for native-like access to public assets. */
export const assets = new Assets();
