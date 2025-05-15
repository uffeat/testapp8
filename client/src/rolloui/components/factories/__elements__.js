/* 

*/

export const __elements__ = (parent, config, ...factories) => {
  return class extends parent {
    static name = "__elements__";

    #__elements__;

    constructor() {
      super();
      this.#__elements__ = new (class Elements {
        /* Freezes self. Chainable. */
        freeze() {
          Object.freeze(this);
          return this;
        }
        update(object) {
          Object.assign(this, object)
          return this;
        }
      })();
    }

    /* Returns elements store. */
    get __elements__() {
      return this.#__elements__;
    }
  };
};
