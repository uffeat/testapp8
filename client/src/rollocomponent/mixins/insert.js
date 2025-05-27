/*
import insert from "@/rollocomponent/mixins/insert.js";
20250527
v.1.0
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};

    constructor() {
      super();
      const owner = this;
      this.#_.insert = new (class {
        /* Inserts elements 'afterbegin'. Chainable with respect to component. */
        afterbegin(...elements) {
          elements
            .reverse()
            .forEach((e) => e && owner.insertAdjacentElement("afterbegin", e));
          return owner;
        }
        /* Inserts elements 'afterend'. Chainable with respect to component. */
        afterend(...elements) {
          elements
            .reverse()
            .forEach((e) => e && owner.insertAdjacentElement("afterend", e));
          return owner;
        }
        /* Inserts elements 'beforebegin'. Chainable with respect to component. */
        beforebegin(...elements) {
          elements.forEach(
            (e) => e && owner.insertAdjacentElement("beforebegin", e)
          );
          return owner;
        }
        /* Inserts elements 'beforeend'. Chainable with respect to component. */
        beforeend(...elements) {
          elements.forEach(
            (e) => e && owner.insertAdjacentElement("beforeend", e)
          );
          return owner;
        }
      })();
    }

    /* Inserts elements. 
    Syntactical alternative to insertAdjacentElement with a leaner syntax and 
    ability to handle multiple elements. */
    get insert() {
      return this.#_.insert;
    }
  };
};
