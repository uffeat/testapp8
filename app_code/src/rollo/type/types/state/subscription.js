import { type } from "rollo/type/type";
import { state } from "rollo/type/types/state/factories/state";

/* . */
class Subscription {
  constructor({ condition, reducer, state, transformer } = {}) {
    if (!state) {
      throw new Error(`'state' not provided.`);
    }
    if (!reducer) {
      throw new Error(`'reducer' not provided.`);
    }
    this.#condition = condition;
    this.#reducer = reducer;
    this.#state = state;
    this.#transformer = transformer;
  }

  /* Returns condition. */
  get condition() {
    return this.#condition;
  }
  #condition;

  /* Returns reducer. */
  get reducer() {
    return this.#reducer;
  }
  #reducer;

  /* Returns publishing state. */
  get state() {
    return this.#state;
  }
  #state;

  /* Returns transformer. */
  get transformer() {
    return this.#transformer;
  }
  #transformer;
}

type.author("subscription", Subscription);
