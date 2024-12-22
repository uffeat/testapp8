/* Factory for write-once transformer property. */
export const transformer = (parent, config, ...factories) => {
  const cls = class transformer extends parent {
    /* Returns transformer. */
    get transformer() {
      return this.#transformer;
    }
    /* Sets transformer. */
    set transformer(transformer) {
      if (this.#transformer) {
        throw new Error(`'transformer' cannot be changed.`);
      }
      this.#transformer = transformer;
    }
    #transformer;
  };
  return cls;
};
