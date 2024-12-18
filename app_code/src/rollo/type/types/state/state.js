import { type } from "rollo/type/type";
import { hooks } from "rollo/type/factories/hooks";
import "rollo/type/types/data/data";
import { Handler } from "rollo/type/types/state/utils/handler";
import { Effect } from "rollo/type/types/state/utils/effect";
import { Effects } from "rollo/type/types/state/utils/effects";


/* Factory for reative state. */
export const factory = (parent, config, ...factories) => {
  const cls = class Type extends parent {
    constructor() {
      super();
    }

    /* Provives API for getting/setting single state items. */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, k) => {
        return target.#current[k];
      },
      set: (target, k, v) => {
        target.update({ [k]: v });
        return true;
      },
    });

    /* Returns condition. */
    get condition() {
      return this.#condition;
    }
    /* Sets condition. */
    set condition(condition) {
      if (this.#condition) {
        throw new Error(`'condition' cannot be changed.`);
      }
      this.#condition = condition;
    }
    #condition

    /* Returns current state data.
    NOTE 
    - Mutations escape effects and should generally be avoided. */
    get current() {
      return this.#current;
    }
    #current = type.create("data");

    /* Returns controller for managing effects. */
    get effects() {
      return this.#effects;
    }
    #effects = new Effects(this)

    /* Returns owner. */
    get owner() {
      return this.#owner;
    }
    /* Sets owner. */
    set owner(owner) {
      if (this.#owner) {
        throw new Error(`'owner' cannot be changed.`);
      }
      this.#owner = owner;
    }
    #owner;

    /* Returns state data as-was before most recent change.
    NOTE 
    - Can, but should generally not, be mutated. */
    get previous() {
      return this.#previous;
    }
    #previous = type.create("data");

    /* . */
    get size() {
    
    }

    /* Returns transformer. */
    get transformer() {
      return this.#transformer;
    }
    /* Sets transformer. */
    set transformer(transformer) {
      if (this.#transformer) {
        throw new Error(`'transformer' cannot be changed.`);
      }
      this.#transformer = transformer;
    }
    #transformer

    /* . */
    clean() {
      
    }

    /* . */
    clear() {
      
    }

    /* . */
    filter(f) {
      
    }

    /* . */
    forEach(f) {
      
    }

    /* . */
    pop(key) {
    
    }
    

   

    /* . */
    reset(value) {}

    /* . */
    transform(f) {}

    /* Updates items from provided object. Chainable. */
    update(updates) {
      super.update && super.update(updates);
      if (updates) {
        /* Allow updates as entries array */
        if (Array.isArray(updates)) {
          updates = Object.fromEntries(updates);
        }
        for (const [k, v] of Object.entries(updates)) {
          this[k] = v;
        }
      }
      return this;




      
    }
  };
  return cls;
};

type.author("state", Object, {}, hooks, factory).assign(
  class {
    /* Returns shallow clone. */
    clone() {
      /* TODO
      - Refactor
      */
      return type.create("state", { ...this });
    }
  }
);
