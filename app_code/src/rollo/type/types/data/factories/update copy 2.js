/* Implements update method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Mutates items reactively from provided 'update'. Chainable. 
    NOTE
    - By convention, an undefined value is a cue to delete.
    */
    update(update) {
      if (!update) return this;
      /* Filter updates as per condition */
      if (this.condition) {
        update = Object.fromEntries(
          Object.entries(update).filter(this.condition)
        );
      }
      /* Transform updates as per transformer */
      if (this.transformer) {
        update = Object.fromEntries(
          Object.entries(update).map(this.transformer)
        );
      }
      /* Infer changes */
      let current;
      let previous;
      if (this.effects && this.effects.size) {
        previous = this.difference(update);
        current = Object.fromEntries(
          Object.entries(previous).map(([k, v]) => [k, this[k]])
        );
      }
      /** Update */
      Object.entries(update).forEach(([k, v]) => (this[k] = v));
      /* Remove items with undefined value */
      [...this.entries].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      /* Call effects */
      if (current) {
        this.effects({ current, previous });
      }
      return this;
    }
  };
};
