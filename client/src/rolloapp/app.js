/*
import { app } from "@/rolloapp/app.js";
*/

import { meta } from "@/rollometa/meta.js";
import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import { component } from "@/rollocomponent/component.js";
import { Path } from "@/rolloapp/tools/path.js";
import { Processors } from "@/rolloapp/tools/processors.js";
import { Signatures } from "@/rolloapp/tools/signatures.js";
import { pub } from "@/rolloapp/tools/pub.js";
import { Imports } from "@/rolloapp/tools/imports.js";

const App = author(
  class extends base() {
    static __key__ = "rollo-app";

    #_ = {};

    constructor() {
      super();

      this.#_.processors = new Processors(this);
      this.#_.signatures = new Signatures(this);

      this.#_.imports = new Imports(this);

      this.id = "app";

      this.shadow.append(
        component.div({}, component.slot({ name: "data" })),
        component.div({}, component.slot({ name: "modal" }))
      );
    }

    __new__() {
      super.__new__?.();
      const owner = this;

      this.attribute.dev = meta.env.DEV;
      this.attribute.environment = meta.env.name;
      this.attribute.origin = meta.env.origin;
    }

    /* Returns imports controller. */
    get imports() {
      return this.#_.imports;
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
      //const result = await pub.import(path, { cache, raw });

      /*
      let result
      if (path.public) {
        result = await pub.import(path, { cache, raw })
      } else {
        result = await this.imports.import(path);
      }
        */

      const result = path.public
        ? await pub.import(path, { cache, raw })
        : await this.imports.import(path, { raw });

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

    __init__() {
      super.__init__?.();
    }
  }
);

export const app = App({ id: "app", parent: document.body });
