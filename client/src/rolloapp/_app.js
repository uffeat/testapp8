/*
import { app } from "@/rolloapp/_app.js";
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";

import { construct } from "@/rolloapp/_tools/construct.js";
import { ImportMaps } from "@/rolloapp/_tools/import_maps.js";
import { Path } from "@/rolloapp/_tools/path.js";
import { Processors } from "@/rolloapp/_tools/processors.js";
import { pub } from "@/rolloapp/_tools/pub.js";

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();
      this.id = "app";

      this.#_.maps = new ImportMaps(this);
      this.#_.processors = new Processors(this);
    }

    /* Returns maps controller. */
    get maps() {
      return this.#_.maps;
    }

    /* Returns processors controller. */
    get processors() {
      return this.#_.processors;
    }

    /* Returns import from src or public, subject to any processing. */
      async import(specifier, { cache = true, raw = false } = {}) {
        const path = new Path(specifier);
        /* Import */
        const result = path.public
          ? await pub.import(path, { cache, raw })
          : await (async () => {
              /* Handle the special case of uncached js modules */
              if (!path.public && path.type === "js" && cache === false) {
                const text = (await this.maps.get(path, { raw: true })()).trim();
                return await construct(`${text}\n//# sourceURL=${path.file}`);
              }
              return this.maps.get(path, { raw })();
            })();
        /* Process */
        if (this.#_.processors.has(path.types)) {
          const processor = this.#_.processors.get(path.types);
          const processed = await processor.call(path.path, result, {
            owner: this,
            path,
            cache,
          });
          if (processed !== undefined) return processed;
        }
        return result;
      }
  }
);

export const app = App({ id: "app", parent: document.body });

