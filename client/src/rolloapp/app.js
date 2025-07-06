/*
import { app } from "@/rolloapp/_app.js";
*/

import { author } from "@/rollocomponent/tools/author.js";
import { base } from "@/rollocomponent/tools/base.js";
import { component } from "@/rollocomponent/component.js";

import { Anvil } from "@/rolloanvil/anvil.js";

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
      const owner = this;

      this.#_.meta = new (class {
        #_ = {};

        constructor() {
          this.#_.env = new (class {
            #_ = {};

            constructor() {
              this.#_.DEV = location.origin.startsWith("http://localhost:");

              if (this.#_.DEV) {
                this.#_.name = "development";
              } else {
                if (location.origin === "https://testapp8.vercel.app") {
                  this.#_.name = "production";
                } else {
                  this.#_.name = "preview";
                }
              }

              owner.attribute.dev = this.#_.DEV;
              owner.attribute.environment = this.#_.name;
              owner.attribute.origin = location.origin;
            }

            get DEV() {
              return this.#_.DEV;
            }

            get name() {
              return this.#_.name;
            }

            get origin() {
              return location.origin;
            }
          })();
        }

        get env() {
          return this.#_.env;
        }
      })();

      this.#_.anvil = Anvil({slot: 'data'})
      this.append(this.#_.anvil)
    }

    get anvil() {
      return this.#_.anvil;
    }

    /* . */
    get meta() {
      return this.#_.meta;
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
      const result = await pub.import(path, { cache, raw });
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
