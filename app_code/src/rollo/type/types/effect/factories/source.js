/* Implements source getter/setter. */
export const source = (parent, config, ...factories) => {
  return class source extends parent {
    /* Returns source. */
    get source() {
      return this.#source;
    }
    /* Sets source. */
    set source(source) {
      this.#source = source;
    }
    #source;
  };
};
