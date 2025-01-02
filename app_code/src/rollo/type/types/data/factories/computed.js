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

/* Controller for reactive computed values. */
class Computed {
  #value = Value();
  constructor({ condition, name, owner, reducer, transformer }) {
    this.#name = name;
    this.#owner = owner;
    this.update({ condition, reducer, transformer });
  }

  /* Returns condition */
  get condition() {
    return this.#value.condition;
  }
  /* Sets condition. */
  set condition(condition) {
    this.#value.condition = condition;
  }

  /* Returns current value. */
  get current() {
    return this.#value.current;
  }
  /* Sets current value.
  NOTE
  - Can, but should generally not, be used externally. 
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

  /* Returns owner Data instance */
  get owner() {
    return this.#owner;
  }
  #owner;

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
  - Can be changed dynamically. Powerful, but can add complexity!
  */
  set reducer(reducer) {
    this.#reducer = reducer;
  }
  #reducer;

  /* Returns transformer. */
  get transformer() {
    return this.#value.transformer;
  }
  /* Sets transformer. */
  set transformer(transformer) {
    this.#value.transformer = transformer;
  }

  /* Batch-updates data- and accessor props. Chainable. */
  update(update) {
    for (const [k, v] of Object.entries(update)) {
      this[k] = v;
    }
    return this;
  }
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

  /* Returns registry.
  NOTE
  - Can, but should generally not, be used externally. 
  - Stores name-{computed, effect} pairs.
  */
  get registry() {
    return this.#registry;
  }
  #registry = {};

  /* Returns number of computed values. */
  get size() {
    return Object.keys(this.registry).length;
  }

  /* Creates, registers and returns computed value object. */
  add(name, reducer, { condition, transformer } = {}) {
    /* Check name */
    if (name in this.registry) {
      throw new Error(`'${name}' already registered.`)
    }
    /* Create computed value object */
    const computed = new Computed({
      condition,
      name,
      owner: this.owner,
      reducer,
      transformer,
    });
    /* Set up effect that updates value object with reducer result */
    const effect = this.owner.effects.add((change) => {
      /* NOTE
      - Reducer is called bound to 'computed'; the function can therefore have 
      full access to the value as well as the data object. */
      const result = computed.reducer.call(computed, change);
      /* Ignore undefined results */
      if (result !== undefined) {
        computed.current = result;
      }
    });
    /* Register */
    this.registry[name] = Object.freeze({ computed, effect });
    /* Add to owner as read-only non-enumerable prop */
    Object.defineProperty(this.owner, name, {
      configurable: true,
      enumerable: false,
      get: () => computed.current,
    });
    /* Return computed, so that effects can be set up to watch the 
    computed value */
    return computed;
  }

  /* Returns registered 'computed' object */
  get(name) {
    return this.registry.get(name);
  }

  /* Checks, if registered. */
  has(name) {
    return name in this.registry;
  }

  /* Degisters computed value object and clears all it's effects. */
  remove(name) {
    if (!this.has(name)) return;
    const { effect, value } = this.registry.get(name);
    this.owner.effects.remove(effect);
    delete this.registry(name);
    value.effects.clear();
    delete this.owner[name];

   
  }
}
