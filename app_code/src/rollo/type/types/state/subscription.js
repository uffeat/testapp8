import { type } from "rollo/type/type";

/* Utility for binding a state item to another state. 
NOTE
- The responsibilities of a Subscription instances are to:
  - Identify itself to a subscribing state, when assigning a state item a
    Subscription instance.
  - Convey information that enables the subscribing state to 
    set up an effect in the publishing state, so that an item in the 
    subscribing state is automatically updated, when the publishing state
    changes, subject to any condition. 
  - Subscriptions can therefore be used as direct and more declarative way
    of setting up inter-state effects, i.e., by assignment instead of 
    explicit function-setup. */
class Subscription {
  static create = (...args) => {
    return new Subscription(...args);
  };

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

type.register("subscription", Subscription);
