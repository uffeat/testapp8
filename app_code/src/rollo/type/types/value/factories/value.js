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
      if (this.#current === current) {
        return;
      }
      this.#previous = this.#current;
      this.#current = current;
      /* Call effects */
      if (this.effects.size) {
        this.effects.call({ current: this.current, previous: this.previous });
      }
    }
    #current;
    

    get previous() {
      return this.#previous
    }
    #previous

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

    /* . */
    update(current) {
      this.current = current;
      return this;
    }
  };
};
