import { Effects } from "rollo/type/types/data/tools/effects";

/* Implements 'value' getter/setter. */
export const value = (parent, config, ...factories) => {
  return class value extends parent {
    /* Returns current value. 
    NOTE
    - Alias for compatibility with Effects and Effect
    */
    get data() {
      return this.current;
    }

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

    /* Set current value. Chainable. 
    NOTE
    - Syntactical alternative to current setter.
    - Also provided for alignment with other types.
    */
    update(current) {
      this.current = current;
      return this;
    }
  };
};
