import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements reative features. */
export const value = (parent, config, ...factories) => {
  return class value extends parent {
    

    /* Returns current value. */
    get current() {
      return this.#current;
    }
    /* Sets current. */
    set current(current) {
      /* Abort as per condition */
      if (this.condition && !this.condition(current)) {
        return;
      }
      /* Transform  as per transformer */
      if (this.transformer) {
        current = this.transformer(current);
      }
      /* By convention, current can never be undefined */
      if (current === undefined) {
        return;
      }
      /* Abort, if no change */
      if (current.match) {
        if (current.match(this.#current)) {
          return;
        }
      } else {
        if (this.#current === current) {
          return;
        }
      }
      /* Update */
      this.#previous = this.#current;
      this.#current = current;
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ current: this.current, previous: this.previous });
      }
    }
    #current = null;

    /* Returns previous value */
    get previous() {
      return this.#previous;
    }
    #previous;

    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = Effects.create(this);

    /* Returns type. */
    get type() {
      return this.#type;
    }
    #type = typeof this.current;

    /* Updates properties. Chainable. 
    NOTE
    - By convention, undefined value is a cue to delete.
    */
    update(update) {
      if (!update) return this;
      for (const [k, v] of Object.entries(update)) {
        if (v === undefined) {
          delete this[k];
        } else {
          this[k] = v;
        }
      }

      return this;
    }
  };
};
