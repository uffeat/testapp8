/*
rollovite/tools/processors.js
20250507
*/

/* NOTE Do NOT import modules that uses 'modules' here! */

/* Tool for managing processors. 
NOTE
- Primarily intended for use in 'modules'. */
export class Processors {
  #registry = new Map();

  /* Adds one or more processors. Chainable. */
  add(spec, { overwrite = false } = {}) {
    const entries = Object.entries(spec);
    entries.forEach(([key, processor]) => {
      if (!overwrite && this.#registry.has(key)) {
        throw new Error(`Processor key '${key}' already registered.`);
      }
      this.#registry.set(key, processor);
    });
    return this;
  }

  /* Removes all processors. Chainable. */
  clear() {
    this.#registry.clear();
    return this;
  }

  /* Returns processor by key. */
  get(key) {
    return this.#registry.get(key);
  }

  /* Checks, if a processor with a given key has been registered. */
  has(key) {
    return this.#registry.has(key);
  }

  /* Returns number of processors registered. */
  size() {
    /* NOTE
    - Implemented as method for consistency with respect to similar utils */
    return this.#registry.size;
  }

  /* Removes processor. Chainable. */
  remove(key) {
    this.#registry.delete(key);
    return this;
  }
}
