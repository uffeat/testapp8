/* Implements update method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    /* Returns shallow copy of current data items. */
    get current() {
      return { ...this };
    }
    /* Sets current data items (non-accessor) reactively */
    set current(current) {
      if (current) {
        this.update(
          Object.fromEntries([
            /* Get entries from current that are different from this */
            ...Object.entries(current).filter(([k, v]) => this[k] !== v),
            /* Create undefined-value entries for entries that are not in current */
            ...Object.entries(this)
              .filter(([k, v]) => !(k in current))
              .map(([k, v]) => [k, undefined]),
          ])
        );
      } else {
        this.clear();
      }
    }

    /* Returns shallow copy of data items as-were before most recent update. */
    get previous() {
      return { ...this.#previous };
    }
    /* Can, but should generally not, be set externally. */
    set previous(previous) {
      this.#previous = previous

    }
    #previous = {};

    /* Mutates items reactively from provided 'update'. Chainable. 
    NOTE
    - By convention, an undefined value is a cue to delete.
    */
    update(update) {
      if (!update) return this;
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
        current = this.difference(update);
        previous = this.difference(update, true);
      }
      /** Update */
      Object.assign(this.previous, this.current);
      Object.assign(this, update);
      /* Remove items with undefined value */
      [...this.items].forEach(([k, v]) => {
        if (v === undefined) {
          delete this[k];
        }
      });
      /* Call effects, if change */
      if (current) {
        this.effects({ current, previous });
      }
      return this;
    }
  };
};
