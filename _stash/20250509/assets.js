/*
rollovite/assets.js
20250509
v.1.0
*/

import { component } from "@/rollo/component/component.js";
import { Cache } from "@/rollo/tools/cache.js";
import { assign } from "@/rollo/tools/assign.js";
import { module } from "@/rollo/tools/module.js";
import paths from "@/rollovite/tools/public/__paths__.js";

const cache = new Cache(fetch_text);
const js_cache = new Cache();

/* Returns import from public.
NOTE
- Syntax similar to 'use'. */
export async function assets(path, { name, raw } = {}) {
  path = normalize_path(path);
  const type = get_type(path);
  if (type === "js" && !raw) {
    const result = await js_cache.get(path, async () => {
      const text = await fetch_text(path);
      return await module.from_text(text);
    });
    /* NOTE
    - Convention: Modules with default export, should not export 
      anything else. */
    if ("default" in result) {
      return result.default;
    }
    if (name) {
      return result[name];
    }
    return result;
  }
  if (type === "css" && !raw) {
    /* Mimic Vite: css becomes global (albeit via link) */
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
  const result = await cache.get(path);
  if (type === "json" && !raw) {
    /* Mimic Vite: Return uncached parsed json */
    return JSON.parse(result);
  }
  return result;
}

/* Patch additional members onto 'assets' */
assign(
  assets,
  class {
    /* Enables Python-like syntax. */
    importer(path) {
      return (function proxy() {
        return new Proxy(
          {},
          {
            get: (target, part) => {
              if (part.includes(":"))
                return (options = {}) =>
                  assets((path += `${part.replaceAll(":", ".")}`), options);
              path += `/${part}`;
              return proxy();
            },
          }
        );
      })();
    }
    /* Returns array of public paths, optionally subject to filter. */
    paths(filter) {
      if (filter) {
        return paths.filter(filter);
      }
      return paths;
    }
  }
);

/* Returns file type. */
function get_type(path) {
  return path.split(".").reverse()[0];
}

/* Returns env-adjusted path. */
function normalize_path(path) {
  return `${import.meta.env.BASE_URL}${path.slice("/".length)}`;
}

/* Returns text content of file in public by env-adjusted path. */
async function fetch_text(path) {
  const response = await fetch(path);
  return (await response.text()).trim();
}

/* Enable Python-like syntax for selected dirs. */
(() => {
  const test = assets.importer("/test");
  assign(
    assets,
    class {
      get test() {
        return test;
      }
    }
  );
})();
