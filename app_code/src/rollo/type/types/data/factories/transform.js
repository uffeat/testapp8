/* Implements transform method. */
export const transform = (parent, config, ...factories) => {
  return class transform extends parent {
    /* Mutates data items as per provided function. Chainable. */
    transform(f) {
      /* NOTE
      - Mutates via 'update' to ensure centralized mutation.
     */
      this.update(Object.fromEntries(Object.entries(this).map(f)));
      return this;
    }
  };
};
