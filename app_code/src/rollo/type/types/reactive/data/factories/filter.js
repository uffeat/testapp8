/* Implements filter method. */
export const filter = (parent, config, ...factories) => {
  return class extends parent {
    static name = "filter";
    /* Filters as per provided function. 
    - If mutate is true, mutates in-place. Chainable. 
    - If mutate is false, returns new object with filtered items. 
    - Corresponds to the 'filter' array method. */
    filter(f, mutate = true) {
      if (mutate) {
        /* Mutate via 'update' to capture changes. */
        this.update(
          this.entries
            .filter(([k, v]) => !f([k, v]))
            .map(([k, v]) => [k, undefined])
        );
        return this;
      }
      return Object.fromEntries(this.entries.filter(f));
    }
  };
};
