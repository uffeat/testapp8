/*
import { modules } from "@/rollovite/modules.js";
20250512
v.3.3
*/

/* NOTE Do NOT import modules that uses 'modules'! */
import { Loaders } from "@/rollovite/tools/loaders.js";
import { assets } from "@/rollovite/tools/public/assets.js";

/* Create and configure loaders with global scope covering common file types */
const loaders = Loaders();
loaders.registry
  .add(
    {},
    import.meta.glob("/src/**/*.css"),
    import.meta.glob("/src/**/*.html", { query: "?raw", import: "default" }),
    import.meta.glob(["/src/**/*.js", "!/src/test/**/*.test.js"]),
    import.meta.glob("/src/**/*.json", { import: "default" })
  )
  .add(
    { raw: true },
    import.meta.glob("/src/**/*.css", { query: "?raw", import: "default" }),
    import.meta.glob("/src/**/*.js", { query: "?raw", import: "default" }),
    import.meta.glob("/src/**/*.json", { query: "?raw", import: "default" })
  )
  .freeze();

/* */
export const modules = new (class Modules {
  #batch;
  #importer;
  #processors;
  #public;
  #src;

  constructor() {
    this.#batch = new (class {
      /* */
      async public(filter) {
        return await assets.batch(filter);
      }

      /* */
      async src(filter) {
        return await loaders.batch(filter);
      }
    })();

    this.#importer = new (class {
      get public() {
        return assets.importer;
      }

      get src() {
        return loaders.importer;
      }
    })();

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

    this.#public = assets.path;
    this.#src = loaders.path;
  }

  /* Returns controller for batch imports. */
  get batch() {
    return this.#batch;
  }

  /* Returns controller for creating objects that allow import from a base 
  dir. */
  get importer() {
    return this.#importer;
  }

  /* Returns controller for processors. */
  get processors() {
    return this.#processors;
  }

  /* Returns import from public with Python-like syntax. */
  get public() {
    return this.#public;
  }

  /* Returns import from src with Python-like syntax. */
  get src() {
    return this.#src;
  }

  /* Returns import. */
  async import(path, { name, raw } = {}) {
    const result = path.startsWith("@/")
      ? await loaders.import(path, { name, raw })
      : await assets.import(path, { name, raw });

    const extension = get_extension(path);
    const processor = this.processors.get(extension);
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
