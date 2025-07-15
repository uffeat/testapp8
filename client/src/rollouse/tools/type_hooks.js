/*
import { TypeHooks } from "@/rollouse/tools/type_hooks.js";
20250628
v.1.0
*/

export class TypeHooks {
  #_ = {
    registry: new Map(),
  };
  constructor(owner) {
    this.#_.owner = owner;
  }

  add(...specs) {
    specs.forEach((spec) => {
      Object.entries(spec).forEach(([type, loader]) => {
        /* Enforce no-duplication */
        if (this.#_.registry.has(type)) {
          throw new Error(`Duplicate key: ${type}`);
        }
        this.#_.registry.set(type, loader);
      });
    });
    return this.#_.owner;
  }

  get(type) {
    return this.#_.registry.get(type);
  }

  has(type) {
    return this.#_.registry.has(type);
  }
}
