export class Macros {
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
          `Replaced registered macro${macro.name ? `: ${macro.name}` : ""}.`
        );
      } else {
        console.info(
          `Registered macro${macro.name ? `: ${macro.name}` : ""}.`
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
      const result = macro.call(this.#owner, tag, ...args);
      if (result === false) {
        break
      } else if (result === true) {
        this.remove(macro)
      }
    }
  }

  /* Tests, if macro registered */
  has(macro) {
    return this.#registry.has(macro)
  }

  /* Removes macro. */
  remove(macro) {
    if (this.#registry.has(macro)) {
      this.#registry.delete(macro);
      if (import.meta.env.DEV) {
        console.info(
          `Deregistered macro${macro.name ? `: ${macro.name}` : ""}.`
        );
      }
    }
  }
}