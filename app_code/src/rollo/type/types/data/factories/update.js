/* Factory for enhancing plain object features, notably:
- Batch updating.
- Conditional mutation with (chainable) methods that resemble 
  (mutating versions of) array methods.
*/
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Sets all items to a provided value. Chainable. */
    reset(value) {
      this.update(
        Object.fromEntries(Object.entries(this).map(([k, v]) => [k, value]))
      );
      return this;
    }

    /* Mutates items as per provided function. Chainable. */
    transform(f) {
      this.update(Object.fromEntries(Object.entries(this).map(f)));
      return this;
    }

    /* Mutates items from provided object. Chainable. */
    update(update) {
      if (!update) return this;
      /* Allow update as entries array */
      if (Array.isArray(update)) {
        update = Object.fromEntries(update);
      }

      for (const [k, v] of Object.entries(update)) {
        this[k] = v;
      }

      return this;
    }
  };
};
