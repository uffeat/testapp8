import { Value } from "rollo/type/types/value/value";

/* Implements computed controller. */
export const computed = (parent, config, ...factories) => {
  return class extends parent {
    static name = "computed";

    /* Returns computed controller. */
    get computed() {
      return this.#computed;
    }
    #computed = new Computed(this);
  };
};

class Computed {
  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns computed registry.
  NOTE
  - Can, but should generally not, be used externally. 
  - Stores effects-{effect, value} pairs.
  */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of computed values. */
  get size() {
    return this.registry.size;
  }

  /* */
  add(reducer, ...dependencies) {
    const value = Value();
    const effect = this.owner.effects.add(
      (change) => {
        let current;
        if (dependencies.length) {
          current = Object.fromEntries(
            Object.keys(change.current).filter((k) => dependencies.includes(k))
          );
        } else {
          current = change.current;
        }
        /* Update */
        value.current = reducer(current, change);
      }
      //dependencies.length ? dependencies : null
    );

    const effects = value.effects;

    this.registry.set(effects, { effect, value });
    return effects;
  }

  /* */
  get(effects) {
    return this.registry.get(effects);
  }

  /* */
  has(effects) {
    return this.registry.has(effects);
  }

  /* */
  remove(effects) {
    if (!this.has(effects)) {
      return;
    }
    const { effect, value } = this.registry.get(effects);
    this.owner.effects.remove(effect);
    this.registry.delete(effects);
    //value.effects.clear()
    return value;
  }
}
