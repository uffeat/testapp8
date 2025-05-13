/*
import { modules } from "@/rollovite/modules.js";
20250512
v.3.3
*/

/* NOTE Do NOT import modules that uses 'modules'! */

import { Loaders } from "@/rollovite/tools/loaders.js";
import { assets } from "@/rollovite/tools/public/assets.js";

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

export const modules = new (class Modules {
  #batch;
  #importer;
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
      /* */
      get public() {
        return assets.importer;
      }

      /* */
      get src() {
        return loaders.importer
      }
    })();



    this.#public = assets.path;
    this.#src = loaders.path;
  }

  get batch() {
    return this.#batch;
  }

  get importer() {
    return this.#importer;
  }

  get public() {
    return this.#public;
  }

  get src() {
    return this.#src;
  }

  async import(path, { name, raw } = {}) {
    const result = path.startsWith("@/")
      ? await loaders.import(path, { name, raw })
      : await assets.import(path, { name, raw });

    return result;
  }
})();

/* Utilities... */

/* Configure... */
