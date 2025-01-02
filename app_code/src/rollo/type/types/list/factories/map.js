/* Implements 'map' method. */
export const map = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'map'
    /* Transforms values as per provided function. 
    - If 'mutate' is true, mutates in-place. Chainable. 
    - If 'mutate' is false, returns new object with transformed values. 
    NOTE
    - Corresponds to the 'map' array method.
    */
    map(f, mutate = true) {
      const add = this.current.filter((v) => f(v) !== undefined)
      const remove = this.current.filter((v) => f(v) === undefined)
      if (mutate) {
        this.add(...add)
        this.remove(...remove)
        return this
      }
      return this.current.filter((v) => f(v) !== undefined)
    }
  };
};

