/* Implements clean method. */
export const clean = (parent, config, ...factories) => {
  return class clean extends parent {
    /* Deletes all items with undefined values. Chainable. */
    clean() {
      [...Object.entries(this)].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      return this;
    }
  };
};
