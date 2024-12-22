/* Factory for write-once name property. */
export const name = (parent, config, ...factories) => {
  const cls = class name extends parent {
    /* Returns name. */
    get name() {
      return this.#name;
    }
    /* Sets name. */
    set name(name) {
      if (this.#name) {
        throw new Error(`'name' cannot be changed.`);
      }
      this.#name = name;
    }
    #name;
  };
  return cls;
};
