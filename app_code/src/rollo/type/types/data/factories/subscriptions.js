import { Subscriptions } from "rollo/type/types/data/tools/subscriptions";

/* Implements subscriptions. */
export const subscriptions = (parent, config, ...factories) => {
  return class subscriptions extends parent {
    /* Returns subscriptions controller. */
    get subscriptions() {
      return this.#subscriptions;
    }
    #subscriptions = Subscriptions.create(this);

    /* Short-hand for 'subscriptions.add'. Chainable */
    subscribe(publisher, source, condition) {
      this.subscriptions.add(publisher, source, condition)
      return this

    }

    /* Short-hand for 'subscriptions.remove'. Chainable */
    usubscribe(publisher) {
      this.subscriptions.remove(publisher)
      return this
      
    }
  };
};

