import { Effect } from "rollo/type/types/data/tools/effect";

/* Composition class for Data. */
export class Effects {
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
  add(effect, condition, tag) {
    if (![null, undefined].includes(this.max) && this.size >= this.max) {
      throw new Error(`Cannot register more than ${this.max} effects.`);
    }
    /* Create effect */
    if (!(effect instanceof Effect)) {
      effect = Effect.create(effect, condition, tag);
    }
    /* Register effect */
    this.registry.add(effect);
    /* Call effect */

    effect.call({
      current: this.owner[this.owner.__class__.reactive],
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
  */
  call({ current, previous }) {
    ++this.#session;
    for (const [index, effect] of [...this.registry].entries()) {
      const result = effect.call({
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
