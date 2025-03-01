/* Value registry. */
export class Registry {
  #registry = {};
  /* Registers and returns value. */
  add(key, value) {
    if (import.meta.env.DEV) {
      if (key in this.#registry) {
        console.info(`Replaced registered: ${key}`);
      } else {
        console.info(`Registered: ${key}`);
      }
    }
    this.#registry[key] = value;
    return value;
  }
  /* Returns registered value. */
  get(key) {
    return this.#registry[key];
  }
}