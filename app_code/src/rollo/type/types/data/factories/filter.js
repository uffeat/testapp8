/* Implements filter method. */
export const filter = (parent, config, ...factories) => {
  return class filter extends parent {
    /* Filters as per provided function. 
    - If mutate is true, mutates in-place. Chainable. 
    - If mutate is false, returns new object with filtered items. 
    - Corresponds to the 'filter' array method.
    */
    filter(f, mutate = true) {
      const include = Object.entries(this).filter(f);
      if (mutate) {
        const exclude = Object.entries(this).filter(([k, v]) => !f([k, v])).map(([k, v]) => [k, undefined])
        /* Mutate via 'update' to ensure centralized mutation */
        this.update([...include, ...exclude]);
        return this;
      }
      return Object.fromEntries(include);
    }
  };
};

