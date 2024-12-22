import { type } from "rollo/type/type";
import "rollo/type/types/data/data";
import { Message } from "rollo/type/types/state/tools/_message";
import { Effects } from "rollo/type/types/state/tools/_effects";

/* Factory for reative state. */
export const state = (parent, config, ...factories) => {
  const cls = class state extends parent {
    static PREFIX = "$";


    created_callback() {
      super.created_callback && super.created_callback();
      
      /* Set up automatic property update from prefixed state */
      this.effects.add((data) => {
        const update = data.current
          .clone()
          /* NOTE Operate on clone to avoid mutation of data.current */
          .filter(
            ([k, v]) => typeof k === "string" && k.startsWith(state.PREFIX)
          )
          .forEach(([k, v]) => (this[k.slice(state.PREFIX.length)] = v));
        this.update(update)
      });

      
    }

    /* Provives API for getting/setting single state items. */
    get $() {
      return this.#$;
    }
    #$ = new Proxy(this, {
      get: (target, key) => {
        if (key in target) {
          throw new Error(`Reserved key: ${key}`);
        }
        return target.#current[key];
      },
      set: (target, key, value) => {
        if (key in target) {
          throw new Error(`Reserved key: ${key}`);
        }
        if (value && value.__type__ === "subscription") {
          value.state.effects.add(
            (data) => {
              target.update({ [key]: value.reducer(data) });
            },
            value.condition,
            value.transformer
          );
        } else {
          target.update({ [key]: value });
        }
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

    /* Returns name. */
    get name() {
      return this.#name;
    }
    /* Sets name. */
    set name(name) {
      if (this.#name) {
        throw new Error(`'name' cannot be changed.`);
      }
      this.#name = name;
    }
    #name;

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

    /* Updates state and properties from provided object. Chainable. */
    update(update) {
      super.update && super.update(update);
      if (!update) return this;

      update = type.create("data", update);

      /* Handle update of non-state items, 
      NOTE
      - If, e.g., a 'name' item is in 'update', the name property updates, 
        but NOT a 'name' state item. However, '$name' updates the 'name' property,
        AND a '$name' state. */
      type
        .create("data", update)
        .filter(([k, v]) => k in this)
        .forEach(([k, v]) => (this[k] = v));
      /* Filter as per condition */
      if (this.condition && !this.condition(update)) return this;
      /* Transform as per transformer */
      if (this.transformer) {
        update = this.transformer(update);
        /* Ensure that transformed update is a Data instance */
        if (update.__type__ !== "data") {
          update = type.create("data", update);
        }
      }
      /* Infer changed items */
      const current = type.create(
        "data",
        update.filter(([k, v]) => !(k in this) && this.#current[k] !== v)
      );
      /* Infer changed items as they were before change */
      const previous = type.create(
        "data",
        current.entries.map(([k, v]) => [k, this.#current[k]])
      );
      /* Update storage */
      current.forEach(([k, v]) => {
        this.#previous[k] = this.#current[k];
        /* NOTE undefined deletes. This is critical for other methods! */
        if (v === undefined) {
          delete this.#current[k];
        } else {
          this.#current[k] = v;
        }
      });
      /* Notify effects */
      if (current.size) {
        this.effects.notify(Message.create({ current, previous, owner: this }));
      }
      return this;
    }
  };
  return cls;
};
