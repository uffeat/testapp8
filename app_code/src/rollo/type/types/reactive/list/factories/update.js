import { Change } from "@/rollo/type/types/reactive/tools/change";

export const update = (parent, config, ...factories) => {
  return class extends parent {
    static name = "update";

    #added = Object.freeze([]);
    #current = Object.freeze([]);
    #previous = Object.freeze([]);
    #removed = Object.freeze([]);

    /* Returns array that represents values added in the most recent
    update. */
    get added() {
      return this.#added;
    }

    /* Returns array representation of values. */
    get current() {
      return this.#current;
    }

    /* Returns array representation of values as-were before most recent 
    change. */
    get previous() {
      return this.#previous;
    }

    /* Returns array that represents values removed in the most recent
    update. */
    get removed() {
      return this.#removed;
    }

    /* Add values to current reactively. Chainable. */
    add(...values) {
      this.update({ add: values });
      return this;
    }

    /* Removes values to current reactively. Chainable. */
    remove(...values) {
      this.update({ remove: values });
      return this;
    }

    /* Updates current reactively. Chainable. */
    update({ add, remove, sender, silent } = {}) {
      if (add === undefined && remove === undefined) {
        return this;
      }
      /* Check and interpret args
      NOTE
      - Ensure that add and remove are arrays
      */
      if (add === undefined) {
        add = [];
      } else if (Array.isArray(add)) {
        /* Guard against external mutation */
        add = [...add];
      } else if (add.__type__ === "list") {
        add = add.current;
      } else {
        throw new TypeError(`Invalid 'add': ${String(add)}`);
      }
      if (remove === undefined) {
        remove = [];
      } else if (Array.isArray(remove)) {
        /* Guard against external mutation */
        remove = [...remove];
      } else if (remove.__type__ === "list") {
        remove = remove.current;
      } else {
        throw new TypeError(`Invalid 'remove': ${String(remove)}`);
      }

      /* Filter as per condition */
      if (
        this.condition &&
        !this.condition.call(
          this,
          /* Guard against external mutation */
          { add: [...add], remove: [...remove] },
          { sender }
        )
      ) {
        return this;
      }
      /* Transform as per transformer */
      if (this.transformer) {
        const result = this.transformer.call(this, { add, remove }, { sender });
        if (result) {
          add = result.add || add;
          remove = result.remove || remove;
        }
      }
      /* Diagnose changes */
      const dict = this.__dict__;
      const added = new Set(add).difference(dict.current); //
      const removed = dict.current.intersection(new Set(remove)); //
      if (added.size || removed.size) {
        this.#previous = Object.freeze([...dict.current]); //
        this.#added = Object.freeze([...added]);
        this.#removed = Object.freeze([...removed]);
        if (added.size) {
          dict.current = dict.current.union(added); //
        }
        if (removed.size) {
          dict.current = dict.current.difference(removed); //
        }
        this.#current = Object.freeze([...dict.current]); //
        /* Handle effects */
        let result;
        if (this.effects && !silent) {
          const data = {
            added: Object.freeze([...added]),
            removed: Object.freeze([...removed]),
          };
          /* Call default-type effects */
          if (this.effects.size()) {
            result = this.effects.call(
              Object.freeze({
                added: data.added,
                removed: data.removed,
              }),
              "",
              { sender }
            );
          }
          /* Call add-type effects */
          if (this.effects.size("add")) {
            result = this.effects.call(
              Object.freeze({
                added: data.added,
              }),
              "add",
              { sender }
            );
          }
          /* Call remove-type effects */
          if (this.effects.size("remove")) {
            result = this.effects.call(
              Object.freeze({
                removed: data.removed,
              }),
              "remove",
              { sender }
            );
          }
        }
        return result === undefined ? this : result;
      }
      return this;
    }
  };
};
