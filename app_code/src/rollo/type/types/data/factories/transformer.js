/* Implements transformer getter/setter. */
export const transformer = (parent, config, ...factories) => {
  return class transformer extends parent {
    /* Returns transformer. */
    get transformer() {
      return this.#transformer;
    }
    /* Sets transformer. */
    set transformer(transformer) {
      this.#transformer = transformer;
    }
    #transformer;
  };
};
