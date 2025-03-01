/* Implements filter method. */
export const filter = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'filter'
    /* Filters as per provided function. 
    - If mutate is true, mutates in-place. Chainable. 
    - If mutate is false, returns new object with filtered items. 
    - Corresponds to the 'filter' array method.
    */
    filter(f, mutate = true) {
      if (mutate) {
        const remove = this.current.filter((v) => !f(v));
        this.remove(...remove);
        return this;
      }
      return this.current.filter(f);
    }
  };
};
