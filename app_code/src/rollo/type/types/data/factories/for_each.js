/* Implements forEach method. */
export const for_each = (parent, config, ...factories) => {
  return class for_each extends parent {
    /* Executes provided function with items successively passed in. Chainable. */
    forEach(f) {
      /* Use copy of entries, so that 'forEach' can be used to safely mutate object */
      [...Object.entries(this)].forEach(f);
      return this;
    }
  };
};
