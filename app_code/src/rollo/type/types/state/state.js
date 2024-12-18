import { type } from "rollo/type/type";
import { hooks } from "rollo/type/factories/hooks";
import "rollo/type/types/data/data";
import { Effect as Argument } from "@/rollo/type/types/state/utils/_argument";
import { Effects } from "@/rollo/type/types/state/utils/_effects";

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
    #condition;

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
    #effects = new Effects(this);

    /* Returns owner. */
    get owner() {
      return this.#owner || this;
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
    get size() {}

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
    #transformer;

    /* . */
    clean() {}

    /* . */
    clear() {}

    /* . */
    filter(f) {}

    /* . */
    forEach(f) {}

    /* . */
    pop(key) {}

    /* . */
    reset(value) {}

    /* . */
    transform(f) {}

    /* Updates items from provided object. Chainable. */
    update(updates) {
      super.update && super.update(updates);
      if (!updates) return this;

      



      updates = type.create("data", updates);

     


      if (this.condition && !this.condition(updates)) return this;
      if (this.transformer) {
        updates = this.transformer(updates)
      }
      /* Infer changed items */
      const changes = type.create(
        "data",
        updates.filter(([k, v]) => this.#current[k] !== v)
      );
      /* Infer changed items as they were before change */
      const previous = type.create(
        "data",
        changes.entries.map(([k, v]) => [k, this.#current[k]])
      );


      
     




      /* Update storage */
      changes.forEach(([k, v]) => {
        this.#previous[k] = this.#current[k];
        /* NOTE undefined deletes. This is critical for other methods! */
        if (v === undefined) {
          delete this.#current[k];
        } else {
          this.#current[k] = v;
        }
      });
      /* Notify effects */
      if (changes.size) {
        this.effects.notify(
          Argument.create({ current: changes, previous, owner: this })
        );
      }
      return this;
    }
  };
  return cls;
};

type.author(
  "state", 
  Object, 
  {}, 
  ////hooks, 
  factory
).assign(
  class {
    /* Returns clone with shallow copy of current data and everything else reset. */
    clone() {
      return type.create("state", { ...this.current });
    }
  }
);
