
export const name = (parent, config, ...factories) => {
  return class extends parent {
    static name = "name";

    #name;

    /* Returns name. */
    get name() {
      return this.#name;
    }
    /* Sets name. */
    set name(name) {
      this.#name = name;
    }
  };
};
