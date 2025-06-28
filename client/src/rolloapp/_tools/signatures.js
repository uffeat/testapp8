/*
import { Signatures } from "@/rolloapp/_tools/signatures.js";
20250628
v.1.0
*/


/* Utility for managing signatures. */
export class Signatures {
  #_ = {
    registry: new Map(),
  };

  constructor(owner) {
    this.#_.owner = owner;
  }

  /* Adds signature handlers. Chainable with respect to owner. */
  add(...specs) {
    specs.forEach((spec) => {
      Object.entries(spec).forEach(([key, handler]) => {
        /* Enforce no-duplication */
        if (this.#_.registry.has(key)) {
          throw new Error(`Duplicate key: ${key}`);
        }
        this.#_.registry.set(key, handler);
      });
    });
    return this.#_.owner;
  }

  /* Returns handler. */
  get(key) {
    return this.#_.registry.get(key);
  }

  /* Checks, if key registered. */
  has(key) {
    return this.#_.registry.has(key);
  }
}
