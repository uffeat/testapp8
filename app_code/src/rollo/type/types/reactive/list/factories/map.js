/* Implements 'map' method. */
export const map = (parent, config, ...factories) => {
  return class extends parent {
    static name = "map";

    /* Transforms values as per provided function. 
    - If 'mutate' is true, mutates in-place. Chainable. 
    - If 'mutate' is false, returns new object with transformed values. 
    NOTE
    - Corresponds to the 'map' array method.
    */
    map(f, mutate = true) {
      let mapped = this.current.map(f);
      if (mutate) {
        mapped = new Set(mapped);
        const current = this.__dict__.current;
        const add = [...mapped.difference(current)];
        const remove = [...current.difference(mapped)];
        this.update({ add, remove });
        return this;
      }
      return mapped;
    }
  };
};
