/* Implements clear method. */
export const clear = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'clear'
    /* Deletes all items. Chainable. */
    clear() {
      /* Mutate via 'update' to ensure centralized mutation.
      Prevents redundant effect calls. */
      this.update(Object.entries(this).map(([k, v]) => [k, undefined]));
      return this;
    }
  };
};
