import { Callable } from "rollo/type/types/callable/callable";

/* Effects controller. */
export class Effects {
  static create = (...args) => new Effects(...args);

  constructor({ current, interpret_condition, owner, create_argument }) {
    this.#owner = owner;
    this.#interpret_condition = interpret_condition;
    this.#create_argument = create_argument;
  }

  /* Returns create_argument function.
  NOTE
  - 
  */
  get create_argument() {
    return this.#create_argument;
  }
  #create_argument;

  /* Returns interpret_condition function.
  NOTE
  - 
  */
  get interpret_condition() {
    return this.#interpret_condition;
  }
  #interpret_condition;

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
  add(source, condition, tag) {
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    if (this.interpret_condition) {
      condition = this.interpret_condition(condition);
    }
    /* Create effect */
    let effect;
    if (source instanceof Callable) {
      effect = source;
    } else {
      effect = Callable.create({ source, condition, tag });
    }
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */
    const argument = { effect, publisher: this.owner };
    effect.call(
      null,
      this.create_argument ? this.create_argument(argument) : argument
    );
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
  call(change) {
    ++this.#session;
    for (const [index, effect] of [...this.registry].entries()) {
      const argument = {
        change,
        effect,
        index,
        publisher: this.owner,
        session: this.#session,
      };
      const result = effect.call(
        null,
        this.create_argument ? this.create_argument(argument) : argument
      );
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
