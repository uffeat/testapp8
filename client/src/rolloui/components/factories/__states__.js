/* 

*/

/* TODO
- Learn and use the new AWESOME CustomStateSet/:state features! */

import { Reactive } from "@/rollo/reactive/value.js";

export const __states__ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "__states__";

    #__states__;

    __new__() {
      super.__new__?.();
      this.#__states__ = new (class States {
        #owner;
        constructor(owner) {
          this.#owner = owner;
        }
        /* Returns owner component. */
        get owner() {
          return this.#owner;
        }
        /* Adds reactive (value-based) state by name. Registers effect that syncs 
        value to owner attr. Returns reactive state. */
        add(name, value = null) {
          if (name in this) {
            throw new Error(`Invalid name: ${name}.`);
          }
          const state = Reactive(
            value,
            { name, owner: this.owner },
            /* Sync state to component attr */
            ({ current }) => {
              this.owner.attribute[name] = current;
            }
          );
          /* Add state as prop */
          Object.defineProperty(this, name, {
            configurable: true,
            enumerable: false,
            get: () => state,
          });
          return state;
        }
        /* Freezes self. Chainable. */
        freeze() {
          Object.freeze(this);
          return this;
        }
      })(this);
    }

    

    /* Returns object with reactive states. */
    get __states__() {
      return this.#__states__;
    }
  };
};
