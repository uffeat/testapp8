/*
import { Processors } from "@/rollovite/_tools/processors.js";
20250525
v.1.0
*/

/* Do NOT import anything from outside 'rollovite' */

/* Utility for managing processors. */
export class Processors {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Adds processors. Chainable with respect to owner. */
  add(...specs) {
    const owner = this.#_.owner
    specs.forEach((spec) => {
      Object.entries(spec).forEach(([key, processor]) => {
        const cache = (() => {
          if (key.endsWith("?cache")) {
            key = key.slice(0, -"?cache".length);
            return true;
          }
        })();
        /* Enforce no-duplication */
        if (this.#_.registry.has(key)) {
          throw new Error(`Duplicate key: ${key}`);
        }
        this.#_.registry.set(
          key,
          /* Wrap in class to provide caching */
          new (class {
            #cache = new Map();
            /* Returns processed result (freshly created or from cache). */
            async call(path, result) {
               /* Use 'call', so that processor can be an object with a 'call' 
               method or a non-arrow that exploits its context. */
              if (!cache || path.query.has('nocache'))
                return await processor.call(null, result, {
                  owner,
                  path,
                });
              if (this.#cache.has(path.path)) return this.#cache.get(path.path);
              const processed = await processor.call(null, result, {
                owner,
                path,
              });
              this.#cache.set(path, processed);
              return processed;
            }
          })()
        );
      });
    });
    return this.#_.owner;
  }

  /* Returns class-wrapped processor. */
  get(key) {
    return this.#_.registry.get(key);
  }

  /* Checks, if key registered. */
  has(key) {
    return this.#_.registry.has(key);
  }
}
