/*
rollovite/use.js
20250509
v.0.1
*/

/* NOTE
- Keep 'use' and related tools robust, lean and focused on the primary jobs:
  1. Truly dynamic imports
  2. Batch imports
- Features such as post-processors, hooks etc.
  do NOT belong here, but the dynamic nature of 'use' makes it possible to 
  implement such features elsewhere. 
- Do NOT integrate support for import of public files in 'use'.
  Such integration should be done in a higher-level tool. */

/* Do NOT import modules that uses 'modules' here! */
import { assign } from "@/rollo/tools/assign.js";

/* Loader registry. */
const registry = new Map();

/* Registers loaders. */
function add(...loaders) {
  /* NOTE
  - Rather than using Vite's loader objects directly, these are copied into 
    a central registry. While this does involve a copy-step it also guards 
    against duplicate registration and provides initial adaption to the '@/'
    syntax, rather than at each retrieval. */
  loaders.forEach((loader) =>
    Object.entries(loader).forEach(([path, load]) =>
      registry.set(`@/${path.slice("/src/".length)}`, load)
    )
  );
}
/* Register global loaders */
add(
  import.meta.glob(["/src/**/*.css"]),
  import.meta.glob(["/src/**/*.html"], { query: "?raw" }),
  import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]),
  import.meta.glob(["/src/**/*.json"]),
  import.meta.glob(["/src/**/*.sheet"], { query: "?raw" })
);

/* Returns import.
NOTE
- Supports truly dynamic imports.
- Enables batch imports via 'paths'.
- Allows alternative Python-like syntax. */
export async function use(path, { name } = {}) {
  const load = registry.get(path);
  const module = await load();
  /* NOTE
  - Convention: Modules with default export, should not export 
    anything else. Also, provides a leaner syntax (and simpler registration)
    for file types that inherently only exposes default. */
  if ("default" in module) {
    return module.default;
  }
  /* XXX
  - 'name' kwarg only relevant for js modules with no default. */
  if (name) {
    return module[name];
  }
  return module;
}

/* Patch additional members onto 'use' */
assign(
  use,
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
                  use((path += `${part.replaceAll(":", ".")}`), options);
              path += `/${part}`;
              return proxy();
            },
          }
        );
      })();
    }
    /* Returns array of registered paths, optionally subject to filter. */
    paths(filter) {
      const paths = Array.from(registry.keys());
      if (filter) {
        return paths.filter(filter);
      }
      return paths;
    }
  }
);

/* Enable Python-like syntax for selected top-level dirs. */
(() => {
  const components = use.importer("@/components");
  const rollo = use.importer("@/rollo");
  const rolloanvil = use.importer("@/rolloanvil");
  const rolloui = use.importer("@/rolloui");
  const test = use.importer("@/test");
  assign(
    use,
    class {
      get components() {
        return components;
      }
      get rollo() {
        return rollo;
      }
      get rolloanvil() {
        return rolloanvil;
      }
      get rolloui() {
        return rolloui;
      }
      get test() {
        return test;
      }
    }
  );
})();
