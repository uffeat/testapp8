import { Value } from "rollo/type/types/value/value";

/* Implements computed controller. */
export const computed = (parent, config, ...factories) => {
  return class extends parent {
    static name = "computed";

    /* Returns computed controller. */
    get computed() {
      return this.#computed;
    }
    #computed = new Registry(this);
  };
};

/* */
class Computed {
  constructor({ condition, name, owner, reducer }) {
    this.#condition = condition
    this.#name = name;
    this.#owner = owner;
    this.reducer = reducer
    this.#value = Value();
  }
  #value;

  /* Returns condition */
  get condition() {
    return this.#condition;
  }
  #condition
  /* NOTE 'condition' is read-only. */

  /* Returns current value. */
  get current() {
    return this.#value.current;
  }
  /* Sets current value.
  NOTE
  - 
  */
  set current(current) {
    this.#value.current = current;
  }

  /* Returns effects controller. */
  get effects() {
    return this.#value.effects;
  }

  /* Returns name. */
  get name() {
    return this.#name;
  }
  #name;
  /* NOTE 'name' is read-only. */

  /* Returns owner Data instance */
  get owner() {
    return this.#owner;
  }
  #owner;
  /* NOTE 'owner' is read-only. */


  /* Returns previous value. */
  get previous() {
    return this.#value.previous;
  }




  /* Returns reducer. */
  get reducer() {
    return this.#reducer;
  }
  /* Sets reducer.
  NOTE
  - 
  */
  set reducer(reducer) {
    this.#reducer = reducer;
  }
  #reducer



}

/* Computed controller */
class Registry {
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
  #registry = {};

  /* Returns number of computed values. */
  get size() {
    return this.registry.size;
  }

  /* TODO
  - ComputedRegistry and Computed
  - size limit
  - Add as prop. Ensure exception in update
  */

  /* .
   */
  add(name, reducer, condition) {
    /* TODO
    - check name
    */

    

    /* Create reactive value */
    const computed = new Computed({
      condition,
      name,
      owner: this.owner,
      reducer,
    });
    /* Set up effect that updates reactive value with reducer result */
    const effect = this.owner.effects.add((change) => {
      const result = computed.reducer.call(computed, change);
      if (result !== undefined) {
        computed.current = result;
      }
    }, condition);
    /* Register computed */
    this.registry[name] = Object.freeze({computed, effect})
    /* Return computed, so that effects can be set up to watch the 
    computed value */
    return computed
  }

  /* Returns ... */
  get(name) {
    return this.registry.get(name);
  }

  /* Checks, if registered. */
  has(name) {
    return name in this.registry;
  }

  /* . */
  remove(name) {
    if (!this.has(name)) return;
    
    const { effect, value } = this.registry.get(name);

    this.owner.effects.remove(effect);
    delete this.registry(name);
    value.effects.clear();

   
    return value;
  }
}
