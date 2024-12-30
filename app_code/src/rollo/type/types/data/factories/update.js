/* Implements 'update' method. */
export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";
    /* Mutates items reactively from provided 'update'. Chainable. 
    NOTE
    - By convention, undefined value is a cue to delete.
    */
    update(update) {
      if (!update) return this;
      /* Allow 'update' to be passed in as entries array */
      if (Array.isArray(update)) {
        update = Object.fromEntries(update);
      }
      /* Update defined properties */
      Object.entries(update)
        .filter(([k, v]) => this.__chain__.defined.has(k))
        .forEach(([k, v]) => (this[k] = v));
      /* Remove defined from update */
      update = Object.fromEntries(
        Object.entries(update).filter(
          ([k, v]) => !this.__chain__.defined.has(k)
        )
      );
      /* Filter updates as per condition */
      if (this.condition) {
        update = Object.fromEntries(
          Object.entries(update).filter(this.condition)
        );
      }
      /* Transform update as per transformer */
      if (this.transformer) {
        update = Object.fromEntries(
          Object.entries(update).map(this.transformer)
        );
      }
      /* Infer changes */
      const current = this.difference(update);
      const previous = this.difference(update, true);
      const changed_entries = Object.entries(current);

      if (changed_entries.length) {
       
        /* Update */
        changed_entries
          .filter(([k, v]) => v === undefined)
          .forEach(([k, v]) => delete this[k]);
        changed_entries
          .filter(([k, v]) => v !== undefined)
          .forEach(([k, v]) => (this[k] = v));
        /* Call effects */
        if (this.effects.size) {

          


          this.effects.call({ current, previous });
        }
      }
      return this;
    }
  };
};
