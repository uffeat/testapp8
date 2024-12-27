/* Implements clear method. */
export const clear = (parent, config, ...factories) => {
  return class clear extends parent {
    /* Deletes all items. Chainable. */
    clear() {
      /* Mutate via 'update' to ensure centralized mutation */
      this.update(Object.entries(this.current).map(([k, v]) => [k, undefined]));
      return this;
    }
  };
};
