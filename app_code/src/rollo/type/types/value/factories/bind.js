import { Effect } from "rollo/type/types/data/tools/effect";

/* Implements features for binding value reactively to a single 
multi-value reactive object. */
export const bind = (parent, config, ...factories) => {
  return class bind extends parent {
    /* Returns effect. */
    get effect() {
      return this.#effect;
    }
    #effect;

    /* Returns subscription. */
    get subscription() {
      return this.#subscription;
    }
    /* Sets subscription. */
    set subscription(subscription) {
      if (subscription) {
        if (this.subscription !== subscription) {
          this.bind(subscription);
        }
      } else {
        this.unbind();
      }
    }
    #subscription;

    /* Returns reducer. */
    get reducer() {
      return this.#reducer;
    }
    /* Sets reducer. */
    set reducer(reducer) {
      this.#reducer = reducer;
    }
    #reducer;

    /* Creates and registers effect on reactive subscription. */
    bind(subscription, reducer, condition) {
      /* Cancel any existing subscription */
      if (this.subscription && this.subscription !== subscription) {
        this.unbind();
      }
      this.#subscription = subscription;
      /* Check reducer */
      if (reducer) {
        this.#reducer = reducer;
      }
      if (!this.reducer) {
        throw new Error(`'reducer' not set.`);
      }
      /* Create effect */
      this.#effect = Effect.create((change) => {
        const result = this.reducer(change);
        /* Only update non-undefined result; 
        this mechanism can be used to update selectively */
        if (result !== undefined) {
          this.current = result;
        }
      }, condition);

      this.#effect.register(subscription);

      return this;
    }

    unbind() {
      if (this.subscription) {
        this.effect.deregister(this.subscription);
        this.#effect = null;
        this.#subscription = null;
      }
      return this;
    }
  };
};
