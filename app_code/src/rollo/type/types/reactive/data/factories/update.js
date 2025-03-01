import { Change } from "@/rollo/type/types/reactive/tools/change";

export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    #added = Object.freeze({});
    #change = Object.freeze({});
    #current = Object.freeze({});
    #previous = Object.freeze({});
    #removed = Object.freeze([]);

    /* Returns object that represents items added during most recent
    update. */
    get added() {
      return this.#added;
    }

    /* Returns object that represents all changes from most recent
    update. */
    get change() {
      return this.#change;
    }

    /* Returns current. */
    get current() {
      return this.#current;
    }

    /* Returns object that represents current as-was before most recent 
    update. */
    get previous() {
      return this.#previous;
    }

    /* Returns array that represents keys removed in the most recent
    update. */
    get removed() {
      return this.#removed;
    }

    /* Updates current reactively. */
    update(updates, { sender, silent } = {}) {
      if (!updates) return this;
      if (Array.isArray(updates)) {
        /* Allow updates to be passed in as entries array */
        updates = Object.fromEntries(updates);
      } else if (updates.__type__ === "data") {
        /* Allow updates to be passed in Data instance */
        updates = updates.current;
      } else {
        updates = { ...updates };
      }
      /* Prevent update as per condition */
      if (this.condition && !this.condition.call(this, updates, { sender }))
        return this;
      /* Transform update as per transformer */
      if (this.transformer) {
        /* NOTE
        - transformer can work by mutation, but also by return value */
        updates = this.transformer.call(this, updates, { sender }) || updates;
      }
      /* Diagnose changes */
      const current = this.__dict__.current;
      const changed_entries = Object.entries(updates).filter(
        ([k, v]) => v !== current[k]
      );
      /* Abort, if no change */
      if (!changed_entries.length) {
        return this;
      }
      this.#change = Object.freeze(Object.fromEntries(changed_entries));
      this.#added = Object.freeze(
        Object.fromEntries(
          Object.entries(updates).filter(
            ([k, v]) => !(k in current) && v !== undefined
          )
        )
      );
      this.#removed = Object.freeze(
        Object.entries(updates)
          .filter(([k, v]) => k in current && v === undefined)
          .map(([k, v]) => k)
      );
      /* Changed/removed items as-were before update */
      const previous = Object.freeze(
        Object.fromEntries(
          Object.entries(updates)
            .filter(
              ([k, v]) =>
                k in this.#current && (v === undefined || v !== current[k])
            )
            .map(([k, v]) => [k, this.#current[k]])
        )
      );
      /* Update previous */
      this.#previous = Object.freeze({ ...current });
      /* Update current */
      Object.assign(current, this.#change);
      this.#removed.forEach((k) => delete current[k]);
      this.#current = Object.freeze({ ...current });
      /* Handle effects */
      let result;
      if (this.effects && !silent) {
        /* Call default-type effects */
        if (Object.keys(this.#change).length) {
          if (this.effects.size()) {
            result = this.effects.call(
              Object.freeze({
                added: this.#added,
                current: this.#change,
                previous,
                removed: this.#removed,
              }),
              "",
              { sender }
            );
          }
        }
        /* Call 'add'-type effects */
        if (this.effects.size("add") && Object.keys(this.#added).length) {
          result = this.effects.call(
            Object.freeze({
              added: this.#added,
            }),
            "add",
            { sender }
          );
        }
        /* Call 'remove'-type effects */
        if (this.effects.size("remove") && Object.keys(this.#removed).length) {
          result = this.effects.call(
            Object.freeze({
              removed: this.#removed,
            }),
            "remove",
            { sender }
          );
        }
      }
      return result === undefined ? this : result;
    }
  };
};
