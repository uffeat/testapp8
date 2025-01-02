/* Implements reative features. */
export const value = (parent, config, ...factories) => {
  return class extends parent {
    static name = "value";

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

    /* Returns current value. */
    get current() {
      return this.#current;
    }
    /* Sets current value reactively. */
    set current(value) {
      /* Filter as per condition */
      if (this.condition && this.condition(value) === false) {
        return;
      }
      /* Transform as per transformer */
      if (this.transformer) {
        const result = this.transformer(value);
        if (result !== undefined) {
          value = result;
        }
      }
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

    
  };
};
