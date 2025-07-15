/*
import { Processors } from "@/rolloapp/tools/processors.js";
20250526
v.2.0
*/


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
    specs.forEach((spec) => {
      Object.entries(spec).forEach(([key, processor]) => {
        /* Enforce no-duplication */
        if (this.#_.registry.has(key)) {
          throw new Error(`Duplicate key: ${key}`);
        }
        this.#_.registry.set(key, processor);
      });
    });
    return this.#_.owner;
  }

  /* Returns processor. */
  get(key) {
    return this.#_.registry.get(key);
  }

  /* Checks, if key registered. */
  has(key) {
    return this.#_.registry.has(key);
  }
}
