import { Effect } from "rollo/type/types/data/tools/effect";

/* Implements subscriptions. */
export const subscriptions = (parent, config, ...factories) => {
  return class subscriptions extends parent {
    /* . */
    get subscriptions() {
      return this.#subscriptions;
    }
    #subscriptions = Subscriptions.create(this);
  };
};

class Subscriptions {
  static create = (...args) => new Subscriptions(...args);

  constructor(owner) {
    this.#owner = owner;
  }

  /* Returns owner */
  get owner() {
    return this.#owner;
  }
  #owner;

  /* Returns subscription registry.
  NOTE
  - Can, but should generally not, be changed outside the Effects class. 
  */
  get registry() {
    return this.#registry;
  }
  #registry = new Map();

  /* Returns number of subscriptions. */
  get size() {
    return this.registry.size;
  }

  /* Add subscription. */
  add(publisher, reducer, condition) {
    const effect = Effect.create((change) => {
      this.owner.current = reducer(change);
    }, condition);

    this.registry.set(publisher, effect);
    effect.register(publisher);
    

    return publisher;
  }

  /* Tests, if subscribes. */
  has(publisher) {
    return this.registry.has(publisher);
  }

  /* Deregisters effect. */
  remove(publisher) {
    const effect = this.registry.get(publisher);
    if (effect) {
      effect.deregister(publisher);
    }

    this.registry.delete(publisher);
  }
}
