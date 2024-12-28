import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements 'update' method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = Effects.create(this);

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
      let current;
      let previous;
      if (this.effects && this.effects.size) {
        current = this.difference(update);
        previous = this.difference(update, true);
      }
      /* Update */
      Object.assign(this, update);
      /* Remove items with undefined value */
      [...Object.entries(this)].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      /* Call effects, if change */
      if (current) {
        this.effects.call({ current, previous });
      }
      return this;
    }
  };
};
