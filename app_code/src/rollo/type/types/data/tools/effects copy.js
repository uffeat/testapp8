import { type } from "@/rollo/type/type/type";
import { Callable } from "rollo/type/types/callable/callable";

/* Effects controller. */
export class Effects {
  static create = (...args) => new Effects(...args);

  constructor({owner, get_current, transformer}) {
    this.#owner = owner;
    this.#get_current = get_current;
    this.#transformer = transformer
  }

  /* Returns get_current */
  get get_current() {
    return this.#get_current;
  }
  #get_current;

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

  /* Returns transformer. */
  get transformer() {
    return this.#transformer;
  }
  #transformer;

  /* Returns and registers effect. */
  add(source, condition, tag) {
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    if (condition && typeof condition !== "function") {
      condition = interpret(condition);
    }
    /* Create effect */
    let effect
    if ((source instanceof Callable)) {
      effect = source
    } else {
      effect = Callable.create({ source, condition, tag });
    }

    if (this.transformer) {
      effect.transformer = this.transformer(effect)
    }


    effect.transformer = (argument) =>
      Change.create({
        effect,
        ...argument,
      });
    
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */
    effect.call(null, {


      current: this.get_current ? this.get_current() : null,


      index: null,
      previous: null,
      publisher: this.owner,
      session: null,
    });
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
    ++this.#session;
    for (const [index, effect] of [...this.registry].entries()) {
      const result = effect.call(null,{
        current,
        index,
        previous,
        publisher: this.owner,
        session: this.#session,
      });
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

/* Argument for effect sources and effect conditions. */
class Change {
  static create = (...args) => new Change(...args);

  constructor({ current, effect, index, previous, publisher, session }) {
    this.#effect = effect;
    this.#index = index;

    this.#current = current;
    this.#previous = previous;

    this.#publisher = publisher;
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

  /* Returns publisher. */
  get publisher() {
    return this.#publisher;
  }
  #publisher;

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
function interpret(condition) {
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
