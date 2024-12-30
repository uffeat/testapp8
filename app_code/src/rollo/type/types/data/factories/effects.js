import { type } from "@/rollo/type/type/type";

/* Implements 'effects' getter. */
export const effects = (parent, config, ...factories) => {
  return class extends parent {
    static name = "effects";
    /* Returns effects controller. */
    get effects() {
      return this.#effects;
    }
    #effects = Effects.create(this);
  };
};

class Effect {
  static create = (...args) => new Effect(...args);
  constructor({ condition, owner, source }) {
    this.#condition = condition;
    this.#owner = owner;
    this.#source = source;
  }

  /* Returns condition */
  get condition() {
    return this.#condition;
  }
  #condition;

  /* Returns disabled state. */
  get disabled() {
    return this.#disabled;
  }
  /* Sets disabled state.
  NOTE
  - Turns the effect on/off (regardless of condition).
  */
  set disabled(disabled) {
    this.#disabled = disabled;
  }
  #disabled;

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns source. */
  get source() {
    return this.#source;
  }
  #source;

  /* Calls source and return result. */
  call(change) {
    /* Check disabled */
    if (this.disabled) {
      return;
    }
    /* Check source */
    if (!this.source) {
      return;
    }

    /* Check condition */
    if (this.condition) {
      if (!this.condition(change)) {
        return;
      }
    }
    /* Call source and return result */
    return this.source.call(this, change);
  }
}

/* Effects controller. */
class Effects {
  static create = (...args) => new Effects(...args);

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns max number of effects allowed. */
  get max() {
    return this.#max;
  }
  /* Sets max number of effects allowed.
  NOTE
  - null/undefined removes limit.
  - Primarily used to catch memory leaks, e.g., when effects are to be added and 
    removed frequently, but fails to be removed. The default max of 10 is a judgement 
    call - based on the assumption that a data object with more than 10 concurrent
    effects can be difficult to manage and should perhaps be broken up into smaller
    "state islands".
  */
  set max(max) {
    this.#max = max;
  }
  #max = 10;

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns effects registry.
  NOTE
  - Can, but should generally not, be changed outside the Effects class. 
  */
  get registry() {
    return this.#registry;
  }
  #registry = new Set();

  /* Returns number of effects registered. */
  get size() {
    return this.registry.size;
  }

  /* Returns and registers effect. */
  add(source, condition) {
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    condition = interpret_condition(condition);
    /* Create effect */
    const effect = Effect.create({ condition, owner: this.owner, source });
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */
    const change = Change.create({
      current: this.owner.data,
      effect,
      index: null,
      owner: this.owner,
      previous: null,
      session: null,
    });
    effect.call(change);
    /* Return effect, e.g., for control and later removal */
    return effect;
  }

  /* Calls registered effects.
  NOTE
  - Can, but should generally not, be called externally. 
  - 'effect.call' should generally not return anything explicitly. However,
    for special cases, if 'effect.call' returns false, subsequent effects in
    the session are not called; similar to `event.stopPropagation()`.
  */
  call({ current, previous }) {
    const session = ++this.#session;
    for (const [index, effect] of [...this.registry].entries()) {
      const change = Change.create({
        current,
        effect,
        index,
        owner: this.owner,
        previous,
        session,
      });

      const result = effect.call(change);
      if (result === false) {
        break;
      }
    }
  }

  /* Tests, if effect is registered. */
  has(effect) {
    return this.registry.has(effect);
  }

  /* Deregisters effect. */
  remove(effect) {
    this.registry.delete(effect);
  }

  #session = 0;
}

/* Argument for effect. */
class Change {
  static create = (...args) => new Change(...args);

  constructor({ current, effect, index, owner, previous, session }) {
    this.#effect = effect;
    this.#index = index;

    this.#current = current;
    this.#previous = previous;

    this.#owner = owner;
    this.#session = session;
    this.#time = Date.now();
  }

  /* Returns current data. */
  get current() {
    return this.#current;
  }
  #current;

  /* Returns effect.
  NOTE
  - Provides easy access to the effect itself from inside the effect 
    source/condition.
  */
  get effect() {
    return this.#effect;
  }
  #effect;

  /* Returns effect index for the current session. */
  get index() {
    return this.#index;
  }
  #index;

  /* Returns previous data. */
  get previous() {
    return this.#previous;
  }
  #previous;

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns session id. */
  get session() {
    return this.#session;
  }
  #session;

  /* Returns timestamp. */
  get time() {
    return this.#time;
  }
  #time;
}

/* Creates and returns condition function from short-hand. */
function interpret_condition(condition) {
  if (!condition || typeof condition === "function") {
    return condition;
  }

  if (typeof condition === "string") {
    /* Create condition function from string short-hand:
    current must contain a key corresponding to the string short-hand. */
    return ({ current }) => condition in current;
  }

  if (Array.isArray(condition)) {
    /* Create condition function from array short-hand:
    current must contain a key that is present in the array short-hand. */
    return ({ current }) => {
      for (const key of condition) {
        if (key in current) return true;
      }
      return false;
    };
  }

  if (typeof condition === "object" && Object.keys(condition).length === 1) {
    /* Create condition function from single-item object short-hand:
    current must contain a key-value pair corresponding to the object short-hand. */
    return ({ current }) =>
      type.create("data", { ...current }).includes(condition);
  }

  throw new Error(`Invalid condition: ${condition}`);
}
