/* TODO
- Purge. Not relevant, since data items can never be undefined
*/


/* Implements clean method. */
export const clean = (parent, config, ...factories) => {
  return class clean extends parent {
    /* Deletes all items with undefined values. Chainable. */
    clean() {
      /* NOTE
      - Mutates via 'update' to ensure centralized mutation.
      */
      this.update(
        Object.fromEntries(Object.entries(this).map(([k, v]) => [k, undefined]))
      );
      return this;




      // Old
      [...Object.entries(this)].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      return this;
      
    }
  };
};
