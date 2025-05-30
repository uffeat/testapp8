/*
import find from "@/rollocomponent/mixins/find.js";
20250530
v.1.1
*/

export default (parent, config) => {
  return class extends parent {
    #_ = {};
    constructor() {
      super();

      const owner = this;

      const find = (selector) => {
        const result = this.querySelectorAll(selector);
        if (result.length === 0) {
          return null;
        }
        if (result.length === 1) {
          return result[0];
        }
        /* NOTE Return values() to enable direct use of iterator helpers. */
        return result.values();
      };

      this.#_.find = new Proxy(() => {}, {
        get: (_, key) => owner.querySelector(`[key="${key}"]`),
        apply: (_, __, args) => find(...args),
      });
    }

    /* Unified (optional) alternative to 'querySelector' and 'querySelectorAll' 
    with a leaner syntax and support for 'key'. */
    get find() {
      return this.#_.find;
    }
  };
};
