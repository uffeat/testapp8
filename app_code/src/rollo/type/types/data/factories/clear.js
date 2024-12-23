/* TODO
- Refactor to use update with '__' values.
*/

/* Implements clear method. */
export const clear = (parent, config, ...factories) => {
  return class clear extends parent {
    /* Deletes all items. Chainable. */
    clear() {
      [...Object.entries(this)].forEach(([k, v]) => {
        delete this[k];
      });
      return this;
    }
  };
};
