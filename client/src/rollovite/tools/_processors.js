/*
import { Processors } from "@/rollovite/tools/_processors.js";
20250518
v.1.0
*/

import { Processor } from "@/rollovite/tools/_processor.js";

/* Processor registry. 
NOTE
- Rollo import engine member. 
- Can, but should typically not, be used stand-alone. */
export class Processors {
  #owner;
  #registry = new Map();

  constructor(owner, spec = {}) {
    this.#owner = owner;
    Object.entries(spec).forEach(([key, source]) => {
      /* Enforce no-duplication */
      if (this.#registry.has(key)) {
        throw new Error(`Duplicate key: ${key}`);
      }
      this.#registry.set(key, new Processor(this.#owner, source));
    });
  }

  get(key) {
    return this.#registry.get(key);
  }

  has(key) {
    return this.#registry.has(key);
  }
}
