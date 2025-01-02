/* Implements clear method. */
export const clear = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'clear'
    /* Deletes all values. Chainable. */
    clear() {
      this.remove(...this.values);
      return this;
    }
  };
};
