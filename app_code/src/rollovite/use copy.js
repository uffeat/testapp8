/*
rollovite/use.js
20250500
v.0.1
*/

/* NOTE Do NOT import modules that uses 'modules' here! */
import { assign } from "@/rollo/tools/assign.js";

/* */
const registry = new (class Registry {
  #registry = new Map();

  /* */
  add(...loaders) {
    loaders.forEach((loader) =>
      Object.entries(loader).forEach(([path, load]) =>
        this.#registry.set(`@/${path.slice("/src/".length)}`, load)
      )
    );
    return this;
  }

  /* */
  get(path) {
    return this.#registry.get(path);
  }

  /* */
  paths(filter) {}
})();

/* */
registry.add(
  import.meta.glob(["/src/**/*.css"]),
  import.meta.glob(["/src/**/*.html"], { query: "?raw" }),
  import.meta.glob(["/src/**/*.js", "!/src/**/*.test.js"]),
  import.meta.glob(["/src/**/*.json"]),
  import.meta.glob(["/src/**/*.sheet"], { query: "?raw" })
);

/* */
export async function use(path, { name } = {}) {
  const load = registry.get(path);
  const module = await load();
  if ("default" in module) {
    return module.default;
  }
  if (name) {
    return module[name];
  }
  return module;
}

/* */
function importer(path) {
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

/* */
assign(
  use,
  class {
    importer(path) {
      return importer(path);
    }
    paths(filter) {
      return registry.paths(filter);
    }
  }
);

(() => {
  const components = importer("@/components");
  const rollo = importer("@/rollo");
  const rolloanvil = importer("@/rolloanvil");
  const rolloui = importer("@/rolloui");
  const test = importer("@/test");
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
