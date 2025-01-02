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

/* Computed controller */
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

  /* TODO
  - ComputedRegistry and Computed
  - size limit
  - Perhaps named
  - More flexible condition, rather than ...dependencies
  */

  /* Creates Value instance, creates effect to update the Value instance from 
  reducer, and returns effect controller of the Value instance. 
  NOTE
  - The idea is to create a reactive value that
    - is updated as per reducer and dependencies
    - is not directly settable, but from which
      effects can be set up.
    As such the computed' concept is a "higher-order" effect.
  - It's the reducer's resposibility to return a meaningful result, given any
    dependencies (condition keys).
  - Since the condition for the effect set up, can only be specified as 
    required keys, these should be provided as trailing args, and NOT as an 
    array (as is the case for effects).
  - If a condition beyond required keys is needed, this should be handled in 
    the reducer.
  - 'add' only accept a single reducer, but the reducer can itelf be composed,
    e.g., with the 'pipe' tool.
  */
  add(reducer, ...dependencies) {
    /* Create reactive value */
    const value = Value();
    /* Set up effect that updates reactive value with reducer result */
    const effect = this.owner.effects.add(
      (change) => {
        /* Create 'current' with data relevant to reducer */
        let current
        if (dependencies.length) {
          /* Dependencies specified -> ensure that 'current' only contains keys as per dependencies */
          current = Object.fromEntries(
            Object.entries(this.owner.current).filter(([k, v]) => dependencies.includes(k))
          );
        } else {
          current = this.owner.current
        }
        /* Update
        NOTE
        - Also pass 'change' into reducer; typically, NOT used by the reducer,
          but can be in special cases.
        */
        value.current = reducer(current, change);
      },
      dependencies.length ? dependencies : null
    );
    /* Register computed (effects) */
    this.registry.set(value.effects, { effect, value });
    /* Returns effects controller, so that effects can be set up to watch the 
    computed value */
    return value.effects;
  }

  /* Returns {effect, value} object; undefined, if not registered.
  NOTE
  - Typically, no need to use 'get', but can be used for inspection or special 
    cases, where effect and/or value needs to be changed.
  */
  get(effects) {
    return this.registry.get(effects);
  }

  /* Checks, if effects registered. */
  has(effects) {
    return this.registry.has(effects);
  }

  /* Deregisters effect to update Value instance, deregisters computed value 
  (effects), and returns the Value instance. By default, effects on the Value 
  instance are cleared, but this can be avoided with the 'clear' flag. */
  remove(effects, clear = true) {
    if (!this.has(effects)) {
      return;
    }
    const { effect, value } = this.registry.get(effects);
    this.owner.effects.remove(effect);
    this.registry.delete(effects);
    if (clear) {
      value.effects.clear()
    }
    return value;
  }
}
