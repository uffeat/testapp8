/* TODO
- Refactor, so can bind to multiple. OK, to still have a reducer, but as default! 
*/

/* Implements features for binding value reactively to a single 
multi-value reactive object. */
export const bind = (parent, config, ...factories) => {
  return class bind extends parent {
    /* Returns default reducer. */
    get reducer() {
      return this.#reducer;
    }
    /* Sets default reducer. */
    set reducer(reducer) {
      this.#reducer = reducer;
    }
    #reducer;

    /* Short-hand for 'subscriptions.add'. Chainable */
    bind(publisher, reducer, condition) {
      /* Check reducer */
      if (!reducer) {
        if (!this.reducer) {
          throw new Error(`'reducer' not set.`);
        }
        reducer = this.reducer;
      }

      /* Register */
      this.subscriptions.add(
        publisher,
        (change) => {
          const result = reducer(change);
          /* Only update non-undefined result; 
          this mechanism can be used to update selectively */
          if (result !== undefined) {
            this.current = result;
          }
        },
        condition
      );

      return this;
    }

    /* Short-hand for 'subscriptions.remove'. Chainable */
    unbind(publisher) {
      this.subscriptions.remove(publisher);
      return this;
    }
  };
};
