/* Implements transformer getter/setter. */
export const transformer = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'transformer'
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
