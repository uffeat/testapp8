/* Implements reset method. */
export const reset = (parent, config, ...factories) => {
  return class reset extends parent {
    /* Sets all data items to a provided value. Chainable. */
    reset(value) {
      /* NOTE
      - Mutates via 'update' to ensure centralized mutation.
      */
      this.update(
        Object.fromEntries(Object.entries(this).map(([k, v]) => [k, value]))
      );
      return this;
    }
  };
};
