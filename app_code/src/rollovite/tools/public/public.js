/*
rollovite/tools/public/public.js
20250506
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
import { component } from "@/rollo/component/component.js";
import { module } from "@/rollo/tools/module.js";

import _paths from "@/rollovite/tools/public/__paths__.js";
const paths = Object.freeze(_paths);
/* Alternatively:
const paths = Object.freeze(JSON.parse(await fetch_text(normalize_path("/__paths__.json"))));
*/

export class Public {
  #cache = {};
  #module_cache = {};

  /* Returns /public file import result. */
  async get(path, { raw = false } = {}) {
    const type = path.split(".").reverse()[0];
    path = normalize_path(path);
    /* Mimic Vite's css import -> css becomes global (albeit via link) */
    if (type === "css" && !raw) {
      if (
        !document.head.querySelector(`link[rel="stylesheet"][href="${path}"]`)
      ) {
        const { promise, resolve } = Promise.withResolvers();
        const link = component.link({ href: path, rel: "stylesheet" });
        link.handlers.add("load", (event) => resolve(), { once: true });
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
      const text = await fetch_text(path);
      const result = await module.from_text(text);
      this.#module_cache[path] = result;
      return result;
    }
    /* Handle all other types as text */
    let result;
    if (path in this.#cache) {
      result = this.#cache[path];
    } else {
      result = await fetch_text(path);
      this.#cache[path] = result;
    }
    /* Mimic Vite's json import -> uncached parsed json */
    if (type === "json" && !raw) {
      result = JSON.parse(result);
    }
    return result;
  }

  /* Checks, if path is in /public. */
  has(path) {
    return paths.includes(path);
  }

  /* Returns paths in /public, optionally as per filter.
  Returns null, if none found. */
  paths(filter) {
    if (filter) {
      const result = paths.filter(filter);
      return result.length ? result : null;
    }
    return paths;
  }

  /* Retutns number of files in /public. */
  size(filter) {
    if (filter) {
      return paths.filter(filter).length;
    }
    return paths.length;
  }
}

/* Returns normalized interpretation of path, 
i.e., environment-adjusted. */
function normalize_path(path) {
  return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
}

/* Returns text content of file in /public.
NOTE
- 'path' should be normalized, i.e., environment-adjusted. */
async function fetch_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}
