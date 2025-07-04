/*
import { app } from "@/rolloapp/_app.js";
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import { component } from "@/rollocomponent/component.js";

import anvilconfig from "@/rolloanvil/config.json";

import { construct } from "@/rolloapp/tools/construct.js";
import { ImportMaps } from "@/rolloapp/tools/import_maps.js";
import { Path } from "@/rolloapp/tools/path.js";
import { Processors } from "@/rolloapp/tools/processors.js";
import { Signatures } from "@/rolloapp/tools/signatures.js";
import { pub } from "@/rolloapp/tools/pub.js";

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();
      this.#_.maps = new ImportMaps(this);
      this.#_.processors = new Processors(this);
      this.#_.signatures = new Signatures(this);

      this.id = "app";

      this.shadow.append(
        component.div({}, component.slot({ name: "data" })),
        component.div({}, component.slot({ name: "modal" }))
      );
    }

    __new__() {
      super.__new__?.();
      this.attribute.environment = import.meta.env.DEV
        ? "development"
        : import.meta.env.VERCEL_ENV;

      this.attribute.orgin = location.origin;

      this.attribute.anvilEnvironment =
        import.meta.env.VERCEL_ENV === "production"
          ? "production"
          : "development";

      this.attribute.anvilOrigin =
        import.meta.env.VERCEL_ENV === "production"
          ? anvilconfig.origins.production
          : anvilconfig.origins.development;
    }

    /* Returns maps controller. */
    get maps() {
      return this.#_.maps;
    }

    /* Returns processors controller. */
    get processors() {
      return this.#_.processors;
    }

    /* Returns signatures controller. */
    get signatures() {
      return this.#_.signatures;
    }

    /* Returns import from src or public, subject to any processing. */
    async import(specifier, options = {}) {
      const path = new Path(specifier);
      /* Signature */
      if (this.#_.signatures.has(path.types)) {
        const handler = this.#_.signatures.get(path.types);
        await handler(options, { owner: this, path });
      }

      const { cache = true, raw = false } = options;

      /* Import */
      const result = path.public
        ? await pub.import(path, { cache, raw })
        : await (async () => {
            /* Special case: uncached js module */
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
