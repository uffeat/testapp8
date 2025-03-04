/* Implements reset method. */
export const reset = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'reset'
    /* Sets all items to a provided value. 
    - If 'mutate' is true, mutates in-place. Chainable. 
    - If 'mutate' is false, returns new object with reset items. */
    reset(value, mutate = true) {
      const mapped = Object.fromEntries(
        this.entries.map(([k, v]) => [k, value])
      );
      if (mutate) {
        /* Mutate via 'update' to ensure centralized mutation.
        Prevents redundant effect calls. */
        this.update(mapped);
        return this;
      }
      return mapped;
    }
  };
};
