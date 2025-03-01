/* Implements source. */
export const source = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'source'
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

