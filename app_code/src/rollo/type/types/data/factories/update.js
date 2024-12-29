const { Value } = await import("rollo/type/types/value/value");
import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements 'update' method. */
export const update = (parent, config, ...factories) => {
  return class update extends parent {
    get $() {
      return this.#$;
    }
    /* Reactively binds to other Data object.
    NOTE
    - Provides a clean declarative syntax, e.g.,
        data.$ = state
    - Use 'condition' and/or 'transformer' props to avoid binding 1:1
    */
    set $(publisher) {
      if (publisher.__type__ === "data") {
        this.subscriptions.add(publisher, (change) => {
          this.update(change.current);
        });
      } else {
        console.error(`Invalid type:`, publisher);
        throw new TypeError(`Invalid type.`);
      }
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        return target[key];
      },
      set: (target, key, value) => {
        if (target.__chain__.defined.has(key)) {
          target[key] = value;
        } else {
          if (value instanceof Value) {
            target.subscriptions.add(value, (change) => {
              target.update({ [key]: change.current });
            });
          } else {
            target.update({ [key]: value });
          }
        }
        return true;
      },
    });

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
