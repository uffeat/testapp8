/* Implements forEach method. */
export const for_each = (parent, config, ...factories) => {
  return class extends parent {
    static name = 'for_each'
    /* Executes provided function with values successively passed in. Chainable. */
    forEach(f) {
      this.current.forEach(f);
      return this;
    }
  };
};
