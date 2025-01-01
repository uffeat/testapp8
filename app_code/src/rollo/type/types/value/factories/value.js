/* Implements reative features. */
export const value = (parent, config, ...factories) => {
  return class extends parent {
    static name = "value";

    /* Returns current value. */
    get current() {
      return this.#current;
    }
    /* Sets current value reactively. */
    set current(value) {
      /* Detect change */
      if (this.current && this.current.match) {
        if (this.current.match(value)) {
          return;
        }
      } else {
        if (value === this.current) {
          return;
        }
      }

      /* Update */
      this.#previous = this.#current;
      this.#current = value;
      /* Call effects */
      this.effects.call({ current: this.current, previous: this.previous });
    }
    #current;

    get previous() {
      return this.#previous;
    }
    #previous;

    /*
    NOTE
    - '$' is an alias for 'current', provided for a shorter syntax.
    */

    /* Returns current value. */
    get $() {
      return this.#current;
    }

    /* Sets current value reactively. */
    set $(current) {
      this.current = current;
    }

    
  };
};
