export class Macro {
  static create = (...args) => new Macro(...args)
  #owner;
  #registry = new Set();
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns number of registered macros. */
  get size() {
    return [...this.#registry.values()].length;
  }

  /* Registers and returns macro. */
  add(macro) {
    if (import.meta.env.DEV) {
      if (this.#registry.has(macro)) {
        console.info(
          `Replaced registered ${macro.name ? `: ${macro.name}` : ""}.`
        );
      } else {
        console.info(
          `Registered ${macro.name ? `: ${macro.name}` : ""}.`
        );
      }
    }
    this.#registry.add(macro);
    return macro;
  }

  /* Calls registered macros. */
  call(tag, ...args) {
    /* Iterate over a copy of values to allow macros to safely remove 
    themselves from registry. */
    for (const macro of [...this.#registry.values()]) {
      macro.call(this.#owner, tag, ...args);
    }
  }

  /* Removes macro. */
  remove(macro) {
    if (this.#registry.has(macro)) {
      this.#registry.delete(macro);
      if (import.meta.env.DEV) {
        console.info(
          `Deregistered ${macro.name ? `: ${macro.name}` : ""}.`
        );
      }
    }
  }
}