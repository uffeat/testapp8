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
  #frozen = false;
  #owner;
  #registry = new Map();

  constructor(owner) {
    this.#owner = owner;
  }

  get frozen() {
    return this.#frozen
  }

  add(spec) {
    Object.entries(spec).forEach(([key, source]) => {
      /* Enforce no-duplication */
      if (this.#registry.has(key)) {
        throw new Error(`Duplicate key: ${key}`);
      }
      this.#registry.set(key, new Processor(this.#owner, source));
    });
    return this;
  }

  clear() {
    this.#registry.clear();
    return this;
  }

  /* Prevents subsequent registry changes. Chainable. */
  freeze() {
    if (this.frozen) {
      throw new Error(`Already frozen.`);
    }
    this.#frozen = true;
    /* Replace methods that can change registry with chainable methods 
    that logs an error */
    const factory = (key) => () => {
      console.warn(`'${key}' cannot be used post-freeze.`);
      return this;
    };
    const keys = ["add", "clear", "remove"];
    keys.forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: factory(key),
      });
    });
    return this;
  }

  get(key) {
    return this.#registry.get(key);
  }

  has(key) {
    return this.#registry.has(key);
  }

  keys() {
    return this.#registry.keys();
  }

  remove(key) {
    this.#registry.delete(key);
    return this;
  }
}
