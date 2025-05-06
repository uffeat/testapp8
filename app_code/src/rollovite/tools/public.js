import { module } from "@/rollo/tools/module.js";

/* TODO
- Use /public/__meta__ */

export class Public {
  #cache = {};
  #module_cache = {};

  /* 
  NOTE
  -  */
  async get(path, { raw = false } = {}) {
    const type = path.split(".").reverse()[0];
    path = `${import.meta.env.BASE_URL}${path.slice("/".length)}`;

    /* Mimic Vite's css import -> css becomes global (albeit via link) */
    if (type === "css" && !raw) {
      if (
        !document.head.querySelector(`link[rel="stylesheet"][href="${path}"]`)
      ) {
        const { promise, resolve } = Promise.withResolvers();
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = path;
        const on_load = (event) => {
          link.removeEventListener("load", on_load);
          resolve();
        };
        link.addEventListener("load", on_load);
        document.head.append(link);
        await promise;
      }
      return;
    }
    /* Handle js module */
    if (type === "js" && !raw) {
      if (path in this.#module_cache) {
        return this.#module_cache[path];
      }
      const response = await fetch(path);
      const text = (await response.text()).trim();
      const result = await module.from_text(text);
      this.#module_cache[path] = result;
      return result;
    }
    /* Handle all other types as text */
    let result;
    if (path in this.#cache) {
      result = this.#cache[path];
    } else {
      const response = await fetch(path);
      result = (await response.text()).trim();
      this.#cache[path] = result;
    }
    /* Mimic Vite's json import -> uncached parsed json */
    if (type === "json" && !raw) {
      result = JSON.parse(result);
    }
    return result;
  }
}

function normalize_path(path) {
  return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
}

async function get_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}
