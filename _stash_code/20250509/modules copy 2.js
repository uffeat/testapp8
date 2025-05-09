/*
rollovite/modules.js
20250509
v.3.0
*/

import { assign } from "@/rollo/tools/assign.js";
import { use } from "@/rollovite/use.js";
import { assets } from "@/rollovite/assets.js";

export const modules = new (class Modules {
  #processors;
  #public;
  #src;

  constructor() {
    this.#processors = new (class Processors {
      #registry = new Map();

      /* Adds one or more processors. Chainable. */
      add(spec) {
        Object.entries(spec).forEach(([extension, processor]) => {
          this.#registry.set(extension, processor);
        });
        return this;
      }

      /* Removes all processors. Chainable. */
      clear() {
        this.#registry.clear();
        return this;
      }

      /* Prevents addition of processors. Chainable. */
      freeze() {
        Object.freeze(this.#registry);
        return this;
      }

      /* Returns processor. */
      get(extension) {
        return this.#registry.get(extension);
      }

      /* Returns extensions, for which processors have been registered;
      optionally, filtered. */
      processors(filter) {
        const result = Array.from(this.#registry.keys());
        if (filter) {
          return result.filter(filter);
        }
        return result;
      }

      /* Removes processor. Chainable. */
      remove(key) {
        this.#registry.delete(key);
        return this;
      }
    })();

    this.#public = new (class Public {
      paths(...args) {
        return assets.paths(...args);
      }
    })();

    this.#src = new (class Src {
      paths(...args) {
        return use.paths(...args);
      }
    })();
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns controller for files in public. */
  get public() {
    return this.#public;
  }

  /* Returns controller for files in src. */
  get src() {
    return this.#src;
  }

  /* Returns import result. 
    NOTE
    - Syntactial Python-like alternative to 'get'. */
  get import() {
    let path;
    const modules = this;
    return (function proxy() {
      return new Proxy(
        {},
        {
          get: (target, part) => {
            /* Source */
            if (path === undefined) {
              if (part === "src") {
                path = "@";
              } else if (part === "public") {
                path = "";
              } else {
                throw new Error(`Invalid source`);
              }
              return proxy();
            }
            /* Termination */
            if (part.includes(":"))
              return (options = {}) =>
                modules.get((path += `${part.replaceAll(":", ".")}`), options);
            /* Buuld dir path */
            path += `/${part}`;
            return proxy();
          },
        }
      );
    })();
  }

  /* Enables Python-like syntax from given base path. */
  importer(path) {
    const modules = this;
    return (function proxy() {
      return new Proxy(
        {},
        {
          get: (target, part) => {
            if (part.includes(":"))
              return (options = {}) =>
                modules.get((path += `${part.replaceAll(":", ".")}`), options);
            path += `/${part}`;
            return proxy();
          },
        }
      );
    })();
  }

  /* Returns import. */
  async get(path, { name, raw } = {}) {
    const result = path.startsWith("@/")
      ? await use(path, { name })
      : await assets(path, { name, raw });

    const processor = this.processors.get(get_extension(path));
    if (processor) {
      return await processor.call(null, path, result);
    }
    return result;
  }
})();

function get_extension(path) {
  const file = path.split("/").reverse()[0];
  const [stem, ...meta] = file.split(".");
  return meta.join(".");
}


/* Enable Python-like syntax for selected dirs. */
(() => {
  const components = modules.importer("@/components");
  const rollo = modules.importer("@/rollo");
  const rolloanvil = modules.importer("@/rolloanvil");
  const rolloui = modules.importer("@/rolloui");
  const test = modules.importer("@/test");
  assign(
    modules,
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
