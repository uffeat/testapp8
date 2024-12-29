/* Implements 'map' method. */
export const map = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'map'
    /* Transforms items as per provided function. 
    - If 'mutate' is true, mutates in-place. Chainable. 
    - If 'mutate' is false, returns new object with transformed items. 
    NOTE
    - Corresponds to the 'map' array method.
    */
    map(f, mutate = true) {
      const mapped = Object.fromEntries(this.entries.map(f));
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

